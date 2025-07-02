import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QTextEdit, QLineEdit, QPushButton, QLabel
from PyQt5.QtCore import Qt
import pyttsx3
import speech_recognition as sr
import wikipedia
import pywhatkit
import datetime
import pyjokes
import webbrowser
import os

class AssistantApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Gemini-like Desktop Assistant")
        self.setGeometry(200, 200, 600, 500)
        self.initUI()
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', 150)
        self.recognizer = sr.Recognizer()

    def initUI(self):
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)

        self.layout = QVBoxLayout()

        self.label = QLabel("Welcome to Your Desktop Assistant", self)
        self.label.setAlignment(Qt.AlignCenter)
        self.layout.addWidget(self.label)

        self.chat_area = QTextEdit()
        self.chat_area.setReadOnly(True)
        self.layout.addWidget(self.chat_area)

        self.input_field = QLineEdit()
        self.input_field.setPlaceholderText("Type your command or press 'Voice Input'")
        self.layout.addWidget(self.input_field)

        self.send_button = QPushButton("Send")
        self.send_button.clicked.connect(self.process_command)
        self.layout.addWidget(self.send_button)

        self.voice_button = QPushButton("Voice Input")
        self.voice_button.clicked.connect(self.listen_command)
        self.layout.addWidget(self.voice_button)

        self.central_widget.setLayout(self.layout)

    def speak(self, text):
        self.chat_area.append(f"Assistant: {text}")
        self.engine.say(text)
        self.engine.runAndWait()

    def listen_command(self):
        with sr.Microphone() as source:
            self.chat_area.append("Listening for command...")
            self.recognizer.adjust_for_ambient_noise(source)
            audio = self.recognizer.listen(source)

            try:
                command = self.recognizer.recognize_google(audio).lower()
                self.chat_area.append(f"You (voice): {command}")
                self.handle_command(command)
            except sr.UnknownValueError:
                self.speak("Sorry, I didn't catch that.")
            except Exception as e:
                self.speak(str(e))

    def process_command(self):
        command = self.input_field.text().lower()
        self.chat_area.append(f"You (text): {command}")
        self.input_field.clear()
        self.handle_command(command)

    def handle_command(self, command):
        if 'time' in command:
            time = datetime.datetime.now().strftime('%I:%M %p')
            self.speak(f"The time is {time}")

        elif 'date' in command:
            date = datetime.datetime.now().strftime('%B %d, %Y')
            self.speak(f"Today's date is {date}")

        elif 'wikipedia' in command:
            topic = command.replace("wikipedia", "").strip()
            if topic:
                try:
                    summary = wikipedia.summary(topic, sentences=2)
                    self.speak(summary)
                except:
                    self.speak("Sorry, I couldn't find information on that topic.")
            else:
                self.speak("Please specify a topic for Wikipedia search.")

        elif 'open youtube' in command:
            webbrowser.open("https://www.youtube.com")
            self.speak("Opening YouTube")

        elif 'open google' in command:
            webbrowser.open("https://www.google.com")
            self.speak("Opening Google")

        elif 'play' in command:
            song = command.replace("play", "").strip()
            pywhatkit.playonyt(song)
            self.speak(f"Playing {song} on YouTube")

        elif 'joke' in command:
            self.speak(pyjokes.get_joke())

        elif 'open notepad' in command:
            os.system("notepad")
            self.speak("Opening Notepad")

        elif 'exit' in command or 'quit' in command or 'stop' in command:
            self.speak("Goodbye!")
            sys.exit()

        else:
            self.speak("Sorry, I don't understand that command.")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    assistant = AssistantApp()
    assistant.show()
    sys.exit(app.exec_())
