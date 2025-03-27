# utils.py
from datetime import datetime

def compute_cumulative_inflation(inflation_df):
    """
    Compute the cumulative inflation factor for each month.
    Returns a dictionary mapping date objects (first day of month) to cumulative factor.
    """
    cumulative_factor = 1.0
    cumulative_factors = {}
    for forecast_date, row in inflation_df.iterrows():
        rate = row['Forecasted Inflation Rate (%)']
        monthly_multiplier = 1 + (rate / 100) / 12
        cumulative_factor *= monthly_multiplier
        cumulative_factors[forecast_date.date()] = cumulative_factor
    return cumulative_factors

def filter_forecast_data(dates_dt, prices, start_year, start_month, month_map):
    """
    Filter forecast data based on the provided start year and month.
    Returns filtered dates and prices lists.
    """
    start_date = datetime(int(start_year), month_map[start_month], 1)
    filtered_dates = []
    filtered_prices = []
    for d, p in zip(dates_dt, prices):
        if d >= start_date:
            filtered_dates.append(d)
            filtered_prices.append(p)
    return filtered_dates, filtered_prices
