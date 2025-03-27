"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "@/components/ui/chart"
import { Calendar, Download } from "lucide-react"

export default function MarketTrends() {
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState<string>("India")
  const [selectedYear, setSelectedYear] = useState<string>("2025")
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1y")

  // Simulate loading data
  useState(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  })

  // Mock economic data for India and global markets
  const economicData = [
    {
      country: "Global",
      year: 2025,
      gdp: 95000,
      inflation: 3.5,
      unemployment: 5.5,
      growth: 3.2,
    },
    {
      country: "India",
      year: 2025,
      gdp: 3800,
      inflation: 5.0,
      unemployment: 7.0,
      growth: 6.5,
    },
    {
      country: "United States",
      year: 2025,
      gdp: 26000,
      inflation: 2.8,
      unemployment: 3.8,
      growth: 2.0,
    },
    {
      country: "China",
      year: 2025,
      gdp: 19000,
      inflation: 2.2,
      unemployment: 4.0,
      growth: 5.0,
    },
    {
      country: "European Union",
      year: 2025,
      gdp: 16500,
      inflation: 2.5,
      unemployment: 6.5,
      growth: 1.5,
    },
  ]

  // Mock commodity trends with Indian commodities
  const commodityTrends = [
    {
      commodity: "Crude Oil",
      price: 5823.75,
      change: 45.3,
      percentChange: 0.78,
      forecast: 6100.5,
      forecastChange: 276.75,
      correlation: 0.85,
    },
    {
      commodity: "Gold",
      price: 62450.75,
      change: 345.25,
      percentChange: 0.56,
      forecast: 65800.25,
      forecastChange: 3349.5,
      correlation: 0.72,
    },
    {
      commodity: "Wheat",
      price: 2340.25,
      change: 18.5,
      percentChange: 0.8,
      forecast: 2450.75,
      forecastChange: 110.5,
      correlation: 0.65,
    },
    {
      commodity: "Natural Gas",
      price: 215.4,
      change: -8.25,
      percentChange: -3.69,
      forecast: 225.75,
      forecastChange: 10.35,
      correlation: 0.78,
    },
    {
      commodity: "Copper",
      price: 780.45,
      change: -12.3,
      percentChange: -1.55,
      forecast: 825.3,
      forecastChange: 44.85,
      correlation: 0.81,
    },
    {
      commodity: "Silver",
      price: 75320.5,
      change: 630.75,
      percentChange: 0.84,
      forecast: 78500.25,
      forecastChange: 3179.75,
      correlation: 0.75,
    },
    {
      commodity: "Rice",
      price: 4250.75,
      change: 35.25,
      percentChange: 0.84,
      forecast: 4450.5,
      forecastChange: 199.75,
      correlation: 0.68,
    },
    {
      commodity: "Cotton",
      price: 32450.5,
      change: -245.3,
      percentChange: -0.75,
      forecast: 33750.25,
      forecastChange: 1299.75,
      correlation: 0.7,
    },
  ]

  // Mock global events affecting Indian markets
  const globalEvents = [
    {
      id: "1",
      title: "OPEC+ Production Cuts",
      date: "2025-03-15",
      impact: "High",
      description: "OPEC+ announces significant production cuts, affecting global oil supply and Indian fuel prices.",
      affectedCommodities: ["Crude Oil", "Natural Gas"],
    },
    {
      id: "2",
      title: "Drought in Major Wheat Producing Regions",
      date: "2025-05-20",
      impact: "Medium",
      description: "Severe drought conditions affecting wheat production in major growing regions of North India.",
      affectedCommodities: ["Wheat", "Rice"],
    },
    {
      id: "3",
      title: "New Trade Agreement with Middle East",
      date: "2025-07-10",
      impact: "Medium",
      description: "India signs new trade agreement with Middle Eastern countries reducing tariffs on raw materials.",
      affectedCommodities: ["Crude Oil", "Gold", "Spices"],
    },
    {
      id: "4",
      title: "Monsoon Delay Impact on Agriculture",
      date: "2025-06-15",
      impact: "High",
      description: "Delayed monsoon affecting agricultural output across multiple states in India.",
      affectedCommodities: ["Rice", "Cotton", "Pulses", "Spices"],
    },
    {
      id: "5",
      title: "RBI Interest Rate Decision",
      date: "2025-04-05",
      impact: "Medium",
      description: "Reserve Bank of India announces significant interest rate changes affecting market liquidity.",
      affectedCommodities: ["Gold", "Silver", "Financial Markets"],
    },
  ]

  // Mock historical data
  const generateHistoricalData = () => {
    const data = []
    const years = selectedTimeframe === "1y" ? 1 : selectedTimeframe === "5y" ? 5 : 10
    const baseValue =
      selectedCountry === "Global"
        ? 100
        : selectedCountry === "India"
          ? 110
          : selectedCountry === "United States"
            ? 105
            : selectedCountry === "China"
              ? 115
              : 95

    for (let i = 0; i <= years * 12; i++) {
      const date = new Date(2023, 0, 1)
      date.setMonth(date.getMonth() - years * 12 + i)

      // Add some randomness and trend
      const trend = (i / (years * 12)) * 20 // Upward trend
      const seasonal = Math.sin((i / 6) * Math.PI) * 5 // Seasonal component
      const random = (Math.random() - 0.5) * 10 // Random noise

      data.push({
        date: date.toISOString().split("T")[0],
        value: baseValue + trend + seasonal + random,
      })
    }

    return data
  }

  const historicalData = generateHistoricalData()

  // Get filtered economic data for the selected country and year
  const filteredEconomicData = economicData.filter(
    (item) => (selectedCountry === "All" || item.country === selectedCountry) && item.year.toString() === selectedYear,
  )

  // Download data as CSV
  const downloadCSV = () => {
    // Create CSV content
    const headers = [
      "Commodity",
      "Current Price",
      "Change",
      "% Change",
      "Forecast (EOY)",
      "Forecast Change",
      "Economic Correlation",
    ]
    const csvContent = [
      headers.join(","),
      ...commodityTrends.map((item) =>
        [
          item.commodity,
          item.price.toFixed(2),
          item.change.toFixed(2),
          item.percentChange.toFixed(2),
          item.forecast.toFixed(2),
          item.forecastChange.toFixed(2),
          item.correlation.toFixed(2),
        ].join(","),
      ),
    ].join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "market_trends_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4 bg-black text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">Indian Market Trends</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={downloadCSV}
          className="text-yellow-400 bg-black border-yellow-400 hover:bg-yellow-400/10"
        >
          <Download className="h-4 w-4 " />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="Global">Global</SelectItem>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="China">China</SelectItem>
              <SelectItem value="European Union">European Union</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2027">2027</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select Timeframe" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="1y">1 Year</SelectItem>
            <SelectItem value="5y">5 Years</SelectItem>
            <SelectItem value="10y">10 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">GDP</CardTitle>
            <CardDescription className="text-gray-400">Gross Domestic Product</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24 bg-gray-800" />
            ) : (
              <div className="text-2xl font-bold text-yellow-400">
                ₹{filteredEconomicData[0]?.gdp.toLocaleString()} B
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1">+3.2% from previous year</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Inflation Rate</CardTitle>
            <CardDescription className="text-gray-400">Annual percentage change</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24 bg-gray-800" />
            ) : (
              <div className="text-2xl font-bold text-yellow-400">{filteredEconomicData[0]?.inflation}%</div>
            )}
            <div className="text-xs text-gray-400 mt-1">-0.3% from previous year</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Unemployment</CardTitle>
            <CardDescription className="text-gray-400">Percentage of workforce</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24 bg-gray-800" />
            ) : (
              <div className="text-2xl font-bold text-yellow-400">{filteredEconomicData[0]?.unemployment}%</div>
            )}
            <div className="text-xs text-gray-400 mt-1">-0.2% from previous year</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Economic Growth</CardTitle>
            <CardDescription className="text-gray-400">Annual GDP growth rate</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24 bg-gray-800" />
            ) : (
              <div className="text-2xl font-bold text-yellow-400">{filteredEconomicData[0]?.growth}%</div>
            )}
            <div className="text-xs text-gray-400 mt-1">+0.1% from previous year</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Historical Trends</CardTitle>
            <CardDescription className="text-gray-400">
              {selectedCountry} economic indicators over{" "}
              {selectedTimeframe === "1y"
                ? "the past year"
                : selectedTimeframe === "5y"
                  ? "the past 5 years"
                  : "the past 10 years"}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="h-[300px] w-full bg-gray-800" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#ccc" }}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getMonth() + 1}/${date.getFullYear()}`
                    }}
                  />
                  <YAxis tick={{ fill: "#ccc" }} />
                  <Tooltip
                    formatter={(value) => [value, "Index Value"]}
                    labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#FFD700" name="Economic Index" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Commodity Impact by Sector</CardTitle>
            <CardDescription className="text-gray-400">Economic sector sensitivity to commodity prices</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="h-[300px] w-full bg-gray-800" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { sector: "Manufacturing", impact: 0.85 },
                    { sector: "Transportation", impact: 0.78 },
                    { sector: "Agriculture", impact: 0.65 },
                    { sector: "Energy", impact: 0.92 },
                    { sector: "Construction", impact: 0.71 },
                    { sector: "IT & Services", impact: 0.45 },
                    { sector: "Textiles", impact: 0.82 },
                  ]}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" domain={[0, 1]} tick={{ fill: "#ccc" }} />
                  <YAxis dataKey="sector" type="category" width={100} tick={{ fill: "#ccc" }} />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(2)}`, "Impact Score"]}
                    contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                  />
                  <Legend />
                  <Bar dataKey="impact" fill="#FFD700" name="Commodity Price Sensitivity" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Commodity Price Forecast</CardTitle>
          <CardDescription className="text-gray-400">
            Projected price changes based on economic indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-800">
            <div className="grid grid-cols-6 border-b border-gray-800 px-4 py-2 font-medium text-gray-300">
              <div>Commodity</div>
              <div>Current Price</div>
              <div>Change</div>
              <div>Forecast (EOY)</div>
              <div>Forecast Change</div>
              <div>Economic Correlation</div>
            </div>
            <div className="divide-y divide-gray-800">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-6 px-4 py-3">
                      <Skeleton className="h-4 w-3/4 bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800" />
                    </div>
                  ))
                : commodityTrends.map((commodity) => (
                    <div key={commodity.commodity} className="grid grid-cols-6 px-4 py-3">
                      <div className="font-medium text-white">{commodity.commodity}</div>
                      <div className="text-white">₹{commodity.price.toFixed(2)}</div>
                      <div className={commodity.change >= 0 ? "text-yellow-400" : "text-red-400"}>
                        {commodity.change >= 0 ? "+" : ""}
                        {commodity.change.toFixed(2)} ({commodity.percentChange.toFixed(2)}%)
                      </div>
                      <div className="text-white">₹{commodity.forecast.toFixed(2)}</div>
                      <div className="text-yellow-400">
                        +{commodity.forecastChange.toFixed(2)} (
                        {((commodity.forecastChange / commodity.price) * 100).toFixed(2)}%)
                      </div>
                      <div>
                        <Badge
                          variant={
                            commodity.correlation > 0.7
                              ? "default"
                              : commodity.correlation > 0.4
                                ? "secondary"
                                : "outline"
                          }
                          className={commodity.correlation > 0.7 ? "bg-yellow-400 text-black" : ""}
                        >
                          {commodity.correlation.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Global Events Impact</CardTitle>
          <CardDescription className="text-gray-400">Major events affecting Indian commodity markets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-gray-800" />
                    <Skeleton className="h-4 w-1/2 bg-gray-800" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                  </div>
                ))
              : globalEvents.map((event) => (
                  <div key={event.id} className="border border-gray-800 rounded-lg p-4 bg-gray-900">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-white">{event.title}</h3>
                      <Badge
                        variant={
                          event.impact === "High" ? "destructive" : event.impact === "Medium" ? "default" : "outline"
                        }
                        className={event.impact === "Medium" ? "bg-yellow-400 text-black" : ""}
                      >
                        {event.impact} Impact
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      <Calendar className="inline-block h-4 w-4 mr-1" /> {new Date(event.date).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{event.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-white">Affected Commodities:</span>
                      {event.affectedCommodities.map((commodity) => (
                        <Badge key={commodity} variant="outline" className="border-yellow-400 text-yellow-400">
                          {commodity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

