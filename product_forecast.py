# product_forecast.py
from tkinter import ttk, messagebox
import tkinter as tk
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import matplotlib.dates as mdates

from utils import compute_cumulative_inflation, filter_forecast_data

AVAILABLE_YEARS = [str(y) for y in range(2023, 2031)]
AVAILABLE_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
MONTH_MAP = {month: index for index, month in enumerate(AVAILABLE_MONTHS, start=1)}

class ForecastFrame(tk.Frame):
    def __init__(self, parent):
        super().__init__(parent, bg="#F7F9FC")
        self.configure(padx=10, pady=10)
        
        tk.Label(self, text="Product Price Forecast", font=("Helvetica", 16, "bold"),
                 bg="#F7F9FC", fg="#2C3E50").pack(pady=10)
        
        cat_frame = tk.Frame(self, bg="#F7F9FC")
        cat_frame.pack(fill="x", pady=5)
        tk.Label(cat_frame, text="Select Category:", font=("Helvetica", 12), bg="#F7F9FC")\
            .pack(side="left", padx=(0,5))
        
        try:
            self.df = pd.read_csv('BigBasket Products.csv')
        except Exception as e:
            messagebox.showerror("Error", f"Could not load product CSV:\n{e}")
            return

        categories = sorted(self.df['category'].unique())
        self.category_cb = ttk.Combobox(cat_frame, values=categories, state="readonly", width=40)
        self.category_cb.pack(side="left")
        self.category_cb.bind("<<ComboboxSelected>>", self.update_subcategories)

        subcat_frame = tk.Frame(self, bg="#F7F9FC")
        subcat_frame.pack(fill="x", pady=5)
        tk.Label(subcat_frame, text="Select Sub-Category:", font=("Helvetica", 12), bg="#F7F9FC")\
            .pack(side="left", padx=(0,5))
        self.subcategory_cb = ttk.Combobox(subcat_frame, state="readonly", width=40)
        self.subcategory_cb.pack(side="left")
        self.subcategory_cb.bind("<<ComboboxSelected>>", self.update_products)

        prod_frame = tk.Frame(self, bg="#F7F9FC")
        prod_frame.pack(fill="both", pady=5, expand=True)
        tk.Label(prod_frame, text="Select Product:", font=("Helvetica", 12), bg="#F7F9FC")\
            .pack(anchor="nw")
        self.product_listbox = tk.Listbox(prod_frame, width=70, height=10)
        self.product_listbox.pack(fill="both", padx=5, pady=5)
        
        date_frame = tk.Frame(self, bg="#F7F9FC")
        date_frame.pack(fill="x", pady=5)
        tk.Label(date_frame, text="Start Year:", font=("Helvetica", 12), bg="#F7F9FC")\
            .pack(side="left", padx=(0,5))
        self.start_year_cb = ttk.Combobox(date_frame, values=AVAILABLE_YEARS, state="readonly", width=15)
        self.start_year_cb.pack(side="left", padx=(0,10))
        tk.Label(date_frame, text="Start Month:", font=("Helvetica", 12), bg="#F7F9FC")\
            .pack(side="left", padx=(0,5))
        self.start_month_cb = ttk.Combobox(date_frame, values=AVAILABLE_MONTHS, state="readonly", width=15)
        self.start_month_cb.pack(side="left")
        
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
        self.unique_products = unique_products
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

        cumulative_factors = compute_cumulative_inflation(inflation_df)
        forecast_dates = sorted(cumulative_factors.keys())
        forecast_prices = [sale_price * cumulative_factors[date] for date in forecast_dates]
        forecast_dates_dt = [datetime.strptime(date.strftime('%Y-%m-01'), '%Y-%m-%d') for date in forecast_dates]

        start_year = self.start_year_cb.get()
        start_month = self.start_month_cb.get()
        if start_year and start_month:
            try:
                forecast_dates_dt, forecast_prices = filter_forecast_data(forecast_dates_dt, forecast_prices, start_year, start_month, MONTH_MAP)
                if not forecast_dates_dt:
                    messagebox.showerror("Error", "No forecast data available after the selected start date.")
                    return
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
