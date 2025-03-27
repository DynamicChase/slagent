# commodity.py
from tkinter import ttk, messagebox
import tkinter as tk
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import matplotlib.dates as mdates

from utils import compute_cumulative_inflation, filter_forecast_data

# Pre-defined lists (can also be imported from a config module)
AVAILABLE_YEARS = [str(y) for y in range(2023, 2031)]
AVAILABLE_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
MONTH_MAP = {month: index for index, month in enumerate(AVAILABLE_MONTHS, start=1)}

class CommodityExchangeFrame(tk.Frame):
    def __init__(self, parent):
        super().__init__(parent, bg="#E8F8F5")
        tk.Label(self, text="Commodity Exchange Dashboard", font=("Helvetica", 16, "bold"),
                 bg="#E8F8F5", fg="#1B4F72").pack(pady=10)
        
        try:
            self.comm_df = pd.read_csv('Price_Agriculture_commodities_Week.csv')
        except Exception as e:
            messagebox.showerror("Error", f"Could not load commodity CSV:\n{e}")
            return
        
        select_frame = tk.Frame(self, bg="#E8F8F5")
        select_frame.pack(pady=10, padx=10, fill="x")
        
        tk.Label(select_frame, text="Select State:", font=("Helvetica", 12), bg="#E8F8F5")\
            .grid(row=0, column=0, padx=5, pady=5, sticky="w")
        states = sorted(self.comm_df['State'].unique())
        self.state_cb = ttk.Combobox(select_frame, values=states, state="readonly", width=25)
        self.state_cb.grid(row=0, column=1, padx=5, pady=5)
        self.state_cb.bind("<<ComboboxSelected>>", self.update_districts)
        
        tk.Label(select_frame, text="Select District:", font=("Helvetica", 12), bg="#E8F8F5")\
            .grid(row=1, column=0, padx=5, pady=5, sticky="w")
        self.district_cb = ttk.Combobox(select_frame, state="readonly", width=25)
        self.district_cb.grid(row=1, column=1, padx=5, pady=5)
        self.district_cb.bind("<<ComboboxSelected>>", self.update_markets)
        
        tk.Label(select_frame, text="Select Market:", font=("Helvetica", 12), bg="#E8F8F5")\
            .grid(row=2, column=0, padx=5, pady=5, sticky="w")
        self.market_cb = ttk.Combobox(select_frame, state="readonly", width=25)
        self.market_cb.grid(row=2, column=1, padx=5, pady=5)
        self.market_cb.bind("<<ComboboxSelected>>", self.update_commodities)
        
        tk.Label(select_frame, text="Select Commodity:", font=("Helvetica", 12), bg="#E8F8F5")\
            .grid(row=3, column=0, padx=5, pady=5, sticky="w")
        self.commodity_cb = ttk.Combobox(select_frame, state="readonly", width=25)
        self.commodity_cb.grid(row=3, column=1, padx=5, pady=5)
        
        tk.Label(select_frame, text="Start Year:", font=("Helvetica", 12), bg="#E8F8F5")\
            .grid(row=4, column=0, padx=5, pady=5, sticky="w")
        self.start_year_cb = ttk.Combobox(select_frame, values=AVAILABLE_YEARS, state="readonly", width=25)
        self.start_year_cb.grid(row=4, column=1, padx=5, pady=5)
        
        tk.Label(select_frame, text="Start Month:", font=("Helvetica", 12), bg="#E8F8F5")\
            .grid(row=5, column=0, padx=5, pady=5, sticky="w")
        self.start_month_cb = ttk.Combobox(select_frame, values=AVAILABLE_MONTHS, state="readonly", width=25)
        self.start_month_cb.grid(row=5, column=1, padx=5, pady=5)
        
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
        
        filtered = self.comm_df[
            (self.comm_df['State'] == selected_state) &
            (self.comm_df['District'] == selected_district) &
            (self.comm_df['Market'] == selected_market) &
            (self.comm_df['Commodity'] == selected_commodity)
        ]
        if filtered.empty:
            messagebox.showerror("Error", "No data available for the selected combination.")
            return
        
        try:
            # Prices are assumed to be per quintal.
            modal_price = float(filtered.iloc[0]['Modal Price'])
        except Exception as e:
            messagebox.showerror("Error", f"Error reading price value:\n{e}")
            return
        
        try:
            inflation_df = pd.read_csv('monthly_inflation_forecast.csv', parse_dates=['Date'], index_col='Date')
            inflation_df.sort_index(inplace=True)
        except Exception as e:
            messagebox.showerror("Error", f"Could not load inflation forecast CSV:\n{e}")
            return
        
        cumulative_factors = compute_cumulative_inflation(inflation_df)
        forecast_dates = sorted(cumulative_factors.keys())
        forecast_prices = [modal_price * cumulative_factors[date] for date in forecast_dates]
        forecast_dates_dt = [datetime.strptime(date.strftime('%Y-%m-01'), '%Y-%m-%d') for date in forecast_dates]
        
        if start_year and start_month:
            try:
                forecast_dates_dt, forecast_prices = filter_forecast_data(forecast_dates_dt, forecast_prices, start_year, start_month, MONTH_MAP)
                if not forecast_dates_dt:
                    messagebox.showerror("Error", "No forecast data available after the selected start date.")
                    return
                initial_forecast_price = forecast_prices[0]
                messagebox.showinfo("Forecast Price",
                                    f"Forecasted price on {datetime(int(start_year), MONTH_MAP[start_month], 1).strftime('%b %Y')} (per Quintal): {initial_forecast_price:.2f}")
            except Exception as e:
                messagebox.showerror("Error", f"Error processing start date:\n{e}")
                return
        
        plt.figure(figsize=(12, 6))
        plt.plot(forecast_dates_dt, forecast_prices, marker='o', color='red', label='Forecasted Price (per Quintal)')
        plt.axhline(y=modal_price, color='blue', linestyle='--', label='Original Modal Price (per Quintal)')
        plt.xlabel('Date', fontsize=12)
        plt.ylabel('Price (per Quintal)', fontsize=12)
        plt.title(f"Monthly Price Forecast for '{selected_commodity}'\n{selected_market}, {selected_district}, {selected_state}", fontsize=14)
        plt.legend()
        ax = plt.gca()
        ax.xaxis.set_major_locator(mdates.MonthLocator())
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
        plt.setp(ax.get_xticklabels(), rotation=45, ha='right')
        plt.tight_layout()
        plt.show()
