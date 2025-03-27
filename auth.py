# auth.py
from tkinter import ttk, messagebox
import tkinter as tk

class LoginPage(tk.Toplevel):
    def __init__(self, master):
        super().__init__(master)
        self.title("Login")
        self.geometry("300x200")
        self.resizable(False, False)
        self.configure(bg="#D6EAF8")
        
        tk.Label(self, text="Username:", font=("Helvetica", 10), bg="#D6EAF8").pack(pady=(20,5))
        self.entry_user = ttk.Entry(self, width=30)
        self.entry_user.pack(pady=5)
        
        tk.Label(self, text="Password:", font=("Helvetica", 10), bg="#D6EAF8").pack(pady=5)
        self.entry_pw = ttk.Entry(self, width=30, show="*")
        self.entry_pw.pack(pady=5)
        
        ttk.Button(self, text="Login", command=self.validate_login).pack(pady=15)
    
    def validate_login(self):
        username = self.entry_user.get()
        password = self.entry_pw.get()
        if self.check_credentials(username, password):
            messagebox.showinfo("Success", f"Welcome {username}!")
            self.destroy()  # Close login window
        else:
            messagebox.showerror("Error", "Invalid username or password.")
    
    def check_credentials(self, username, password):
        try:
            with open("credentials.txt", "r") as f:
                for line in f:
                    parts = line.strip().split(",")
                    if len(parts) >= 4:
                        stored_user = parts[1]
                        stored_pw = parts[3]
                        if stored_user == username and stored_pw == password:
                            return True
            return False
        except FileNotFoundError:
            messagebox.showerror("Error", "No credentials found. Please register first.")
            return False

class SignupPage(tk.Toplevel):
    def __init__(self, master):
        super().__init__(master)
        self.title("Register")
        self.geometry("300x200")
        self.resizable(False, False)
        self.configure(bg="#D5F5E3")
        
        tk.Label(self, text="New Username:", font=("Helvetica", 10), bg="#D5F5E3").pack(pady=(20,5))
        self.entry_user = ttk.Entry(self, width=30)
        self.entry_user.pack(pady=5)
        
        tk.Label(self, text="New Password:", font=("Helvetica", 10), bg="#D5F5E3").pack(pady=5)
        self.entry_pw = ttk.Entry(self, width=30, show="*")
        self.entry_pw.pack(pady=5)
        
        ttk.Button(self, text="Register", command=self.register_user).pack(pady=15)
    
    def register_user(self):
        user = self.entry_user.get()
        pw = self.entry_pw.get()
        if len(pw) < 4:
            messagebox.showerror("Error", "Password must be at least 4 characters long.")
            return
        if not self.is_username_available(user):
            messagebox.showerror("Error", "Username already exists.")
            return
        with open("credentials.txt", "a") as f:
            f.write(f"Username,{user},Password,{pw},\n")
        messagebox.showinfo("Success", "Account created successfully!")
        self.destroy()
    
    def is_username_available(self, username):
        try:
            with open("credentials.txt", "r") as f:
                for line in f:
                    parts = line.strip().split(",")
                    if len(parts) >= 2 and parts[1] == username:
                        return False
            return True
        except FileNotFoundError:
            return True
