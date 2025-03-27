# main.py
import tkinter as tk
from tkinter import ttk
from auth import LoginPage, SignupPage
from commodity import CommodityExchangeFrame
from product_forecast import ForecastFrame

class MainApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Product Price Forecast Application")
        self.geometry("800x700")
        self.resizable(False, False)
        
        self.withdraw()
        self.after(0, self.show_login)
        
        notebook = ttk.Notebook(self)
        notebook.pack(fill="both", expand=True)
        
        self.tab1 = CommodityExchangeFrame(notebook)
        notebook.add(self.tab1, text="Commodity Exchange")
        
        self.tab2 = ForecastFrame(notebook)
        notebook.add(self.tab2, text="Price Forecast")
    
    def show_login(self):
        login = LoginPage(self)
        signup_btn = ttk.Button(login, text="Register", command=lambda: SignupPage(self))
        signup_btn.pack(pady=(0,10))
        self.wait_window(login)
        self.deiconify()

if __name__ == "__main__":
    app = MainApp()
    app.mainloop()
