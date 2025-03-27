"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
import { Calendar } from "lucide-react"

export default function MarketTrends() {
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState<string>("Global")
  const [selectedYear, setSelectedYear] = useState<string>("2025")
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1y")

  // Simulate loading data
  useState(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  })

  // Mock economic data
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
    {
      country: "India",
      year: 2025,
      gdp: 3800,
      inflation: 5.0,
      unemployment: 7.0,
      growth: 6.5,
    },
  ]

  // Mock commodity trends
  const commodityTrends = [
    {
      commodity: "Crude Oil",
      price: 75.23,
      change: 0.45,
      percentChange: 0.6,
      forecast: 78.5,
      forecastChange: 3.27,
      correlation: 0.85,
    },
    {
      commodity: "Gold",
      price: 1923.45,
      change: 12.3,
      percentChange: 0.64,
      forecast: 2050.2,
      forecastChange: 126.75,
      correlation: 0.72,
    },
    {
      commodity: "Wheat",
      price: 6.42,
      change: 0.08,
      percentChange: 1.26,
      forecast: 6.85,
      forecastChange: 0.43,
      correlation: 0.65,
    },
    {
      commodity: "Natural Gas",
      price: 2.87,
      change: -0.12,
      percentChange: -4.01,
      forecast: 3.15,
      forecastChange: 0.28,
      correlation: 0.78,
    },
    {
      commodity: "Copper",
      price: 3.78,
      change: -0.05,
      percentChange: -1.31,
      forecast: 4.1,
      forecastChange: 0.32,
      correlation: 0.81,
    },
  ]

  // Mock global events
  const globalEvents = [
    {
      id: "1",
      title: "OPEC+ Production Cuts",
      date: "2025-03-15",
      impact: "High",
      description: "OPEC+ announces significant production cuts, affecting global oil supply.",
      affectedCommodities: ["Crude Oil", "Natural Gas"],
    },
    {
      id: "2",
      title: "Drought in Major Wheat Producing Regions",
      date: "2025-05-20",
      impact: "Medium",
      description: "Severe drought conditions affecting wheat production in major growing regions.",
      affectedCommodities: ["Wheat", "Corn"],
    },
    {
      id: "3",
      title: "New Trade Agreement",
      date: "2025-07-10",
      impact: "Medium",
      description: "Major economies sign new trade agreement reducing tariffs on raw materials.",
      affectedCommodities: ["Copper", "Aluminum", "Steel"],
    },
  ]

  // Mock historical data
  const generateHistoricalData = () => {
    const data = []
    const years = selectedTimeframe === "1y" ? 1 : selectedTimeframe === "5y" ? 5 : 10
    const baseValue =
      selectedCountry === "Global"
        ? 100
        : selectedCountry === "United States"
          ? 110
          : selectedCountry === "China"
            ? 95
            : selectedCountry === "European Union"
              ? 105
              : 90

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Global">Global</SelectItem>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="China">China</SelectItem>
              <SelectItem value="European Union">European Union</SelectItem>
              <SelectItem value="India">India</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2027">2027</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1y">1 Year</SelectItem>
            <SelectItem value="5y">5 Years</SelectItem>
            <SelectItem value="10y">10 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">GDP</CardTitle>
            <CardDescription>Gross Domestic Product</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">${filteredEconomicData[0]?.gdp.toLocaleString()} B</div>
            )}
            <div className="text-xs text-muted-foreground mt-1">+3.2% from previous year</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inflation Rate</CardTitle>
            <CardDescription>Annual percentage change</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{filteredEconomicData[0]?.inflation}%</div>
            )}
            <div className="text-xs text-muted-foreground mt-1">-0.3% from previous year</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unemployment</CardTitle>
            <CardDescription>Percentage of workforce</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{filteredEconomicData[0]?.unemployment}%</div>
            )}
            <div className="text-xs text-muted-foreground mt-1">-0.2% from previous year</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Economic Growth</CardTitle>
            <CardDescription>Annual GDP growth rate</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{filteredEconomicData[0]?.growth}%</div>
            )}
            <div className="text-xs text-muted-foreground mt-1">+0.1% from previous year</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Historical Trends</CardTitle>
            <CardDescription>
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
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getMonth() + 1}/${date.getFullYear()}`
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [value, "Index Value"]}
                    labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="Economic Index" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commodity Impact by Sector</CardTitle>
            <CardDescription>Economic sector sensitivity to commodity prices</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="h-[300px] w-full" />
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
                  ]}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 1]} />
                  <YAxis dataKey="sector" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}`, "Impact Score"]} />
                  <Legend />
                  <Bar dataKey="impact" fill="#82ca9d" name="Commodity Price Sensitivity" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commodity Price Forecast</CardTitle>
          <CardDescription>Projected price changes based on economic indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-6 border-b px-4 py-2 font-medium">
              <div>Commodity</div>
              <div>Current Price</div>
              <div>Change</div>
              <div>Forecast (EOY)</div>
              <div>Forecast Change</div>
              <div>Economic Correlation</div>
            </div>
            <div className="divide-y">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-6 px-4 py-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))
                : commodityTrends.map((commodity) => (
                    <div key={commodity.commodity} className="grid grid-cols-6 px-4 py-3">
                      <div className="font-medium">{commodity.commodity}</div>
                      <div>${commodity.price.toFixed(2)}</div>
                      <div className={commodity.change >= 0 ? "text-green-600" : "text-red-600"}>
                        {commodity.change >= 0 ? "+" : ""}
                        {commodity.change.toFixed(2)} ({commodity.percentChange.toFixed(2)}%)
                      </div>
                      <div>${commodity.forecast.toFixed(2)}</div>
                      <div className="text-green-600">
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

      <Card>
        <CardHeader>
          <CardTitle>Global Events Impact</CardTitle>
          <CardDescription>Major events affecting commodity markets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              : globalEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium">{event.title}</h3>
                      <Badge
                        variant={
                          event.impact === "High" ? "destructive" : event.impact === "Medium" ? "default" : "outline"
                        }
                      >
                        {event.impact} Impact
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <Calendar className="inline-block h-4 w-4 mr-1" /> {new Date(event.date).toLocaleDateString()}
                    </div>
                    <p className="text-sm mb-2">{event.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium">Affected Commodities:</span>
                      {event.affectedCommodities.map((commodity) => (
                        <Badge key={commodity} variant="outline">
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

