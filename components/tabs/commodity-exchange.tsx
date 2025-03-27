"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpIcon, ArrowDownIcon, RefreshCw, Search } from "lucide-react"
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

// Types
interface Commodity {
  id: string
  name: string
  price: number
  change: number
  percentChange: number
  volume: number
  updated: string
}

export default function CommodityExchange() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null)
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [historicalData, setHistoricalData] = useState<{ date: string; price: number }[]>([])
  const [correlationData, setCorrelationData] = useState<{ product: string; correlation: number }[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  // Fetch commodity data on component mount
  useEffect(() => {
    fetchCommodityData()
  }, [])

  // Fetch historical data when commodity changes
  useEffect(() => {
    if (selectedCommodity) {
      fetchHistoricalData(selectedCommodity)
      fetchCorrelationData(selectedCommodity)
    }
  }, [selectedCommodity])

  const fetchCommodityData = async () => {
    setLoading(true)

    // In a real app, this would be an API call
    // For now, we'll simulate with mock data
    setTimeout(() => {
      setCommodities(mockCommodities)
      setSelectedCommodity(mockCommodities[0].id)
      setLoading(false)
    }, 1000)
  }

  const fetchHistoricalData = async (commodityId: string) => {
    // In a real app, this would be an API call
    // For now, we'll simulate with mock data
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split("T")[0]
    })

    // Generate random price data based on the commodity
    const commodity = commodities.find((c) => c.id === commodityId)
    if (!commodity) return

    let basePrice = commodity.price * 0.9 // Start at 90% of current price
    const data: { date: string; price: number }[] = []

    for (let i = 0; i < dates.length; i++) {
      data.push({
        date: dates[i],
        price: basePrice,
      })

      // Random price change with trend
      const change = (Math.random() - 0.45) * (basePrice * 0.02) // Slight upward bias
      basePrice += change
    }

    setHistoricalData(data)
  }

  const fetchCorrelationData = async (commodityId: string) => {
    // In a real app, this would be an API call
    // For now, we'll simulate with mock data
    const commodity = commodities.find((c) => c.id === commodityId)
    if (!commodity) return

    // Generate correlation data based on the commodity
    let products: string[] = []

    if (commodity.name === "Crude Oil") {
      products = ["Plastic Products", "Transportation", "Chemicals", "Packaging", "Energy"]
    } else if (commodity.name === "Gold") {
      products = ["Jewelry", "Electronics", "Medical Devices", "Aerospace", "Dentistry"]
    } else if (commodity.name === "Wheat") {
      products = ["Bread", "Pasta", "Cereal", "Baked Goods", "Animal Feed"]
    } else {
      products = ["Product A", "Product B", "Product C", "Product D", "Product E"]
    }

    const correlations = products.map((product) => ({
      product,
      correlation: Math.random() * 0.6 + 0.3, // Random correlation between 0.3 and 0.9
    }))

    setCorrelationData(correlations)
  }

  const refreshData = () => {
    fetchCommodityData()
  }

  const filteredCommodities = commodities.filter((commodity) =>
    commodity.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Energy">Energy</SelectItem>
                <SelectItem value="Metals">Metals</SelectItem>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
                <SelectItem value="Livestock">Livestock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search commodities..."
              className="w-full md:w-[300px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Button variant="outline" size="icon" onClick={refreshData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-4">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))
          : filteredCommodities.slice(0, 4).map((commodity) => (
              <Card
                key={commodity.id}
                className={`overflow-hidden cursor-pointer ${selectedCommodity === commodity.id ? "border-primary" : ""}`}
                onClick={() => setSelectedCommodity(commodity.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardDescription>{commodity.updated}</CardDescription>
                  <CardTitle>{commodity.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">${commodity.price.toFixed(2)}</span>
                    <Badge
                      variant={commodity.change >= 0 ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {commodity.change >= 0 ? (
                        <ArrowUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3" />
                      )}
                      {commodity.percentChange.toFixed(2)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Volume: {commodity.volume.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Price History (30 Days)</CardTitle>
            <CardDescription>
              {selectedCommodity && commodities.find((c) => c.id === selectedCommodity)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading || !historicalData.length ? (
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
                      return `${date.getMonth() + 1}/${date.getDate()}`
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
                    labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" name="Price ($)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Correlation</CardTitle>
            <CardDescription>
              Impact of {selectedCommodity && commodities.find((c) => c.id === selectedCommodity)?.name} on product
              prices
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading || !correlationData.length ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={correlationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 1]} />
                  <YAxis dataKey="product" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}`, "Correlation"]} />
                  <Legend />
                  <Bar dataKey="correlation" fill="#82ca9d" name="Correlation Coefficient" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Commodities</CardTitle>
          <CardDescription>Live prices of major commodities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 border-b px-4 py-2 font-medium">
              <div>Commodity</div>
              <div>Price</div>
              <div>Change</div>
              <div>% Change</div>
              <div>Volume</div>
            </div>
            <div className="divide-y">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-5 px-4 py-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))
                : filteredCommodities.map((commodity) => (
                    <div
                      key={commodity.id}
                      className={`grid grid-cols-5 px-4 py-3 cursor-pointer hover:bg-muted/50 ${selectedCommodity === commodity.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedCommodity(commodity.id)}
                    >
                      <div className="font-medium">{commodity.name}</div>
                      <div>${commodity.price.toFixed(2)}</div>
                      <div className={commodity.change >= 0 ? "text-green-600" : "text-red-600"}>
                        {commodity.change >= 0 ? "+" : ""}
                        {commodity.change.toFixed(2)}
                      </div>
                      <div className={commodity.change >= 0 ? "text-green-600" : "text-red-600"}>
                        {commodity.change >= 0 ? "+" : ""}
                        {commodity.percentChange.toFixed(2)}%
                      </div>
                      <div>{commodity.volume.toLocaleString()}</div>
                    </div>
                  ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Mock data for commodities
const mockCommodities: Commodity[] = [
  {
    id: "crude-oil",
    name: "Crude Oil",
    price: 75.23,
    change: 0.45,
    percentChange: 0.6,
    volume: 1245000,
    updated: "Just now",
  },
  {
    id: "natural-gas",
    name: "Natural Gas",
    price: 2.87,
    change: -0.12,
    percentChange: -4.01,
    volume: 987000,
    updated: "1 min ago",
  },
  {
    id: "gold",
    name: "Gold",
    price: 1923.45,
    change: 12.3,
    percentChange: 0.64,
    volume: 456000,
    updated: "Just now",
  },
  {
    id: "silver",
    name: "Silver",
    price: 23.67,
    change: 0.23,
    percentChange: 0.98,
    volume: 321000,
    updated: "2 min ago",
  },
  {
    id: "copper",
    name: "Copper",
    price: 3.78,
    change: -0.05,
    percentChange: -1.31,
    volume: 654000,
    updated: "Just now",
  },
  {
    id: "wheat",
    name: "Wheat",
    price: 6.42,
    change: 0.08,
    percentChange: 1.26,
    volume: 432000,
    updated: "5 min ago",
  },
]

