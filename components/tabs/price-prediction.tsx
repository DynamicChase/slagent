"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Calendar, TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "@/components/ui/chart"

export default function PricePrediction() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1m")
  const [predictionMethod, setPredictionMethod] = useState<string>("arima")
  const [predictionData, setPredictionData] = useState<any[]>([])
  const [currentPrice, setCurrentPrice] = useState(0)
  const [predictedPrice, setPredictedPrice] = useState(0)
  const [percentChange, setPercentChange] = useState(0)
  const [confidenceLevel, setConfidenceLevel] = useState(0)

  // Mock categories and subcategories
  const categories = ["Food & Beverages", "Household", "Personal Care", "Electronics"]
  const subCategories = {
    "Food & Beverages": ["Dairy", "Bakery", "Fruits & Vegetables", "Snacks", "Beverages"],
    Household: ["Cleaning", "Kitchen", "Bathroom", "Laundry"],
    "Personal Care": ["Skincare", "Haircare", "Oral Care", "Body Care"],
    Electronics: ["Phones", "Computers", "Accessories", "Audio"],
  }

  // Update subcategories when category changes
  const updateSubCategories = () => {
    if (selectedCategory) {
      return subCategories[selectedCategory as keyof typeof subCategories] || []
    }
    return []
  }

  // Mock products for the selected subcategory
  const getProducts = () => {
    if (selectedCategory && selectedSubCategory) {
      return [
        { id: "1", name: "Product 1", price: 25.99 },
        { id: "2", name: "Product 2", price: 34.5 },
        { id: "3", name: "Product 3", price: 19.99 },
        { id: "4", name: "Product 4", price: 45.75 },
        { id: "5", name: "Product 5", price: 29.99 },
      ]
    }
    return []
  }

  const generatePrediction = async () => {
    if (!selectedProduct) {
      return
    }

    setGenerating(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock prediction data
    const today = new Date()
    const dates = []

    // Historical dates (180 days in the past)
    for (let i = 180; i > 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split("T")[0])
    }

    // Future dates
    const days = selectedPeriod === "1m" ? 30 : selectedPeriod === "3m" ? 90 : selectedPeriod === "6m" ? 180 : 365

    for (let i = 1; i <= days; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      dates.push(date.toISOString().split("T")[0])
    }

    // Generate price data
    const basePrice = 29.99

    // Historical prices
    let price = basePrice * 0.8
    const historicalPrices = []

    for (let i = 0; i < 180; i++) {
      historicalPrices.push(price)
      const change = (Math.random() - 0.45) * (price * 0.01)
      price += change
    }

    // Current price
    const current = historicalPrices[historicalPrices.length - 1]
    setCurrentPrice(Number(current.toFixed(2)))

    // Predicted prices
    const predictedPrices = []
    const lowerBound = []
    const upperBound = []

    for (let i = 0; i < days; i++) {
      const trend = (i / days) * (price * 0.1)
      const seasonality = Math.sin((i / 30) * Math.PI) * (price * 0.05)
      const random = (Math.random() - 0.5) * (price * 0.02)

      const predictedPrice = current + trend + seasonality + random
      predictedPrices.push(predictedPrice)

      const interval = (i / days) * (price * 0.15)
      lowerBound.push(predictedPrice - interval)
      upperBound.push(predictedPrice + interval)
    }

    // Final predicted price
    const final = predictedPrices[predictedPrices.length - 1]
    setPredictedPrice(Number(final.toFixed(2)))

    // Percent change
    const change = ((final - current) / current) * 100
    setPercentChange(Number(change.toFixed(2)))

    // Random confidence level
    const confidence = Math.random() * 15 + 80
    setConfidenceLevel(Number(confidence.toFixed(2)))

    // Combine data
    const combinedData = []

    // Historical data
    for (let i = 0; i < 180; i++) {
      combinedData.push({
        date: dates[i],
        actual: Number(historicalPrices[i].toFixed(2)),
        predicted: null,
        lower: null,
        upper: null,
      })
    }

    // Prediction data
    for (let i = 0; i < days; i++) {
      combinedData.push({
        date: dates[i + 180],
        actual: null,
        predicted: Number(predictedPrices[i].toFixed(2)),
        lower: Number(lowerBound[i].toFixed(2)),
        upper: Number(upperBound[i].toFixed(2)),
      })
    }

    setPredictionData(combinedData)
    setProgress(100)

    // Clear interval if it's still running
    clearInterval(interval)

    setGenerating(false)
  }

  const exportData = () => {
    // In a real app, this would export data to CSV
    console.log("Exporting data...")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Price Prediction Controls</CardTitle>
          <CardDescription>Generate price forecasts for products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="subcategory" className="text-sm font-medium">
                Sub-Category
              </label>
              <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory} disabled={!selectedCategory}>
                <SelectTrigger id="subcategory">
                  <SelectValue placeholder="Select Sub-Category" />
                </SelectTrigger>
                <SelectContent>
                  {updateSubCategories().map((subCategory) => (
                    <SelectItem key={subCategory} value={subCategory}>
                      {subCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="product" className="text-sm font-medium">
                Product
              </label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct} disabled={!selectedSubCategory}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  {getProducts().map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (${product.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="period" className="text-sm font-medium">
                Prediction Period
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="method" className="text-sm font-medium">
                Prediction Method
              </label>
              <Select value={predictionMethod} onValueChange={setPredictionMethod}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arima">ARIMA Model</SelectItem>
                  <SelectItem value="linear">Linear Regression</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={generatePrediction} disabled={generating || !selectedProduct} className="flex-1">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Prediction
              </Button>

              <Button variant="outline" onClick={exportData} disabled={generating || predictionData.length === 0}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Progress value={progress} className="h-2 w-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            {predictionData.length === 0 ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Predicted Price</CardTitle>
          </CardHeader>
          <CardContent>
            {predictionData.length === 0 ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">${predictedPrice.toFixed(2)}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Predicted Change</CardTitle>
          </CardHeader>
          <CardContent>
            {predictionData.length === 0 ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className={`text-2xl font-bold ${percentChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {percentChange >= 0 ? "+" : ""}
                {percentChange}%
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
          </CardHeader>
          <CardContent>
            {predictionData.length === 0 ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{confidenceLevel}%</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price Prediction Chart</CardTitle>
          <CardDescription>
            {selectedProduct ? getProducts().find((p) => p.id === selectedProduct)?.name : "Select a product"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          {predictionData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                <div className="text-lg font-medium">No prediction data</div>
                <div className="text-sm text-muted-foreground">
                  Select a product and generate a prediction to see the forecast chart
                </div>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, ""]}
                  labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                />
                <Legend />
                <ReferenceLine
                  x={new Date().toISOString().split("T")[0]}
                  stroke="#666"
                  strokeDasharray="3 3"
                  label="Today"
                />
                <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Historical Data" dot={false} />
                <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Predicted Price" dot={false} />
                <Line
                  type="monotone"
                  dataKey="lower"
                  stroke="#82ca9d"
                  strokeDasharray="3 3"
                  name="Lower Bound"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="upper"
                  stroke="#82ca9d"
                  strokeDasharray="3 3"
                  name="Upper Bound"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

