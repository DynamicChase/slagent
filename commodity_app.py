import tkinter as tk
from tkinter import ttk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class CommodityAnalysisApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Commodity Analysis Dashboard")
        self.root.geometry("1200x700")
        self.root.configure(bg="#f5f5f5")
        
        # Create notebook (tabs container)
        self.notebook = ttk.Notebook(root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Create the three tabs
        self.tab1 = ttk.Frame(self.notebook)
        self.tab2 = ttk.Frame(self.notebook)
        self.tab3 = ttk.Frame(self.notebook)
        
        # Add tabs to notebook
        self.notebook.add(self.tab1, text="Commodity Exchange Dashboard")
        self.notebook.add(self.tab2, text="Product Sales & Inventory Analysis")
        self.notebook.add(self.tab3, text="Price Prediction & Forecasting")
        
        # Setup each tab
        self.setup_tab1()
        self.setup_tab2()
        self.setup_tab3()
    
    def setup_tab1(self):
        """Setup Commodity Exchange Dashboard tab"""
        # Create a frame for controls
        control_frame = ttk.LabelFrame(self.tab1, text="Commodity Controls")
        control_frame.pack(fill=tk.X, padx=10, pady=5)
        
        # Commodity selection dropdown
        ttk.Label(control_frame, text="Select Commodity:").grid(row=0, column=0, padx=5, pady=5)
        self.commodity_var = tk.StringVar()
        commodities = ["Crude Oil", "Natural Gas", "Gold", "Silver", "Copper", "Wheat", "Corn", "Coffee"]
        commodity_dropdown = ttk.Combobox(control_frame, textvariable=self.commodity_var, values=commodities)
        commodity_dropdown.grid(row=0, column=1, padx=5, pady=5)
        commodity_dropdown.current(0)
        
        # Refresh button
        refresh_btn = ttk.Button(control_frame, text="Refresh Data", command=self.refresh_commodity_data)
        refresh_btn.grid(row=0, column=2, padx=5, pady=5)
        
        # Create frame for live prices
        price_frame = ttk.LabelFrame(self.tab1, text="Live Commodity Prices")
        price_frame.pack(fill=tk.X, padx=10, pady=5)
        
        # Create Treeview for prices
        columns = ("Commodity", "Price", "Change", "% Change", "Updated")
        self.price_tree = ttk.Treeview(price_frame, columns=columns, show="headings", height=5)
        
        # Configure columns
        for col in columns:
            self.price_tree.heading(col, text=col)
            self.price_tree.column(col, width=100, anchor=tk.CENTER)
        
        self.price_tree.pack(fill=tk.X, padx=5, pady=5)
        
        # Create frame for charts
        chart_frame = ttk.Frame(self.tab1)
        chart_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        # Create price trend chart
        trend_frame = ttk.LabelFrame(chart_frame, text="Price Trend")
        trend_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        self.fig1, self.ax1 = plt.subplots(figsize=(6, 4))
        self.canvas1 = FigureCanvasTkAgg(self.fig1, master=trend_frame)
        self.canvas1.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        
        # Create correlation chart
        corr_frame = ttk.LabelFrame(chart_frame, text="Commodity-Product Correlation")
        corr_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        self.fig2, self.ax2 = plt.subplots(figsize=(6, 4))
        self.canvas2 = FigureCanvasTkAgg(self.fig2, master=corr_frame)
        self.canvas2.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        
        # Load initial data
        self.load_dummy_data()
    
    def setup_tab2(self):
        """Setup Product Sales & Inventory Analysis tab"""
        # Create a frame for controls
        control_frame = ttk.LabelFrame(self.tab2, text="Product Controls")
        control_frame.pack(fill=tk.X, padx=10, pady=5)
        
        # Product search
        ttk.Label(control_frame, text="Search Product:").grid(row=0, column=0, padx=5, pady=5)
        self.product_search = ttk.Entry(control_frame, width=30)
        self.product_search.grid(row=0, column=1, padx=5, pady=5)
        
        search_btn = ttk.Button(control_frame, text="Search", command=self.search_product)
        search_btn.grid(row=0, column=2, padx=5, pady=5)
        
        # Create frame for product sales table
        sales_frame = ttk.LabelFrame(self.tab2, text="Product Sales Data")
        sales_frame.pack(fill=tk.X, padx=10, pady=5)
        
        # Create Treeview for sales
        columns = ("Product", "Sales Volume", "Revenue", "Commodity Impact", "Inventory Level")
        self.sales_tree = ttk.Treeview(sales_frame, columns=columns, show="headings", height=5)
        
        # Configure columns
        for col in columns:
            self.sales_tree.heading(col, text=col)
            self.sales_tree.column(col, width=100, anchor=tk.CENTER)
        
        self.sales_tree.pack(fill=tk.X, padx=5, pady=5)
        
        # Create frame for charts
        chart_frame = ttk.Frame(self.tab2)
        chart_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        # Create sales vs commodity chart
        sales_chart_frame = ttk.LabelFrame(chart_frame, text="Sales vs Commodity Price")
        sales_chart_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        self.fig3, self.ax3 = plt.subplots(figsize=(6, 4))
        self.canvas3 = FigureCanvasTkAgg(self.fig3, master=sales_chart_frame)
        self.canvas3.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        
        # Create optimal restock chart
        restock_frame = ttk.LabelFrame(chart_frame, text="Optimal Restocking Time")
        restock_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        self.fig4, self.ax4 = plt.subplots(figsize=(6, 4))
        self.canvas4 = FigureCanvasTkAgg(self.fig4, master=restock_frame)
        self.canvas4.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        
        # Load initial data
        self.load_dummy_sales_data()
    
    def setup_tab3(self):
        """Setup Price Prediction & Forecasting tab"""
        # Create a frame for controls
        control_frame = ttk.LabelFrame(self.tab3, text="Prediction Controls")
        control_frame.pack(fill=tk.X, padx=10, pady=5)
        
        # Commodity selection for prediction
        ttk.Label(control_frame, text="Select Commodity:").grid(row=0, column=0, padx=5, pady=5)
        self.pred_commodity_var = tk.StringVar()
        commodities = ["Crude Oil", "Natural Gas", "Gold", "Silver", "Copper", "Wheat", "Corn", "Coffee"]
        pred_commodity_dropdown = ttk.Combobox(control_frame, textvariable=self.pred_commodity_var, values=commodities)
        pred_commodity_dropdown.grid(row=0, column=1, padx=5, pady=5)
        pred_commodity_dropdown.current(0)
        
        # Prediction period
        ttk.Label(control_frame, text="Prediction Period:").grid(row=0, column=2, padx=5, pady=5)
        self.period_var = tk.StringVar()
        periods = ["1 Month", "3 Months", "6 Months", "1 Year"]
        period_dropdown = ttk.Combobox(control_frame, textvariable=self.period_var, values=periods)
        period_dropdown.grid(row=0, column=3, padx=5, pady=5)
        period_dropdown.current(0)
        
        # Predict button
        predict_btn = ttk.Button(control_frame, text="Generate Prediction", command=self.generate_prediction)
        predict_btn.grid(row=0, column=4, padx=5, pady=5)
        
        # Export button
        export_btn = ttk.Button(control_frame, text="Export Data", command=self.export_prediction)
        export_btn.grid(row=0, column=5, padx=5, pady=5)
        
        # Progress bar
        self.progress = ttk.Progressbar(control_frame, orient=tk.HORIZONTAL, length=200, mode='determinate')
        self.progress.grid(row=1, columnspan=6, padx=5, pady=5, sticky=tk.EW)
        
        # Create frame for prediction chart
        pred_frame = ttk.LabelFrame(self.tab3, text="Price Prediction")
        pred_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        self.fig5, self.ax5 = plt.subplots(figsize=(10, 6))
        self.canvas5 = FigureCanvasTkAgg(self.fig5, master=pred_frame)
        self.canvas5.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        
        # Create frame for prediction stats
        stats_frame = ttk.LabelFrame(self.tab3, text="Prediction Statistics")
        stats_frame.pack(fill=tk.X, padx=10, pady=5)
        
        # Stats labels
        self.current_price_label = ttk.Label(stats_frame, text="Current Price: $0.00")
        self.current_price_label.grid(row=0, column=0, padx=20, pady=5, sticky=tk.W)
        
        self.predicted_price_label = ttk.Label(stats_frame, text="Predicted Price: $0.00")
        self.predicted_price_label.grid(row=0, column=1, padx=20, pady=5, sticky=tk.W)
        
        self.change_label = ttk.Label(stats_frame, text="Predicted Change: 0.00%")
        self.change_label.grid(row=0, column=2, padx=20, pady=5, sticky=tk.W)
        
        self.confidence_label = ttk.Label(stats_frame, text="Confidence Level: 0.00%")
        self.confidence_label.grid(row=0, column=3, padx=20, pady=5, sticky=tk.W)
    
    def refresh_commodity_data(self):
        """Refresh commodity data - would connect to API in real implementation"""
        # In a real app, this would fetch data from an API
        # For now, we'll just update our dummy data
        self.load_dummy_data()
    
    def search_product(self):
        """Search for a product in the sales data"""
        # In a real app, this would search the database
        # For now, we'll just print the search term
        search_term = self.product_search.get()
        print(f"Searching for: {search_term}")
        
        # Update the sales tree with filtered data
        # This is just a placeholder
        self.load_dummy_sales_data()
    
    def generate_prediction(self):
        """Generate price prediction for selected commodity"""
        commodity = self.pred_commodity_var.get()
        period = self.period_var.get()
        
        # Simulate progress
        for i in range(101):
            self.progress['value'] = i
            self.root.update_idletasks()
            self.root.after(20)  # Small delay to show progress
        
        # Generate dummy prediction data
        self.load_dummy_prediction_data(commodity, period)
        
        # Reset progress bar
        self.progress['value'] = 0
    
    def export_prediction(self):
        """Export prediction data to CSV"""
        # In a real app, this would save data to a file
        print("Exporting prediction data to CSV...")
    
    def load_dummy_data(self):
        """Load dummy data for demonstration"""
        # Clear existing data
        for item in self.price_tree.get_children():
            self.price_tree.delete(item)
        
        # Add dummy data
        commodities = [
            ("Crude Oil", "$75.23", "+0.45", "+0.60%", "Just now"),
            ("Natural Gas", "$2.87", "-0.12", "-4.01%", "1 min ago"),
            ("Gold", "$1,923.45", "+12.30", "+0.64%", "Just now"),
            ("Silver", "$23.67", "+0.23", "+0.98%", "2 min ago"),
            ("Copper", "$3.78", "-0.05", "-1.31%", "Just now")
        ]
        
        for commodity in commodities:
            self.price_tree.insert("", tk.END, values=commodity)
        
        # Generate dummy time series data for charts
        dates = pd.date_range(end=datetime.now(), periods=30).tolist()
        prices = np.cumsum(np.random.normal(0, 1, 30)) + 75  # Random walk starting at 75
        
        # Plot price trend
        self.ax1.clear()
        self.ax1.plot(dates, prices, 'b-')
        self.ax1.set_title(f"{self.commodity_var.get()} Price Trend (30 Days)")
        self.ax1.set_ylabel("Price ($)")
        self.ax1.tick_params(axis='x', rotation=45)
        self.fig1.tight_layout()
        self.canvas1.draw()
        
        # Plot correlation
        products = ["Plastic", "Packaging", "Fuel", "Chemicals", "Transport"]
        correlations = np.random.uniform(0.3, 0.9, len(products))
        
        self.ax2.clear()
        bars = self.ax2.barh(products, correlations, color='skyblue')
        self.ax2.set_title(f"{self.commodity_var.get()} Impact on Products")
        self.ax2.set_xlabel("Correlation Coefficient")
        self.ax2.set_xlim(0, 1)
        
        # Add correlation values to the end of each bar
        for bar in bars:
            width = bar.get_width()
            self.ax2.text(width + 0.01, bar.get_y() + bar.get_height()/2, 
                    f'{width:.2f}', va='center')
        
        self.fig2.tight_layout()
        self.canvas2.draw()
    
    def load_dummy_sales_data(self):
        """Load dummy sales data for demonstration"""
        # Clear existing data
        for item in self.sales_tree.get_children():
            self.sales_tree.delete(item)
        
        # Add dummy data
        products = [
            ("Plastic Containers", "12,450", "$45,230", "High", "Low"),
            ("Packaging Materials", "8,320", "$28,750", "Medium", "Medium"),
            ("Fuel Products", "15,780", "$89,450", "Very High", "High"),
            ("Chemical Solutions", "5,230", "$32,780", "Medium", "Low"),
            ("Transport Services", "3,450", "$67,890", "High", "N/A")
        ]
        
        for product in products:
            self.sales_tree.insert("", tk.END, values=product)
        
        # Generate dummy time series data for charts
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        sales = np.random.randint(5000, 15000, len(months))
        commodity_prices = np.random.uniform(60, 80, len(months))
        
        # Plot sales vs commodity price
        self.ax3.clear()
        color = 'tab:blue'
        self.ax3.set_xlabel('Month')
        self.ax3.set_ylabel('Sales Volume', color=color)
        self.ax3.bar(months, sales, color=color, alpha=0.7)
        self.ax3.tick_params(axis='y', labelcolor=color)
        
        ax3_twin = self.ax3.twinx()
        color = 'tab:red'
        ax3_twin.set_ylabel('Commodity Price ($)', color=color)
        ax3_twin.plot(months, commodity_prices, color=color, marker='o')
        ax3_twin.tick_params(axis='y', labelcolor=color)
        
        self.ax3.set_title('Sales Volume vs Commodity Price')
        self.fig3.tight_layout()
        self.canvas3.draw()
        
        # Plot optimal restocking
        self.ax4.clear()
        days = list(range(1, 31))
        inventory = 100 - np.cumsum(np.random.uniform(2, 5, len(days)))
        inventory[inventory < 0] = 0
        
        price_forecast = 75 + np.cumsum(np.random.normal(0, 0.5, len(days)))
        
        self.ax4.plot(days, inventory, 'b-', label='Inventory Level')
        self.ax4.set_xlabel('Day of Month')
        self.ax4.set_ylabel('Inventory Level')
        self.ax4.axhline(y=20, color='r', linestyle='--', label='Reorder Point')
        
        # Find optimal restock day (when inventory crosses reorder point)
        restock_day = next((i for i, v in enumerate(inventory) if v <= 20), -1)
        if restock_day != -1:
            self.ax4.axvline(x=days[restock_day], color='g', linestyle='--', 
                           label=f'Optimal Restock (Day {days[restock_day]})')
        
        self.ax4.legend()
        self.ax4.set_title('Inventory Level and Optimal Restocking')
        self.fig4.tight_layout()
        self.canvas4.draw()
    
    def load_dummy_prediction_data(self, commodity, period):
        """Load dummy prediction data for demonstration"""
        # Parse period
        if period == "1 Month":
            days = 30
        elif period == "3 Months":
            days = 90
        elif period == "6 Months":
            days = 180
        else:  # 1 Year
            days = 365
        
        # Generate dates
        historical_dates = pd.date_range(end=datetime.now(), periods=180).tolist()
        future_dates = pd.date_range(start=datetime.now(), periods=days).tolist()
        
        # Generate historical prices (random walk)
        np.random.seed(42)  # For reproducibility
        historical_prices = np.cumsum(np.random.normal(0, 1, 180)) + 75
        
        # Generate "predicted" prices
        # Add some trend and seasonality for realism
        trend = np.linspace(0, 5, days)  # Upward trend
        seasonality = 2 * np.sin(np.linspace(0, 4*np.pi, days))  # Seasonal component
        noise = np.random.normal(0, 1, days)  # Random noise
        
        predicted_prices = historical_prices[-1] + trend + seasonality + np.cumsum(noise*0.3)
        
        # Calculate confidence intervals (just for demonstration)
        confidence_low = predicted_prices - np.linspace(0, 5, days)
        confidence_high = predicted_prices + np.linspace(0, 5, days)
        
        # Plot the data
        self.ax5.clear()
        self.ax5.plot(historical_dates, historical_prices, 'b-', label='Historical Data')
        self.ax5.plot(future_dates, predicted_prices, 'r-', label='Predicted Price')
        self.ax5.fill_between(future_dates, confidence_low, confidence_high, color='r', alpha=0.2, label='Confidence Interval')
        
        # Add vertical line at current date
        self.ax5.axvline(x=datetime.now(), color='k', linestyle='--', label='Today')
        
        self.ax5.set_title(f'{commodity} Price Prediction ({period})')
        self.ax5.set_xlabel('Date')
        self.ax5.set_ylabel('Price ($)')
        self.ax5.legend()
        self.ax5.tick_params(axis='x', rotation=45)
        self.fig5.tight_layout()
        self.canvas5.draw()
        
        # Update stats
        current_price = historical_prices[-1]
        final_predicted_price = predicted_prices[-1]
        percent_change = ((final_predicted_price - current_price) / current_price) * 100
        
        self.current_price_label.config(text=f"Current Price: ${current_price:.2f}")
        self.predicted_price_label.config(text=f"Predicted Price: ${final_predicted_price:.2f}")
        self.change_label.config(text=f"Predicted Change: {percent_change:.2f}%")
        
        # Random confidence level between 80% and 95%
        confidence = np.random.uniform(80, 95)
        self.confidence_label.config(text=f"Confidence Level: {confidence:.2f}%")

# Run the application
if __name__ == "__main__":
    root = tk.Tk()
    app = CommodityAnalysisApp(root)
    root.mainloop()

