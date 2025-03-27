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

  // Mock categories and subcategories for Indian market
  const categories = ["Food & Beverages", "Household", "Personal Care", "Electronics", "Textiles", "Spices", "Grains"]
  const subCategories = {
    "Food & Beverages": ["Dairy", "Bakery", "Fruits & Vegetables", "Snacks", "Beverages", "Sweets"],
    Household: ["Cleaning", "Kitchen", "Bathroom", "Laundry", "Furniture"],
    "Personal Care": ["Skincare", "Haircare", "Oral Care", "Body Care", "Ayurvedic"],
    Electronics: ["Phones", "Computers", "Accessories", "Audio", "Home Appliances"],
    Textiles: ["Cotton", "Silk", "Wool", "Synthetic", "Blended"],
    Spices: ["Whole Spices", "Ground Spices", "Blended Spices", "Exotic Spices"],
    Grains: ["Rice", "Wheat", "Pulses", "Millets", "Oats"],
  }

  // Update subcategories when category changes
  const updateSubCategories = () => {
    if (selectedCategory) {
      return subCategories[selectedCategory as keyof typeof subCategories] || []
    }
    return []
  }

  // Mock products for the selected subcategory with Indian products and prices
  const getProducts = () => {
    if (selectedCategory && selectedSubCategory) {
      if (selectedCategory === "Food & Beverages" && selectedSubCategory === "Dairy") {
        return [
          { id: "1", name: "Amul Milk (1L)", price: 68.0 },
          { id: "2", name: "Amul Butter (500g)", price: 245.0 },
          { id: "3", name: "Paneer (200g)", price: 90.0 },
          { id: "4", name: "Ghee (500ml)", price: 275.0 },
          { id: "5", name: "Curd (400g)", price: 45.0 },
        ]
      } else if (selectedCategory === "Spices" && selectedSubCategory === "Whole Spices") {
        return [
          { id: "1", name: "Cardamom (50g)", price: 150.0 },
          { id: "2", name: "Black Pepper (100g)", price: 120.0 },
          { id: "3", name: "Cloves (50g)", price: 85.0 },
          { id: "4", name: "Cinnamon (100g)", price: 110.0 },
          { id: "5", name: "Cumin Seeds (100g)", price: 65.0 },
        ]
      } else if (selectedCategory === "Grains" && selectedSubCategory === "Rice") {
        return [
          { id: "1", name: "Basmati Rice (1kg)", price: 120.0 },
          { id: "2", name: "Brown Rice (1kg)", price: 95.0 },
          { id: "3", name: "Sona Masoori (1kg)", price: 75.0 },
          { id: "4", name: "Jasmine Rice (1kg)", price: 110.0 },
          { id: "5", name: "Ponni Rice (1kg)", price: 85.0 },
        ]
      } else {
        return [
          { id: "1", name: "Product 1", price: 250.0 },
          { id: "2", name: "Product 2", price: 345.5 },
          { id: "3", name: "Product 3", price: 199.99 },
          { id: "4", name: "Product 4", price: 450.75 },
          { id: "5", name: "Product 5", price: 299.99 },
        ]
      }
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

    // Get selected product price
    const product = getProducts().find((p) => p.id === selectedProduct)
    const basePrice = product ? product.price : 299.99

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

    // Generate different predictions based on selected model
    const predictedPrices = []
    const lowerBound = []
    const upperBound = []

    if (predictionMethod === "arima") {
      // ARIMA model simulation (more volatile, with seasonality)
      for (let i = 0; i < days; i++) {
        const trend = (i / days) * (price * 0.12)
        const seasonality = Math.sin((i / 30) * Math.PI) * (price * 0.08)
        const random = (Math.random() - 0.5) * (price * 0.03)

        const predictedPrice = current + trend + seasonality + random
        predictedPrices.push(predictedPrice)

        const interval = (i / days) * (price * 0.18)
        lowerBound.push(predictedPrice - interval)
        upperBound.push(predictedPrice + interval)
      }
    } else if (predictionMethod === "linear") {
      // Linear Regression simulation (smoother trend)
      for (let i = 0; i < days; i++) {
        const trend = (i / days) * (price * 0.08)
        const random = (Math.random() - 0.5) * (price * 0.01)

        const predictedPrice = current + trend + random
        predictedPrices.push(predictedPrice)

        const interval = (i / days) * (price * 0.1)
        lowerBound.push(predictedPrice - interval)
        upperBound.push(predictedPrice + interval)
      }
    } else if (predictionMethod === "prophet") {
      // Prophet model simulation (handles seasonality well)
      for (let i = 0; i < days; i++) {
        const trend = (i / days) * (price * 0.1)
        const seasonality = Math.sin((i / 30) * Math.PI) * (price * 0.06) + Math.sin((i / 7) * Math.PI) * (price * 0.02)
        const random = (Math.random() - 0.5) * (price * 0.015)

        const predictedPrice = current + trend + seasonality + random
        predictedPrices.push(predictedPrice)

        const interval = (i / days) * (price * 0.12)
        lowerBound.push(predictedPrice - interval)
        upperBound.push(predictedPrice + interval)
      }
    } else if (predictionMethod === "lstm") {
      // LSTM model simulation (captures complex patterns)
      let momentum = 0
      for (let i = 0; i < days; i++) {
        const trend = (i / days) * (price * 0.11)
        const seasonality = Math.sin((i / 30) * Math.PI) * (price * 0.05)
        const random = (Math.random() - 0.5) * (price * 0.02)

        // LSTM models can capture momentum in price movements
        momentum = momentum * 0.9 + random * 0.1

        const predictedPrice = current + trend + seasonality + momentum
        predictedPrices.push(predictedPrice)

        const interval = (i / days) * (price * 0.14)
        lowerBound.push(predictedPrice - interval)
        upperBound.push(predictedPrice + interval)
      }
    }

    // Final predicted price
    const final = predictedPrices[predictedPrices.length - 1]
    setPredictedPrice(Number(final.toFixed(2)))

    // Percent change
    const change = ((final - current) / current) * 100
    setPercentChange(Number(change.toFixed(2)))

    // Confidence level based on model
    let confidence = 0
    if (predictionMethod === "arima") {
      confidence = Math.random() * 10 + 80 // 80-90%
    } else if (predictionMethod === "linear") {
      confidence = Math.random() * 10 + 75 // 75-85%
    } else if (predictionMethod === "prophet") {
      confidence = Math.random() * 10 + 82 // 82-92%
    } else if (predictionMethod === "lstm") {
      confidence = Math.random() * 10 + 85 // 85-95%
    }
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

  // Download data as CSV
  const exportData = () => {
    if (predictionData.length === 0) return

    // Create CSV content
    const headers = ["Date", "Actual Price", "Predicted Price", "Lower Bound", "Upper Bound"]
    const csvContent = [
      headers.join(","),
      ...predictionData.map((item) =>
        [
          item.date,
          item.actual !== null ? item.actual.toFixed(2) : "",
          item.predicted !== null ? item.predicted.toFixed(2) : "",
          item.lower !== null ? item.lower.toFixed(2) : "",
          item.upper !== null ? item.upper.toFixed(2) : "",
        ].join(","),
      ),
    ].join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "price_prediction_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4 bg-black text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">Price Prediction</h1>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Price Prediction Controls</CardTitle>
          <CardDescription className="text-gray-400">Generate price forecasts for products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-white">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category" className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="subcategory" className="text-sm font-medium text-white">
                Sub-Category
              </label>
              <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory} disabled={!selectedCategory}>
                <SelectTrigger id="subcategory" className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select Sub-Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {updateSubCategories().map((subCategory) => (
                    <SelectItem key={subCategory} value={subCategory}>
                      {subCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="product" className="text-sm font-medium text-white">
                Product
              </label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct} disabled={!selectedSubCategory}>
                <SelectTrigger id="product" className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {getProducts().map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (₹{product.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="period" className="text-sm font-medium text-white">
                Prediction Period
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger id="period" className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="method" className="text-sm font-medium text-white">
                Prediction Method
              </label>
              <Select value={predictionMethod} onValueChange={setPredictionMethod}>
                <SelectTrigger id="method" className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select Method" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="arima">ARIMA Model</SelectItem>
                  <SelectItem value="linear">Linear Regression</SelectItem>
                  <SelectItem value="prophet">Prophet Model</SelectItem>
                  <SelectItem value="lstm">LSTM Neural Network</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button
                onClick={generatePrediction}
                disabled={generating || !selectedProduct}
                className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Prediction
              </Button>

              <Button
                variant="outline"
                onClick={exportData}
                disabled={generating || predictionData.length === 0}
                className="text-yellow-400 bg-black border-yellow-400 hover:bg-yellow-400/10"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Progress value={progress} className="h-2 w-full bg-gray-800 [&>div]:bg-yellow-400" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            {predictionData.length === 0 ? (
              <Skeleton className="h-8 w-24 bg-gray-800" />
            ) : (
              <div className="text-2xl font-bold text-yellow-400">₹{currentPrice.toFixed(2)}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Predicted Price</CardTitle>
          </CardHeader>
          <CardContent>
            {predictionData.length === 0 ? (
              <Skeleton className="h-8 w-24 bg-gray-800" />
            ) : (
              <div className="text-2xl font-bold text-yellow-400">₹{predictedPrice.toFixed(2)}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Predicted Change</CardTitle>
          </CardHeader>
          <CardContent>
            {predictionData.length === 0 ? (
              <Skeleton className="h-8 w-24 bg-gray-800" />
            ) : (
              <div className={`text-2xl font-bold ${percentChange >= 0 ? "text-yellow-400" : "text-red-400"}`}>
                {percentChange >= 0 ? "+" : ""}
                {percentChange}%
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Confidence Level</CardTitle>
          </CardHeader>
          <CardContent>
            {predictionData.length === 0 ? (
              <Skeleton className="h-8 w-24 bg-gray-800" />
            ) : (
              <div className="text-2xl font-bold text-yellow-400">{confidenceLevel}%</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Price Prediction Chart</CardTitle>
          <CardDescription className="text-gray-400">
            {selectedProduct ? getProducts().find((p) => p.id === selectedProduct)?.name : "Select a product"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          {predictionData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                <div className="text-lg font-medium text-white">No prediction data</div>
                <div className="text-sm text-gray-400">
                  Select a product and generate a prediction to see the forecast chart
                </div>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#ccc" }}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                />
                <YAxis tick={{ fill: "#ccc" }} />
                <Tooltip
                  formatter={(value) => [`₹${Number(value).toFixed(2)}`, ""]}
                  labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                  contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                />
                <Legend />
                <ReferenceLine
                  x={new Date().toISOString().split("T")[0]}
                  stroke="#666"
                  strokeDasharray="3 3"
                  label={{ value: "Today", fill: "#ccc" }}
                />
                <Line type="monotone" dataKey="actual" stroke="#ffffff" name="Historical Data" dot={false} />
                <Line type="monotone" dataKey="predicted" stroke="#FFD700" name="Predicted Price" dot={false} />
                <Line
                  type="monotone"
                  dataKey="lower"
                  stroke="#FFD700"
                  strokeDasharray="3 3"
                  name="Lower Bound"
                  dot={false}
                  strokeOpacity={0.5}
                />
                <Line
                  type="monotone"
                  dataKey="upper"
                  stroke="#FFD700"
                  strokeDasharray="3 3"
                  name="Upper Bound"
                  dot={false}
                  strokeOpacity={0.5}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

