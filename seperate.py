import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.tsa.statespace.sarimax import SARIMAX
from pmdarima import auto_arima
from statsmodels.tsa.stattools import adfuller

# Load CSV, parse dates, and clean column names by stripping extra spaces.
data = pd.read_csv('inflate.csv', parse_dates=[" Year"], index_col=" Year")
data.columns = data.columns.str.strip()
data = data.sort_index()

# Select the inflation series using the cleaned column name.
inflation = data['Inflation Rate (%)']

# Optional: Check stationarity using the ADF test.
adf_result = adfuller(inflation.dropna())
print("ADF Statistic: {:.4f}".format(adf_result[0]))
print("p-value: {:.4f}".format(adf_result[1]))
print('Data columns:', data.columns)

# Use auto_arima to determine the best ARIMA order for non-seasonal yearly data.
stepwise_model = auto_arima(inflation, seasonal=False, trace=True, error_action='ignore', suppress_warnings=True)
print(stepwise_model.summary())

# Fit the SARIMAX model with the identified order.
model = SARIMAX(inflation, order=stepwise_model.order)
model_fit = model.fit(disp=False)
print(model_fit.summary())

# Forecast inflation for the next 5 years.
forecast_steps = 5
forecast = model_fit.get_forecast(steps=forecast_steps)
forecast_mean = forecast.predicted_mean
forecast_ci = forecast.conf_int()

print("Forecasted Inflation Rates for the next 5 years:")
print(forecast_mean)

# Save the forecasted data to a new CSV file.
forecast_df = pd.DataFrame({'Forecasted Inflation Rate (%)': forecast_mean})
forecast_df.index.name = 'Year'
forecast_df.to_csv('inflation_forecast_next_5_years.csv')
print("Forecasted data saved to 'inflation_forecast_next_5_years.csv'.")

# Plot the historical data along with the forecast and confidence intervals.
plt.figure(figsize=(10, 5))
plt.plot(inflation, label='Historical Inflation')
plt.plot(forecast_mean, label='Forecasted Inflation', color='red')
plt.fill_between(forecast_ci.index, forecast_ci.iloc[:, 0], forecast_ci.iloc[:, 1],
                 color='pink', alpha=0.3, label='Confidence Interval')
plt.xlabel('Year')
plt.ylabel('Inflation Rate (%)')
plt.title('Inflation Forecast for Next 5 Years')
plt.legend()
plt.show()
