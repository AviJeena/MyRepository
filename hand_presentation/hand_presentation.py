import cv2
import numpy as np
import os
import mediapipe as mp
import time

# MediaPipe Hands setup
mpHands = mp.solutions.hands
hands = mpHands.Hands(max_num_hands=1, min_detection_confidence=0.8)
mpDraw = mp.solutions.drawing_utils

# Load slide images
folder_path = "slides"
slide_images = sorted(os.listdir(folder_path))
slides = [cv2.imread(os.path.join(folder_path, img)) for img in slide_images]

# Initialize
slide_index = 0
gesture_threshold = 300
start_gesture_time = 0
delay_between_gestures = 1.5  # seconds

cap = cv2.VideoCapture(0)

prev_center_x = 0
gesture_detected = False

def detect_gesture(lmList):
    global prev_center_x, gesture_detected, start_gesture_time

    if len(lmList) == 0:
        return None

    x = lmList[8][0]  # Index finger tip
    current_time = time.time()

    if not gesture_detected:
        if prev_center_x != 0:
            dx = x - prev_center_x
            if abs(dx) > 100 and current_time - start_gesture_time > delay_between_gestures:
                gesture_detected = True
                start_gesture_time = current_time
                return "left" if dx < 0 else "right"

    prev_center_x = x
    if gesture_detected and current_time - start_gesture_time > delay_between_gestures:
        gesture_detected = False

    return None

while True:
    success, img = cap.read()
    img = cv2.flip(img, 1)
    h, w, c = img.shape

    # Hand tracking
    imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    result = hands.process(imgRGB)
    lmList = []

    if result.multi_hand_landmarks:
        for handLms in result.multi_hand_landmarks:
            for id, lm in enumerate(handLms.landmark):
                cx, cy = int(lm.x * w), int(lm.y * h)
                lmList.append((cx, cy))

            mpDraw.draw_landmarks(img, handLms, mpHands.HAND_CONNECTIONS)

    gesture = detect_gesture(lmList)

    if gesture == "right":
        slide_index = (slide_index + 1) % len(slides)
    elif gesture == "left":
        slide_index = (slide_index - 1) % len(slides)

    # Show slide
    slide = slides[slide_index]
    slide = cv2.resize(slide, (w, h))

    # Add webcam feed to top-right corner
    img_small = cv2.resize(img, (200, 150))
    slide[0:150, w - 200:w] = img_small

    cv2.imshow("Presentation", slide)
    key = cv2.waitKey(1)
    if key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
