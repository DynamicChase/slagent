import tkinter as tk
from tkinter import ttk, messagebox
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import matplotlib.dates as mdates  # for date locators/formatters

# Pre-defined lists for start year and month selections.
AVAILABLE_YEARS = [str(y) for y in range(2023, 2031)]
AVAILABLE_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
# Mapping month abbreviations to month numbers.
MONTH_MAP = {month: index for index, month in enumerate(AVAILABLE_MONTHS, start=1)}

# ------------------------------
# Tab 1: Commodity Exchange Dashboard (Updated)
# ------------------------------
class CommodityExchangeFrame(tk.Frame):
    def __init__(self, parent):
        super().__init__(parent, bg="#E8F8F5")
        tk.Label(self, text="Commodity Exchange Dashboard", font=("Helvetica", 16, "bold"),
                 bg="#E8F8F5", fg="#1B4F72").pack(pady=10)
        
        # Load commodity dataset
        try:
            self.comm_df = pd.read_csv('Price_Agriculture_commodities_Week.csv')
        except Exception as e:
            messagebox.showerror("Error", f"Could not load commodity CSV:\n{e}")
            return
        
        # Create selection frame for filtering by State, District, Market, Commodity
        select_frame = tk.Frame(self, bg="#E8F8F5")
        select_frame.pack(pady=10, padx=10, fill="x")
        
        # --- State Selection ---
        tk.Label(select_frame, text="Select State:", font=("Helvetica", 12), bg="#E8F8F5").grid(
            row=0, column=0, padx=5, pady=5, sticky="w")
        states = sorted(self.comm_df['State'].unique())
        self.state_cb = ttk.Combobox(select_frame, values=states, state="readonly", width=25)
        self.state_cb.grid(row=0, column=1, padx=5, pady=5)
        self.state_cb.bind("<<ComboboxSelected>>", self.update_districts)
        
        # --- District Selection ---
        tk.Label(select_frame, text="Select District:", font=("Helvetica", 12), bg="#E8F8F5").grid(
            row=1, column=0, padx=5, pady=5, sticky="w")
        self.district_cb = ttk.Combobox(select_frame, state="readonly", width=25)
        self.district_cb.grid(row=1, column=1, padx=5, pady=5)
        self.district_cb.bind("<<ComboboxSelected>>", self.update_markets)
        
        # --- Market Selection ---
        tk.Label(select_frame, text="Select Market:", font=("Helvetica", 12), bg="#E8F8F5").grid(
            row=2, column=0, padx=5, pady=5, sticky="w")
        self.market_cb = ttk.Combobox(select_frame, state="readonly", width=25)
        self.market_cb.grid(row=2, column=1, padx=5, pady=5)
        self.market_cb.bind("<<ComboboxSelected>>", self.update_commodities)
        
        # --- Commodity Selection ---
        tk.Label(select_frame, text="Select Commodity:", font=("Helvetica", 12), bg="#E8F8F5").grid(
            row=3, column=0, padx=5, pady=5, sticky="w")
        self.commodity_cb = ttk.Combobox(select_frame, state="readonly", width=25)
        self.commodity_cb.grid(row=3, column=1, padx=5, pady=5)
        
        # --- Start Date Selection (Year and Month) ---
        tk.Label(select_frame, text="Start Year:", font=("Helvetica", 12), bg="#E8F8F5").grid(
            row=4, column=0, padx=5, pady=5, sticky="w")
        self.start_year_cb = ttk.Combobox(select_frame, values=AVAILABLE_YEARS, state="readonly", width=25)
        self.start_year_cb.grid(row=4, column=1, padx=5, pady=5)
        
        tk.Label(select_frame, text="Start Month:", font=("Helvetica", 12), bg="#E8F8F5").grid(
            row=5, column=0, padx=5, pady=5, sticky="w")
        self.start_month_cb = ttk.Combobox(select_frame, values=AVAILABLE_MONTHS, state="readonly", width=25)
        self.start_month_cb.grid(row=5, column=1, padx=5, pady=5)
        
        # Button to plot forecast
        self.plot_btn = ttk.Button(self, text="Plot Price Forecast", command=self.plot_forecast)
        self.plot_btn.pack(pady=10)
        
    def update_districts(self, event=None):
        selected_state = self.state_cb.get()
        districts = sorted(self.comm_df[self.comm_df['State'] == selected_state]['District'].unique())
        self.district_cb['values'] = districts
        self.district_cb.set('')
        self.market_cb.set('')
        self.commodity_cb.set('')
    
    def update_markets(self, event=None):
        selected_state = self.state_cb.get()
        selected_district = self.district_cb.get()
        markets = sorted(self.comm_df[
            (self.comm_df['State'] == selected_state) &
            (self.comm_df['District'] == selected_district)
        ]['Market'].unique())
        self.market_cb['values'] = markets
        self.market_cb.set('')
        self.commodity_cb.set('')
    
    def update_commodities(self, event=None):
        selected_state = self.state_cb.get()
        selected_district = self.district_cb.get()
        selected_market = self.market_cb.get()
        commodities = sorted(self.comm_df[
            (self.comm_df['State'] == selected_state) &
            (self.comm_df['District'] == selected_district) &
            (self.comm_df['Market'] == selected_market)
        ]['Commodity'].unique())
        self.commodity_cb['values'] = commodities
        self.commodity_cb.set('')
    
    def plot_forecast(self):
        selected_state = self.state_cb.get()
        selected_district = self.district_cb.get()
        selected_market = self.market_cb.get()
        selected_commodity = self.commodity_cb.get()
        start_year = self.start_year_cb.get()
        start_month = self.start_month_cb.get()
        
        if not all([selected_state, selected_district, selected_market, selected_commodity]):
            messagebox.showerror("Error", "Please make all selections for State, District, Market and Commodity.")
            return
        
        # Filter data based on selections. Here, we take the first record for the commodity.
        filtered = self.comm_df[
            (self.comm_df['State'] == selected_state) &
            (self.comm_df['District'] == selected_district) &
            (self.comm_df['Market'] == selected_market) &
            (self.comm_df['Commodity'] == selected_commodity)
        ]
        if filtered.empty:
            messagebox.showerror("Error", "No data available for the selected combination.")
            return
        
        # Use Modal Price for the forecast; change to Min or Max if needed.
        try:
            modal_price = float(filtered.iloc[0]['Modal Price'])
        except Exception as e:
            messagebox.showerror("Error", f"Error reading price value:\n{e}")
            return
        
        # Load the monthly inflation forecast CSV.
        try:
            inflation_df = pd.read_csv('monthly_inflation_forecast.csv', parse_dates=['Date'], index_col='Date')
            inflation_df.sort_index(inplace=True)
        except Exception as e:
            messagebox.showerror("Error", f"Could not load inflation forecast CSV:\n{e}")
            return

        # Compute cumulative inflation factors for the next 5 years (60 months).
        cumulative_factor = 1.0
        cumulative_factors = {}
        for forecast_date, row in inflation_df.iterrows():
            rate = row['Forecasted Inflation Rate (%)']
            monthly_multiplier = 1 + (rate / 100) / 12
            cumulative_factor *= monthly_multiplier
            cumulative_factors[forecast_date.date()] = cumulative_factor

        # Prepare forecast data: expected price = modal_price * cumulative factor for each month.
        forecast_dates = sorted(cumulative_factors.keys())
        forecast_prices = [modal_price * cumulative_factors[date] for date in forecast_dates]
        forecast_dates_dt = [datetime.strptime(date.strftime('%Y-%m-01'), '%Y-%m-%d') for date in forecast_dates]
        
        # If start year and month are selected, filter the forecast data accordingly.
        if start_year and start_month:
            try:
                start_date = datetime(int(start_year), MONTH_MAP[start_month], 1)
                # Filter forecast data: include only dates >= start_date
                filtered_dates = []
                filtered_prices = []
                for d, p in zip(forecast_dates_dt, forecast_prices):
                    if d >= start_date:
                        filtered_dates.append(d)
                        filtered_prices.append(p)
                # If no data after the selected start date, warn the user.
                if not filtered_dates:
                    messagebox.showerror("Error", "No forecast data available after the selected start date.")
                    return
                forecast_dates_dt = filtered_dates
                forecast_prices = filtered_prices
            except Exception as e:
                messagebox.showerror("Error", f"Error processing start date:\n{e}")
                return

        # Plot forecast using matplotlib with month-year ticks.
        plt.figure(figsize=(12, 6))
        plt.plot(forecast_dates_dt, forecast_prices, marker='o', color='red', label='Forecasted Price')
        plt.axhline(y=modal_price, color='blue', linestyle='--', label='Original Modal Price')
        plt.xlabel('Date', fontsize=12)
        plt.ylabel('Price', fontsize=12)
        plt.title(
            f"Monthly Price Forecast for '{selected_commodity}'\n{selected_market}, {selected_district}, {selected_state}",
            fontsize=14
        )
        plt.legend()
        ax = plt.gca()
        ax.xaxis.set_major_locator(mdates.MonthLocator())
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
        plt.setp(ax.get_xticklabels(), rotation=45, ha='right')
        plt.tight_layout()
        plt.show()


