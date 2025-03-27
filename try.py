import pandas as pd
import matplotlib.pyplot as plt

# ------------------------------
# 1. Load the Product Dataset
# ------------------------------
df = pd.read_csv('BigBasket Products.csv')

# Get unique categories from the dataset as a Series
unique_categories = pd.Series(df['category'].unique()).reset_index(drop=True)

# Display available categories with index numbers
print("Available Categories:")
for idx, category in unique_categories.items():
    print(f"{idx}: {category}")

# Prompt the user to select a category by its number
try:
    category_choice = int(input("Enter the number corresponding to the category you want to analyze: "))
    if category_choice < 0 or category_choice >= len(unique_categories):
        raise ValueError("Invalid category number.")
except ValueError as e:
    print("Error:", e)
    exit()

selected_category = unique_categories[category_choice]
print(f"\nYou have selected: {selected_category}")

# Filter the dataset to include only rows of the selected category
filtered_df = df[df['category'] == selected_category]

# ------------------------------
# 2. Choose the Sub-Category
# ------------------------------
# Get unique sub-categories for the selected category
unique_sub_categories = pd.Series(filtered_df['sub_category'].unique()).reset_index(drop=True)

# Display available sub-categories with index numbers
print("\nAvailable Sub-Categories in the selected category:")
for idx, sub_cat in unique_sub_categories.items():
    print(f"{idx}: {sub_cat}")

# Prompt the user to select a sub-category by its number
try:
    sub_category_choice = int(input("Enter the number corresponding to the sub-category you want to analyze: "))
    if sub_category_choice < 0 or sub_category_choice >= len(unique_sub_categories):
        raise ValueError("Invalid sub-category number.")
except ValueError as e:
    print("Error:", e)
    exit()

selected_sub_category = unique_sub_categories[sub_category_choice]
print(f"\nYou have selected sub-category: {selected_sub_category}")

# Filter further by the selected sub-category and make a copy
final_filtered_df = filtered_df[filtered_df['sub_category'] == selected_sub_category].copy()

# ------------------------------
# 3. Calculate Expected Prices Using Monthly Inflation Forecast
# ------------------------------
# Load the monthly inflation forecast CSV.
# The CSV should have columns: 'Date' and 'Forecasted Inflation Rate (%)'
inflation_df = pd.read_csv('monthly_inflation_forecast.csv', parse_dates=['Date'], index_col='Date')
inflation_df = inflation_df.sort_index()
print("\nMonthly Inflation Forecast Data:")
print(inflation_df.head())

# Compute cumulative inflation factors for each forecast month over the next 5 years (60 months)
cumulative_factors = {}
cumulative_factor = 1.0
for forecast_date, row in inflation_df.iterrows():
    rate = row['Forecasted Inflation Rate (%)']
    cumulative_factor *= (1 + rate / 100)
    cumulative_factors[forecast_date.date()] = cumulative_factor

# For each forecast month, calculate expected price:
for forecast_date, factor in cumulative_factors.items():
    col_name = f"Expected Price in {forecast_date.strftime('%Y-%m')}"
    final_filtered_df[col_name] = final_filtered_df['sale_price'] * factor

# ------------------------------
# 4. Create and Display Unique Product List
# ------------------------------
# Create a unique list of products (using product name and sale price)
unique_products = final_filtered_df[['product', 'sale_price']].drop_duplicates().reset_index(drop=True)

if unique_products.empty:
    print("No products found in the selected category and sub-category.")
    exit()

print("\nAvailable Products (Unique List):")
for i, row in unique_products.iterrows():
    print(f"{i}: {row['product']} (Sale Price: {row['sale_price']})")

# Prompt user to select a product from the unique list
try:
    product_choice = int(input("Enter the number corresponding to the product you want to analyze and plot: "))
    if product_choice < 0 or product_choice >= len(unique_products):
        raise ValueError("Invalid product number.")
except ValueError as e:
    print("Error:", e)
    exit()

selected_product_name = unique_products.loc[product_choice, 'product']
print(f"\nSelected Product: {selected_product_name}")

# For plotting, pick one representative row from final_filtered_df for the selected product.
product_forecast = final_filtered_df[final_filtered_df['product'] == selected_product_name].iloc[0]

# ------------------------------
# 5. Save Comparison Table
# ------------------------------
# List the expected price columns (ordered by forecast date)
expected_price_cols = [f"Expected Price in {date.strftime('%Y-%m')}" for date in sorted(cumulative_factors.keys())]
columns_to_show = ['product', 'sale_price'] + expected_price_cols
comparison_df = final_filtered_df[columns_to_show]
comparison_df.to_csv('price_comparison_monthly.csv', index=False)
print("\nComparison of prices saved to 'price_comparison_monthly.csv'.")

# ------------------------------
# 6. Plot the Forecast for the Selected Product
# ------------------------------
# Extract forecasted expected prices for the selected product
forecast_dates = sorted(cumulative_factors.keys())
forecast_prices = [product_forecast[f"Expected Price in {date.strftime('%Y-%m')}"] for date in forecast_dates]

# Convert forecast_dates to pandas datetime objects for plotting
forecast_dates_dt = pd.to_datetime([date.strftime('%Y-%m-01') for date in forecast_dates])

plt.figure(figsize=(12, 6))
plt.plot(forecast_dates_dt, forecast_prices, marker='o', color='red', label='Forecasted Price')
plt.axhline(y=product_forecast['sale_price'], color='blue', linestyle='--', label='Original Sale Price')
plt.xlabel('Date')
plt.ylabel('Price')
plt.title(f"Monthly Price Forecast for '{selected_product_name}' for Next 5 Years")
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
