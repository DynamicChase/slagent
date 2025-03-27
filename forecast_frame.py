# forecast_frame.py
import tkinter as tk
from tkinter import ttk, messagebox
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

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
        filtered = self.df[(self.df['category'] == selected_cat) & (self.df['sub_category'] == selected_subcat)]
        # Create unique product list (by product name and sale_price)
        unique_products = filtered[['product', 'sale_price']].drop_duplicates().reset_index(drop=True)
        self.unique_products = unique_products  # store for later use
        self.product_listbox.delete(0, tk.END)
        for idx, row in unique_products.iterrows():
            self.product_listbox.insert(tk.END, f"{idx}: {row['product']} (Sale Price: {row['sale_price']})")

    def plot_forecast(self):
        # Get selected product index from listbox
        try:
            selection = self.product_listbox.get(self.product_listbox.curselection())
            product_index = int(selection.split(":")[0])
        except Exception:
            messagebox.showerror("Error", "Please select a product from the list.")
            return

        selected_product = self.unique_products.loc[product_index]
        sale_price = selected_product['sale_price']
        product_name = selected_product['product']

        # Load monthly inflation forecast CSV.
        # CSV must have columns: 'Date' and 'Forecasted Inflation Rate (%)'
        try:
            inflation_df = pd.read_csv('monthly_inflation_forecast.csv', parse_dates=['Date'], index_col='Date')
            inflation_df.sort_index(inplace=True)
        except Exception as e:
            messagebox.showerror("Error", f"Could not load inflation forecast CSV:\n{e}")
            return

        # Compute cumulative inflation factors for the next 5 years (60 months).
        # Convert the annual rate to a monthly effective multiplier:
        # monthly_multiplier = 1 + (annual_rate/100)/12
        cumulative_factors = {}
        cumulative_factor = 1.0
        for forecast_date, row in inflation_df.iterrows():
            rate = row['Forecasted Inflation Rate (%)']
            monthly_multiplier = 1 + (rate / 100) / 12
            cumulative_factor *= monthly_multiplier
            cumulative_factors[forecast_date.date()] = cumulative_factor

        # Prepare forecast data: expected price = sale_price * cumulative factor for each month.
        forecast_dates = sorted(cumulative_factors.keys())
        forecast_prices = [sale_price * cumulative_factors[date] for date in forecast_dates]
        # Convert forecast_dates to datetime objects (first day of the month)
        forecast_dates_dt = [datetime.strptime(date.strftime('%Y-%m-01'), '%Y-%m-%d') for date in forecast_dates]

        # Save the comparison table for the selected product
        comparison_df = pd.DataFrame({
            'Date': forecast_dates_dt,
            'Expected Price': forecast_prices
        })
        # comparison_df.to_csv('price_comparison_monthly_selected.csv', index=False)
        # messagebox.showinfo("Info", "Comparison data saved to 'price_comparison_monthly_selected.csv'.")

        # Plot forecast using matplotlib
        plt.figure(figsize=(12, 6))
        plt.plot(forecast_dates_dt, forecast_prices, marker='o', color='red', label='Forecasted Price')
        plt.axhline(y=sale_price, color='blue', linestyle='--', label='Original Sale Price')
        plt.xlabel('Date', fontsize=12)
        plt.ylabel('Price', fontsize=12)
        plt.title(f"Monthly Price Forecast for '{product_name}' for Next 5 Years", fontsize=14)
        plt.legend()
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.show()