# ------------------------------
# Tab 2: Product Sales & Inventory Analysis (Placeholder)
# ------------------------------
class SalesAnalysisFrame(tk.Frame):
    def __init__(self, parent):
        super().__init__(parent, bg="#FEF9E7")
        tk.Label(self, text="Product Sales & Inventory Analysis", font=("Helvetica", 16, "bold"),
                 bg="#FEF9E7", fg="#B9770E").pack(pady=10)
        # Placeholder: Treeview for sales table
        tree = ttk.Treeview(self, columns=("Product", "Sales Volume"), show="headings", height=8)
        tree.heading("Product", text="Product")
        tree.heading("Sales Volume", text="Sales Volume")
        tree.pack(pady=10, padx=10, fill="x")
        sample_sales = [("Eggs", "150"), ("Milk", "200"), ("Bread", "120")]
        for item in sample_sales:
            tree.insert("", "end", values=item)
        tk.Label(self, text="(Bar Chart Placeholder for Sales vs Commodity Price)", font=("Helvetica", 10),
                 bg="#FEF9E7").pack(pady=20)


# ------------------------------
# Tab 3: Price Prediction & Forecasting (ForecastFrame)
# ------------------------------
class ForecastFrame(tk.Frame):
    def __init__(self, parent):
        super().__init__(parent, bg="#F7F9FC")
        self.configure(padx=10, pady=10)
        
        # Title label
        title = tk.Label(self, text="Product Price Forecast", font=("Helvetica", 16, "bold"),
                         bg="#F7F9FC", fg="#2C3E50")
        title.pack(pady=10)
        
        # --- Category Selection ---
        cat_frame = tk.Frame(self, bg="#F7F9FC")
        cat_frame.pack(fill="x", pady=5)
        tk.Label(cat_frame, text="Select Category:", font=("Helvetica", 12), bg="#F7F9FC").pack(side="left", padx=(0,5))
        
        try:
            self.df = pd.read_csv('BigBasket Products.csv')
        except Exception as e:
            messagebox.showerror("Error", f"Could not load product CSV:\n{e}")
            return

        categories = sorted(self.df['category'].unique())
        self.category_cb = ttk.Combobox(cat_frame, values=categories, state="readonly", width=40)
        self.category_cb.pack(side="left")
        self.category_cb.bind("<<ComboboxSelected>>", self.update_subcategories)

        # --- Sub-Category Selection ---
        subcat_frame = tk.Frame(self, bg="#F7F9FC")
        subcat_frame.pack(fill="x", pady=5)
        tk.Label(subcat_frame, text="Select Sub-Category:", font=("Helvetica", 12), bg="#F7F9FC").pack(side="left", padx=(0,5))
        self.subcategory_cb = ttk.Combobox(subcat_frame, state="readonly", width=40)
        self.subcategory_cb.pack(side="left")
        self.subcategory_cb.bind("<<ComboboxSelected>>", self.update_products)

        # --- Product List ---
        prod_frame = tk.Frame(self, bg="#F7F9FC")
        prod_frame.pack(fill="both", pady=5, expand=True)
        tk.Label(prod_frame, text="Select Product:", font=("Helvetica", 12), bg="#F7F9FC").pack(anchor="nw")
        self.product_listbox = tk.Listbox(prod_frame, width=70, height=10)
        self.product_listbox.pack(fill="both", padx=5, pady=5)
        
        # --- Start Date Selection for Forecast (Year and Month) ---
        date_frame = tk.Frame(self, bg="#F7F9FC")
        date_frame.pack(fill="x", pady=5)
        tk.Label(date_frame, text="Start Year:", font=("Helvetica", 12), bg="#F7F9FC").pack(side="left", padx=(0,5))
        self.start_year_cb = ttk.Combobox(date_frame, values=AVAILABLE_YEARS, state="readonly", width=15)
        self.start_year_cb.pack(side="left", padx=(0,10))
        tk.Label(date_frame, text="Start Month:", font=("Helvetica", 12), bg="#F7F9FC").pack(side="left", padx=(0,5))
        self.start_month_cb = ttk.Combobox(date_frame, values=AVAILABLE_MONTHS, state="readonly", width=15)
        self.start_month_cb.pack(side="left")
        
        # --- Plot Forecast Button ---
        self.plot_button = ttk.Button(self, text="Plot Forecast", command=self.plot_forecast)
        self.plot_button.pack(pady=10)

    def update_subcategories(self, event=None):
        selected_cat = self.category_cb.get()
        sub_df = self.df[self.df['category'] == selected_cat]
        subcategories = sorted(sub_df['sub_category'].unique())
        self.subcategory_cb['values'] = subcategories
        self.subcategory_cb.set('')
        self.product_listbox.delete(0, tk.END)

    def update_products(self, event=None):
        selected_cat = self.category_cb.get()
        selected_subcat = self.subcategory_cb.get()
        filtered = self.df[
            (self.df['category'] == selected_cat) & 
            (self.df['sub_category'] == selected_subcat)
        ]
        unique_products = filtered[['product', 'sale_price']].drop_duplicates().reset_index(drop=True)
        self.unique_products = unique_products  # store for later use
        self.product_listbox.delete(0, tk.END)
        for idx, row in unique_products.iterrows():
            self.product_listbox.insert(tk.END, f"{idx}: {row['product']} (Sale Price: {row['sale_price']})")

    def plot_forecast(self):
        try:
            selection = self.product_listbox.get(self.product_listbox.curselection())
            product_index = int(selection.split(":")[0])
        except Exception:
            messagebox.showerror("Error", "Please select a product from the list.")
            return

        selected_product = self.unique_products.loc[product_index]
        sale_price = selected_product['sale_price']
        product_name = selected_product['product']

        try:
            inflation_df = pd.read_csv('monthly_inflation_forecast.csv', parse_dates=['Date'], index_col='Date')
            inflation_df.sort_index(inplace=True)
        except Exception as e:
            messagebox.showerror("Error", f"Could not load inflation forecast CSV:\n{e}")
            return

        cumulative_factor = 1.0
        cumulative_factors = {}
        for forecast_date, row in inflation_df.iterrows():
            rate = row['Forecasted Inflation Rate (%)']
            monthly_multiplier = 1 + (rate / 100) / 12
            cumulative_factor *= monthly_multiplier
            cumulative_factors[forecast_date.date()] = cumulative_factor

        forecast_dates = sorted(cumulative_factors.keys())
        forecast_prices = [sale_price * cumulative_factors[date] for date in forecast_dates]
        forecast_dates_dt = [datetime.strptime(date.strftime('%Y-%m-01'), '%Y-%m-%d') for date in forecast_dates]

        # Filter forecast data based on selected start year/month (if provided)
        start_year = self.start_year_cb.get()
        start_month = self.start_month_cb.get()
        if start_year and start_month:
            try:
                start_date = datetime(int(start_year), MONTH_MAP[start_month], 1)
                filtered_dates = []
                filtered_prices = []
                for d, p in zip(forecast_dates_dt, forecast_prices):
                    if d >= start_date:
                        filtered_dates.append(d)
                        filtered_prices.append(p)
                if not filtered_dates:
                    messagebox.showerror("Error", "No forecast data available after the selected start date.")
                    return
                forecast_dates_dt = filtered_dates
                forecast_prices = filtered_prices
            except Exception as e:
                messagebox.showerror("Error", f"Error processing start date:\n{e}")
                return

        plt.figure(figsize=(12, 6))
        plt.plot(forecast_dates_dt, forecast_prices, marker='o', color='red', label='Forecasted Price')
        plt.axhline(y=sale_price, color='blue', linestyle='--', label='Original Sale Price')
        plt.xlabel('Date', fontsize=12)
        plt.ylabel('Price', fontsize=12)
        plt.title(f"Monthly Price Forecast for '{product_name}' for Next 5 Years", fontsize=14)
        plt.legend()
        ax = plt.gca()
        ax.xaxis.set_major_locator(mdates.MonthLocator())
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
        plt.setp(ax.get_xticklabels(), rotation=45, ha='right')
        plt.tight_layout()
        plt.show()


