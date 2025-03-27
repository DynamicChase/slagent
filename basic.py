import pandas as pd

df = pd.read_csv('BigBasket Products.csv')
print(df['category'].unique())

basic_categories = ['rice', 'wheat', 'pulses', 'oil', 'sugar', 'salt']  # Adjust as needed

basic_commodities = df[df['category'].isin(basic_categories)]
print(basic_commodities)
