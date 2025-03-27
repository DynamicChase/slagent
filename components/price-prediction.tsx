"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Download } from "lucide-react"
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
  Area,
} from "@/components/ui/chart"

// Types
interface PredictionData {
  date: string
  actual: number | null
  predicted: number | null
  lower: number | null
  upper: number | null
}

const PricePrediction = () => {
  const [selectedCommodity, setSelectedCommodity] = useState("Crude Oil")
  const [selectedPeriod, setSelectedPeriod] = useState("1 Month")
  const [predictionData, setPredictionData] = useState<PredictionData[]>([])
  const [currentPrice, setCurrentPrice] = useState(0)
  const [predictedPrice, setPredictedPrice] = useState(0)
  const [percentChange, setPercentChange] = useState(0)
  const [confidenceLevel, setConfidenceLevel] = useState(0)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  const generatePrediction = async () => {
    setLoading(true)
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

    // In a real app, this would be an API call to a prediction model
    // For now, we'll simulate with dummy data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Parse period
    let days = 30
    if (selectedPeriod === "3 Months") days = 90
    else if (selectedPeriod === "6 Months") days = 180
    else if (selectedPeriod === "1 Year") days = 365

    // Generate dates
    const today = new Date()
    const dates: string[] = []

    // Historical dates (180 days in the past)
    for (let i = 180; i > 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split("T")[0])
    }

    // Future dates
    for (let i = 1; i <= days; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      dates.push(date.toISOString().split("T")[0])
    }

    // Generate price data based on commodity
    const basePrice =
      selectedCommodity === "Crude Oil"
        ? 75
        : selectedCommodity === "Natural Gas"
          ? 3
          : selectedCommodity === "Gold"
            ? 1900
            : selectedCommodity === "Silver"
              ? 24
              : 4 // Copper

    // Generate historical prices (random walk)
    let price = basePrice
    const historicalPrices: number[] = []

    for (let i = 0; i < 180; i++) {
      historicalPrices.push(price)
      price += (Math.random() - 0.5) * (price * 0.01) // Random walk with 1% volatility
    }

    // Current price is the last historical price
    const current = historicalPrices[historicalPrices.length - 1]
    setCurrentPrice(Number(current.toFixed(2)))

    // Generate predicted prices with trend and seasonality
    const predictedPrices: number[] = []
    const lowerBound: number[] = []
    const upperBound: number[] = []

    // Add trend and seasonality
    for (let i = 0; i < days; i++) {
      // Trend component (slight upward trend)
      const trend = (i / days) * (price * 0.05)

      // Seasonality component (sine wave)
      const seasonality = Math.sin((i / 30) * Math.PI) * (price * 0.03)

      // Random component (decreasing certainty over time)
      const uncertainty = (i / days) * (price * 0.1)
      const random = (Math.random() - 0.5) * uncertainty

      const predictedPrice = current + trend + seasonality + random
      predictedPrices.push(predictedPrice)

      // Confidence intervals (widen over time)
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

    // Random confidence level between 80% and 95%
    const confidence = Math.random() * 15 + 80
    setConfidenceLevel(Number(confidence.toFixed(2)))

    // Combine all data
    const combinedData: PredictionData[] = []

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

    setLoading(false)
  }

  const exportData = () => {
    if (predictionData.length === 0) return

    // Create CSV content
    const headers = "Date,Actual,Predicted,Lower Bound,Upper Bound\n"
    const rows = predictionData
      .map((row) => `${row.date},${row.actual || ""},${row.predicted || ""},${row.lower || ""},${row.upper || ""}`)
      .join("\n")

    const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${selectedCommodity}_Prediction_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)

    // Trigger download
    link.click()

    // Clean up
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Price Prediction Controls</CardTitle>
          <CardDescription>Generate price forecasts for commodities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="commodity">Select Commodity</label>
              <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                <SelectTrigger id="commodity">
                  <SelectValue placeholder="Select Commodity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Crude Oil">Crude Oil</SelectItem>
                  <SelectItem value="Natural Gas">Natural Gas</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Copper">Copper</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="period">Prediction Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Month">1 Month</SelectItem>
                  <SelectItem value="3 Months">3 Months</SelectItem>
                  <SelectItem value="6 Months">6 Months</SelectItem>
                  <SelectItem value="1 Year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={generatePrediction} disabled={loading}>
                Generate Prediction
              </Button>

              <Button variant="outline" onClick={exportData} disabled={loading || predictionData.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          <Progress value={progress} className="h-2 w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCommodity} Price Prediction ({selectedPeriod})
          </CardTitle>
          <CardDescription>Historical data and price forecast</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                formatter={(value) => [`$${value}`, ""]}
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
              <Area type="monotone" dataKey="lower" stroke="none" fill="#82ca9d" fillOpacity={0.2} name="Lower Bound" />
              <Area type="monotone" dataKey="upper" stroke="none" fill="#82ca9d" fillOpacity={0.2} name="Upper Bound" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Predicted Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${predictedPrice.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Predicted Change</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${percentChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {percentChange >= 0 ? "+" : ""}
              {percentChange}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confidenceLevel}%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PricePrediction

