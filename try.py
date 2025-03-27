import pandas as pd

# ------------------------------
# 1. Load the Product Dataset
# ------------------------------
df = pd.read_csv('BigBasket Products.csv')

# Get unique categories from the dataset as a Series
unique_categories = pd.Series(df['category'].unique()).reset_index(drop=True)

# Display available categories with index numbers using .items()
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

# Filter further by the selected sub-category
final_filtered_df = filtered_df[filtered_df['sub_category'] == selected_sub_category]

# ------------------------------
# 3. Calculate Expected Prices Using Inflation Forecast
# ------------------------------
# Load the inflation forecast CSV (assumes it has 'Year' as index and a column 'Forecasted Inflation Rate (%)')
inflation_df = pd.read_csv('inflation_forecast_next_5_years.csv', index_col='Year')

# Option: Use the forecast rate from the last forecasted year
annual_inflation_rate = inflation_df['Forecasted Inflation Rate (%)'].iloc[-1]
print(f"\nUsing an annual inflation rate of: {annual_inflation_rate}%")

# Define forecast period in years (e.g., 5 years)
years = 1

# Calculate the expected price using the compound interest formula:
# Expected Price = Current Price * (1 + inflation_rate/100)^years
final_filtered_df['Expected Price'] = final_filtered_df['sale_price'] * ((1 + annual_inflation_rate / 100) ** years)

# ------------------------------
# 4. Display and Save the Comparison
# ------------------------------
# Create a DataFrame with the product name, original sale price, and the expected price
comparison_df = final_filtered_df[['product', 'sale_price', 'Expected Price']]

print("\nComparison of Original and Expected Prices (after 5 years):")
print(comparison_df)

# Save the comparison to a new CSV file
comparison_df.to_csv('price_comparison.csv', index=False)
print("\nComparison of prices saved to 'price_comparison.csv'.")
