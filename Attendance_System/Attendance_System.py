
import os
import cv2
import time
import numpy as np
from threading import Thread
import face_recognition as fr
import tkinter as tk
from tkinter import messagebox, simpledialog
import pyttsx3
import csv
from datetime import datetime, timedelta

exclude_names = ['Unknown', 'HOD', 'Principal']
engine = pyttsx3.init()

# Path to store teacher and attendance records
teachers_file = './teachers.csv'

class VideoStream:
    def __init__(self, stream):
        self.video = cv2.VideoCapture(stream)
        self.video.set(cv2.CAP_PROP_FPS, 60)

        if not self.video.isOpened():
            raise Exception("Cannot access the webcam stream.")

        self.grabbed, self.frame = self.video.read()
        self.stopped = True
        self.thread = Thread(target=self.update)
        self.thread.daemon = True

    def start(self):
        self.stopped = False
        self.thread.start()

    def update(self):
        while not self.stopped:
            self.grabbed, self.frame = self.video.read()
        self.video.release()

    def read(self):
        return self.frame

    def stop(self):
        self.stopped = True

def encode_faces(image_folder='./Images'):
    encoded_data = {}
    if not os.path.exists(image_folder):
        raise FileNotFoundError(f"Image folder '{image_folder}' does not exist.")

    for dirpath, _, fnames in os.walk(image_folder):
        for f in fnames:
            if f.endswith((".jpg", ".png")):
                img_path = os.path.join(dirpath, f)
                face = fr.load_image_file(img_path)
                encodings = fr.face_encodings(face)
                if encodings:
                    encoded_data[f.split(".")[0]] = encodings[0]
                else:
                    print(f"Warning: No face found in {f}")

    return encoded_data

attendance_log = {}

def Attendance(name, period, records_folder='./Records'):
    today = time.strftime('%d_%m_%Y')
    record_file = os.path.join(records_folder, f'period{period}_{today}.csv')
    os.makedirs(records_folder, exist_ok=True)

    if not os.path.exists(record_file):
        with open(record_file, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(["Name", "Date", "Time"])

    with open(record_file, 'r') as f:
        data = f.readlines()
        names = [line.split(',')[0] for line in data]

    if name not in names and name not in exclude_names:
        current_time = datetime.now()
        if name not in attendance_log or current_time - attendance_log[name] > timedelta(minutes=5):
            with open(record_file, 'a', newline='') as fs:
                writer = csv.writer(fs)
                current_date = time.strftime('%d/%m/%Y')
                writer.writerow([name, current_date, current_time.strftime('%H:%M:%S')])
                attendance_log[name] = current_time
                engine.say(f"Attendance recorded for {name}")
                engine.runAndWait()

def generate_summary(period, records_folder='./Records'):
    today = time.strftime('%d_%m_%Y')
    record_file = os.path.join(records_folder, f'period{period}_{today}.csv')

    if not os.path.exists(record_file):
        messagebox.showinfo("Attendance Summary", f"No attendance records found for period {period} today.")
        return

    summary = {}
    with open(record_file, 'r') as f:
        reader = csv.reader(f)
        next(reader)  # Skip header
        for row in reader:
            name = row[0]
            summary[name] = summary.get(name, 0) + 1

    summary_message = f"Attendance Summary for Period {period} Today:\n\n"
    for name, count in summary.items():
        summary_message += f"{name}: {count} times\n"

    messagebox.showinfo("Attendance Summary", summary_message)

def authenticate_teacher():
    if not os.path.exists(teachers_file):
        with open(teachers_file, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(["Name", "Course", "Subject", "Passkey"])

    with open(teachers_file, 'r') as f:
        reader = csv.reader(f)
        teachers = {row[0]: row[3] for row in reader if row}  # Dictionary {Name: Passkey}

    teacher_name = simpledialog.askstring("Login", "Enter your name:")
    if teacher_name in teachers:
        passkey = simpledialog.askstring("Login", "Enter your passkey:")
        if teachers[teacher_name] != passkey:
            messagebox.showerror("Error", "Invalid passkey.")
            return None, None
    else:
        # Register new teacher
        course = simpledialog.askstring("Register", "Enter your course:")
        subject = simpledialog.askstring("Register", "Enter your subject:")
        passkey = simpledialog.askstring("Register", "Set your passkey:")
        with open(teachers_file, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([teacher_name, course, subject, passkey])

    period = simpledialog.askstring("Period", "Enter period for attendance:")
    return teacher_name, period

def start_attendance():
    global video_stream
    teacher_name, period = authenticate_teacher()
    if not teacher_name or not period:
        return  # Abort if login failed or period not entered

    try:
        faces = encode_faces()
        encoded_faces = list(faces.values())
        faces_name = list(faces.keys())

        video_stream = VideoStream(stream=0)
        video_stream.start()

        frame_count = 0
        frame_interval = 10  # Process every 10 frames

        while True:
            if video_stream.stopped:
                break

            frame = video_stream.read()
            if frame is None:
                continue

            # Adjust brightness and contrast for better face detection
            frame = cv2.convertScaleAbs(frame, alpha=1.2, beta=50)

            if frame_count % frame_interval == 0:
                face_locations = fr.face_locations(frame)
                unknown_face_encodings = fr.face_encodings(frame, face_locations)

                face_names = []
                for face_encoding in unknown_face_encodings:
                    matches = fr.compare_faces(encoded_faces, face_encoding)
                    name = "Unknown"

                    face_distances = fr.face_distance(encoded_faces, face_encoding)
                    best_match_index = np.argmin(face_distances)
                    if matches[best_match_index]:
                        name = faces_name[best_match_index]

                    face_names.append(name)

            frame_count += 1

            for (top, right, bottom, left), name in zip(face_locations, face_names):
                cv2.rectangle(frame, (left-20, top-20), (right+20, bottom+20), (0, 255, 0), 2)
                cv2.rectangle(frame, (left-20, bottom -15), (right+20, bottom+20), (0, 255, 0), cv2.FILLED)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left -20, bottom + 15), font, 0.85, (255, 255, 255), 2)
                Attendance(name, period)

            time.sleep(0.04)
            cv2.imshow('frame', frame)
            key = cv2.waitKey(1)
            if key == ord('q'):
                break

    except Exception as e:
        print(f"Error: {e}")
        messagebox.showerror("Error", str(e))

    finally:
        if video_stream:
            video_stream.stop()
        cv2.destroyAllWindows()

def stop_attendance():
    global video_stream
    if video_stream:
        video_stream.stop()
        cv2.destroyAllWindows()
        messagebox.showinfo("Info", "Attendance stopped.")

def setup_gui():
    window = tk.Tk()
    window.title("Attendance System")

    start_button = tk.Button(window, text="Start Attendance", command=start_attendance)
    start_button.pack(pady=10)

    stop_button = tk.Button(window, text="Stop Attendance", command=stop_attendance)
    stop_button.pack(pady=10)

    summary_button = tk.Button(window, text="Generate Summary", command=lambda: generate_summary(simpledialog.askstring("Period", "Enter period:")))
    summary_button.pack(pady=10)

    window.mainloop()

if __name__ == "__main__":
    video_stream = None
    setup_gui().