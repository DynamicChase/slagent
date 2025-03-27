import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.tsa.statespace.sarimax import SARIMAX
from pmdarima import auto_arima
from statsmodels.tsa.stattools import adfuller

# ------------------------------
# 1. Load the Monthly Inflation Dataset
# ------------------------------
# Load the CSV file which has columns 'Date' and 'Inflation Rate (%)'
data = pd.read_csv('new_train.csv', parse_dates=['Date'], index_col='Date')
data = data.sort_index()
print("Data loaded. Columns:", data.columns)

# ------------------------------
# 2. Check Stationarity
# ------------------------------
inflation = data['Inflation Rate (%)']
adf_result = adfuller(inflation.dropna())
print("ADF Statistic: {:.4f}".format(adf_result[0]))
print("p-value: {:.4f}".format(adf_result[1]))

# ------------------------------
# 3. Model Selection and Forecasting
# ------------------------------
# Use auto_arima to find the best model.
# Here, we set seasonal=True with a period of 12 (monthly data).
stepwise_model = auto_arima(inflation, seasonal=True, m=12, trace=True, error_action='ignore', suppress_warnings=True)
print(stepwise_model.summary())

# Fit the SARIMAX model with the determined order and seasonal_order
model = SARIMAX(inflation, order=stepwise_model.order, seasonal_order=stepwise_model.seasonal_order)
model_fit = model.fit(disp=False)
print(model_fit.summary())

# Forecast monthly inflation for the next 5 years (60 months)
forecast_steps = 60
forecast = model_fit.get_forecast(steps=forecast_steps)
forecast_mean = forecast.predicted_mean
forecast_ci = forecast.conf_int()

# Create forecast index: starting from the month after the last date in data.
forecast_index = pd.date_range(start=data.index[-1] + pd.DateOffset(months=1), periods=forecast_steps, freq='MS')

forecast_mean.index = forecast_index
forecast_ci.index = forecast_index

# Save forecast to CSV
forecast_df = pd.DataFrame({'Forecasted Inflation Rate (%)': forecast_mean})
forecast_df.to_csv('monthly_inflation_forecast.csv')
print("Monthly inflation forecast saved to 'monthly_inflation_forecast.csv'.")

# ------------------------------
# 4. Plot the Results
# ------------------------------
plt.figure(figsize=(12, 6))
plt.plot(inflation, label='Historical Inflation')
plt.plot(forecast_mean, label='Forecasted Inflation', color='red')
plt.fill_between(forecast_ci.index, forecast_ci.iloc[:, 0], forecast_ci.iloc[:, 1],
                 color='pink', alpha=0.3, label='Confidence Interval')
plt.xlabel('Date')
plt.ylabel('Inflation Rate (%)')
plt.title('Monthly Inflation Forecast for Next 5 Years')
plt.legend()
plt.show()