# ------------------------------
# Login and Signup Pages (auth module)
# ------------------------------
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

# ------------------------------
# Main Application with Notebook (3 Tabs)
# ------------------------------
class MainApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Product Price Forecast Application")
        self.geometry("800x700")
        self.resizable(False, False)
        
        # Hide main window until login is successful
        self.withdraw()
        self.after(0, self.show_login)
        
        # Create a Notebook (tabbed interface)
        notebook = ttk.Notebook(self)
        notebook.pack(fill="both", expand=True)
        
        # Tab 1: Commodity Exchange Dashboard (updated)
        self.tab1 = CommodityExchangeFrame(notebook)
        notebook.add(self.tab1, text="Commodity Exchange")
        
        # Tab 2: Product Sales & Inventory Analysis
        self.tab2 = SalesAnalysisFrame(notebook)
        notebook.add(self.tab2, text="Sales & Inventory")
        
        # Tab 3: Price Prediction & Forecasting (ForecastFrame)
        self.tab3 = ForecastFrame(notebook)
        notebook.add(self.tab3, text="Price Forecast")
    
    def show_login(self):
        login = LoginPage(self)
        signup_btn = ttk.Button(login, text="Register", command=lambda: SignupPage(self))
        signup_btn.pack(pady=(0,10))
        self.wait_window(login)
        self.deiconify()  # Show main window

# ------------------------------
# Dummy Frames for Tab 2 (Sales) remain unchanged
# ------------------------------
class SalesAnalysisFrame(tk.Frame):
    def __init__(self, parent):
        super().__init__(parent, bg="#FEF9E7")
        tk.Label(self, text="Product Sales & Inventory Analysis", font=("Helvetica", 16, "bold"),
                 bg="#FEF9E7", fg="#B9770E").pack(pady=10)
        tree = ttk.Treeview(self, columns=("Product", "Sales Volume"), show="headings", height=8)
        tree.heading("Product", text="Product")
        tree.heading("Sales Volume", text="Sales Volume")
        tree.pack(pady=10, padx=10, fill="x")
        sample_sales = [("Eggs", "150"), ("Milk", "200"), ("Bread", "120")]
        for item in sample_sales:
            tree.insert("", "end", values=item)
        tk.Label(self, text="(Bar Chart Placeholder for Sales vs Commodity Price)", font=("Helvetica", 10),
                 bg="#FEF9E7").pack(pady=20)

# ------------------------------
# Main Entry Point
# ------------------------------
if __name__ == "__main__":
    app = MainApp()
    app.mainloop()
