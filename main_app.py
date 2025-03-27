# main_app.py
import tkinter as tk
from tkinter import ttk
from forecast_frame import ForecastFrame
from auth import LoginPage, SignupPage

class MainApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Product Price Forecast Application")
        self.geometry("800x700")
        self.resizable(False, False)
        
        # Hide main window until login is successful
        self.withdraw()
        self.after(0, self.show_login)
        
        # Container for frames
        self.container = tk.Frame(self)
        self.container.pack(fill="both", expand=True)
        
        # Add ForecastFrame to container
        self.frames = {}
        frame = ForecastFrame(self.container)
        self.frames[ForecastFrame] = frame
        frame.pack(fill="both", expand=True)
    
    def show_login(self):
        login = LoginPage(self)
        signup_btn = ttk.Button(login, text="Register", command=lambda: SignupPage(self))
        signup_btn.pack(pady=(0,10))
        self.wait_window(login)
        self.deiconify()  # Show main window

if __name__ == "__main__":
    app = MainApp()
    app.mainloop()
