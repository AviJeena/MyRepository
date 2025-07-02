import tkinter as tk
from tkinter import ttk, messagebox
from googletrans import Translator, LANGUAGES

# Create translator object
translator = Translator()

# List of language names
languages = list(LANGUAGES.values())

# Reverse LANGUAGES dict to get language codes
lang_codes = {v: k for k, v in LANGUAGES.items()}

# Create GUI
root = tk.Tk()
root.title("Multilanguage Translator")
root.geometry("800x400")
root.resizable(False, False)
root.configure(bg="lightblue")

# Labels
tk.Label(root, text="Enter Text", font=("Arial", 14), bg="lightblue").place(x=50, y=20)
tk.Label(root, text="Translated Text", font=("Arial", 14), bg="lightblue").place(x=450, y=20)

# Text boxes
input_text = tk.Text(root, height=10, width=40, font=("Arial", 12))
input_text.place(x=50, y=60)

output_text = tk.Text(root, height=10, width=40, font=("Arial", 12))
output_text.place(x=450, y=60)

# Language dropdowns
tk.Label(root, text="From", bg="lightblue", font=("Arial", 12)).place(x=50, y=270)
src_lang = ttk.Combobox(root, values=languages, width=20, state="readonly")
src_lang.place(x=100, y=270)
src_lang.set("english")

tk.Label(root, text="To", bg="lightblue", font=("Arial", 12)).place(x=450, y=270)
dest_lang = ttk.Combobox(root, values=languages, width=20, state="readonly")
dest_lang.place(x=500, y=270)
dest_lang.set("hindi")

# Translate function
def translate_text():
    try:
        src = lang_codes[src_lang.get()]
        dest = lang_codes[dest_lang.get()]
        text = input_text.get("1.0", tk.END).strip()
        if not text:
            messagebox.showwarning("Empty Input", "Please enter some text to translate.")
            return
        translated = translator.translate(text, src=src, dest=dest)
        output_text.delete("1.0", tk.END)
        output_text.insert(tk.END, translated.text)
    except Exception as e:
        messagebox.showerror("Translation Error", str(e))

# Buttons
translate_btn = tk.Button(root, text="Translate", font=("Arial", 12), bg="green", fg="white", command=translate_text)
translate_btn.place(x=350, y=330)

clear_btn = tk.Button(root, text="Clear", font=("Arial", 12), bg="red", fg="white",
                      command=lambda: [input_text.delete("1.0", tk.END), output_text.delete("1.0", tk.END)])
clear_btn.place(x=450, y=330)

# Start GUI loop
root.mainloop()
