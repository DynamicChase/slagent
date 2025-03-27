"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpIcon, ArrowDownIcon, RefreshCw, Search, Download } from 'lucide-react'
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

// Commodity type based on API fields with derived insights.
interface Commodity {
  id: string
  name: string
  price: number
  change: number
  percentChange: number
  volume: number
  category: string
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
  const [filterQuery, setFilterQuery] = useState("") // extra filter below graphs

  // Fetch commodity data on component mount
  useEffect(() => {
    fetchCommodityData()
  }, [])

  // Fetch historical & correlation data when commodity changes
  useEffect(() => {
    if (selectedCommodity) {
      fetchHistoricalData(selectedCommodity)
      fetchCorrelationData(selectedCommodity)
    }
  }, [selectedCommodity])

  const fetchCommodityData = async () => {
    setLoading(true)
    try {
      // For demonstration we use mock data; replace this with an API call if needed.
      setTimeout(() => {
        setCommodities(mockCommodities)
        if (mockCommodities.length > 0) {
          setSelectedCommodity(mockCommodities[0].id)
        }
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching data: ", error)
      setLoading(false)
    }
  }

  const fetchHistoricalData = async (commodityId: string) => {
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split("T")[0]
    })

    const commodity = commodities.find((c) => c.id === commodityId)
    if (!commodity) return

    let basePrice = commodity.price * 0.9 // Starting at 90% of current price
    const data: { date: string; price: number }[] = []
    for (let i = 0; i < dates.length; i++) {
      data.push({ date: dates[i], price: basePrice })
      const change = (Math.random() - 0.45) * (basePrice * 0.02) // Slight upward bias
      basePrice += change
    }
    setHistoricalData(data)
  }

  const fetchCorrelationData = async (commodityId: string) => {
    const commodity = commodities.find((c) => c.id === commodityId)
    if (!commodity) return

    // Generate correlation data based on the commodity name.
    let products: string[] = []
    if (commodity.name === "Crude Oil") {
      products = ["Petrol", "Diesel", "Plastics", "Chemicals", "Fertilizers"]
    } else if (commodity.name === "Gold") {
      products = ["Jewelry", "Electronics", "Banking", "Investment", "Dentistry"]
    } else if (commodity.name === "Natural Gas") {
      products = ["Electricity", "Fertilizers", "Chemicals", "Cooking Fuel", "Industrial Heating"]
    } else if (commodity.name === "Silver") {
      products = ["Jewelry", "Electronics", "Photography", "Silverware", "Medical"]
    } else if (commodity.name === "Copper") {
      products = ["Electronics", "Construction", "Transportation", "Industrial Machinery", "Consumer Products"]
    } else if (commodity.name === "Wheat") {
      products = ["Flour", "Bread", "Pasta", "Biscuits", "Animal Feed"]
    } else if (commodity.name === "Rice") {
      products = ["Food Products", "Beverages", "Animal Feed", "Biofuel", "Cosmetics"]
    } else if (commodity.name === "Cotton") {
      products = ["Textiles", "Apparel", "Home Furnishings", "Medical Supplies", "Industrial Products"]
    } else if (commodity.name === "Rubber") {
      products = ["Tires", "Footwear", "Industrial Products", "Medical Supplies", "Sports Equipment"]
    } else if (commodity.name === "Iron Ore") {
      products = ["Steel", "Construction", "Automotive", "Machinery", "Consumer Durables"]
    } else if (commodity.name === "Aluminium") {
      products = ["Construction", "Transportation", "Packaging", "Electronics", "Consumer Durables"]
    } else if (commodity.name === "Sugar") {
      products = ["Food Products", "Beverages", "Confectionery", "Pharmaceuticals", "Biofuel"]
    } else {
      // Default products list if no specific mapping exists
      products = ["Product A", "Product B", "Product C", "Product D", "Product E"]
    }
    const correlations = products.map((product) => ({
      product,
      correlation: Number((Math.random() * 0.6 + 0.3).toFixed(2)), // random between 0.3 and 0.9
    }))
    setCorrelationData(correlations)
  }

  const refreshData = () => {
    fetchCommodityData()
  }

  // Top filter list for commodity search (used for list display)
  const filteredCommodities = commodities.filter((commodity) =>
    commodity.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Additional filter options below the graphs (filter by category)
  const furtherFilteredCommodities = commodities.filter((commodity) =>
    commodity.name.toLowerCase().includes(filterQuery.toLowerCase()) &&
    (selectedCategory === "All" || commodity.category === selectedCategory)
  )

  // Download data as CSV
  const downloadCSV = () => {
    // Create CSV content
    const headers = ["Commodity", "Price", "Change", "% Change", "Volume", "Category", "Updated"];
    const csvContent = [
      headers.join(","),
      ...furtherFilteredCommodities.map(item => 
        [
          item.name,
          item.price.toFixed(2),
          item.change.toFixed(2),
          item.percentChange.toFixed(2),
          item.volume,
          item.category,
          item.updated
        ].join(",")
      )
    ].join("\n");

    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'commodity_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 bg-black text-white">
      {/* Top Section: Refresh Button */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-yellow-400">Indian Commodity Exchange</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={downloadCSV} className="bg-black text-yellow-400 border-yellow-400 hover:bg-yellow-400/10">
            <Download className="h-4 w-4 bg-black" />
          </Button>
          <Button variant="outline" size="icon" onClick={refreshData} disabled={loading} className="text-yellow-400 bg-black border-yellow-400 hover:bg-yellow-400/10">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Commodity List */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden bg-gray-900 border-gray-800">
                <CardHeader className="p-4">
                  <Skeleton className="h-4 w-1/2 bg-gray-800" />
                  <Skeleton className="h-8 w-3/4 bg-gray-800" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-4 w-full bg-gray-800" />
                </CardContent>
              </Card>
            ))
          : filteredCommodities.slice(0, 4).map((commodity) => (
              <Card
                key={commodity.id}
                className={`overflow-hidden cursor-pointer bg-gray-900 border-gray-800 ${selectedCommodity === commodity.id ? "border-yellow-400" : ""}`}
                onClick={() => setSelectedCommodity(commodity.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-gray-400">{commodity.updated}</CardDescription>
                  <CardTitle className="text-white">{commodity.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-yellow-500">₹{commodity.price.toFixed(2)}</span>
                    <Badge variant={commodity.change >= 0 ? "default" : "destructive"} className={`flex items-center gap-1 ${commodity.change >= 0 ? "bg-yellow-400 text-black" : "bg-red-500 text-white"}`}>
                      {commodity.change >= 0 ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                      {commodity.percentChange.toFixed(2)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Volume: {commodity.volume.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Price History (30 Days)</CardTitle>
            <CardDescription className="text-gray-400">
              {selectedCommodity && commodities.find((c) => c.id === selectedCommodity)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading || !historicalData.length ? (
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
                      return `${date.getMonth() + 1}/${date.getDate()}`
                    }}
                  />
                  <YAxis tick={{ fill: "#ccc" }} />
                  <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Price"]} labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`} contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#FFD700" name="Price (₹)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Product Correlation</CardTitle>
            <CardDescription className="text-gray-400">
              Impact of {selectedCommodity && commodities.find((c) => c.id === selectedCommodity)?.name} on product prices
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="h-[300px] w-full bg-gray-800" />
              </div>
            ) : correlationData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={correlationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" domain={[0, 1]} tick={{ fill: "#ccc" }} />
                  <YAxis dataKey="product" type="category" width={100} tick={{ fill: "#ccc" }} />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}`, "Correlation"]} contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                  <Legend />
                  <Bar dataKey="correlation" fill="#FFD700" name="Correlation Coefficient" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400">No correlation data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Filter Section below the graphs */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          type="search"
          placeholder="Search commodities..."
          className="w-full md:w-[300px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Energy">Energy</SelectItem>
            <SelectItem value="Metals">Metals</SelectItem>
            <SelectItem value="Agriculture">Agriculture</SelectItem>
            <SelectItem value="Livestock">Livestock</SelectItem>
            <SelectItem value="Spices">Spices</SelectItem>
            <SelectItem value="Textiles">Textiles</SelectItem>
            <SelectItem value="Oilseeds">Oilseeds</SelectItem>
            <SelectItem value="Pulses">Pulses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* All Commodities List */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">All Commodities</CardTitle>
          <CardDescription className="text-gray-400">Live prices of major commodities in the Indian market</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-800">
            <div className="grid grid-cols-6 border-b border-gray-800 px-4 py-2 font-medium text-gray-300">
              <div>Commodity</div>
              <div>Category</div>
              <div>Price</div>
              <div>Change</div>
              <div>% Change</div>
              <div>Volume</div>
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
                      <Skeleton className="h-4 w-3/4 bg-gray-800" />
                    </div>
                  ))
                : furtherFilteredCommodities.map((commodity) => (
                    <div
                      key={commodity.id}
                      className={`grid grid-cols-6 px-4 py-3 cursor-pointer hover:bg-gray-800/50 ${
                        selectedCommodity === commodity.id ? "bg-gray-800" : ""
                      }`}
                      onClick={() => setSelectedCommodity(commodity.id)}
                    >
                      <div className="font-medium text-white">{commodity.name}</div>
                      <div className="text-gray-300">{commodity.category}</div>
                      <div className="text-white">₹{commodity.price.toFixed(2)}</div>
                      <div className={commodity.change >= 0 ? "text-yellow-400" : "text-red-400"}>
                        {commodity.change >= 0 ? "+" : ""}
                        {commodity.change.toFixed(2)}
                      </div>
                      <div className={commodity.change >= 0 ? "text-yellow-400" : "text-red-400"}>
                        {commodity.change >= 0 ? "+" : ""}
                        {commodity.percentChange.toFixed(2)}%
                      </div>
                      <div className="text-gray-300">{commodity.volume.toLocaleString()}</div>
                    </div>
                  ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Mock data for commodities (Indian market data)
const mockCommodities = [
  {
    id: "crude-oil",
    name: "Crude Oil",
    price: 5823.75,
    change: 45.30,
    percentChange: 0.78,
    volume: 1245000,
    category: "Energy",
    updated: "Just now",
  },
  {
    id: "natural-gas",
    name: "Natural Gas",
    price: 215.40,
    change: -8.25,
    percentChange: -3.69,
    volume: 987000,
    category: "Energy",
    updated: "1 min ago",
  },
  {
    id: "gold",
    name: "Gold",
    price: 62450.75,
    change: 345.25,
    percentChange: 0.56,
    volume: 456000,
    category: "Metals",
    updated: "Just now",
  },
  {
    id: "silver",
    name: "Silver",
    price: 75320.50,
    change: 630.75,
    percentChange: 0.84,
    volume: 321000,
    category: "Metals",
    updated: "2 min ago",
  },
  {
    id: "copper",
    name: "Copper",
    price: 780.45,
    change: -12.30,
    percentChange: -1.55,
    volume: 654000,
    category: "Metals",
    updated: "Just now",
  },
  {
    id: "wheat",
    name: "Wheat",
    price: 2340.25,
    change: 18.50,
    percentChange: 0.80,
    volume: 432000,
    category: "Agriculture",
    updated: "5 min ago",
  },
  {
    id: "rice",
    name: "Rice",
    price: 4250.75,
    change: 35.25,
    percentChange: 0.84,
    volume: 385000,
    category: "Agriculture",
    updated: "10 min ago",
  },
  {
    id: "cotton",
    name: "Cotton",
    price: 32450.50,
    change: -245.30,
    percentChange: -0.75,
    volume: 278000,
    category: "Textiles",
    updated: "15 min ago",
  },
  {
    id: "rubber",
    name: "Rubber",
    price: 18750.25,
    change: 125.50,
    percentChange: 0.67,
    volume: 195000,
    category: "Agriculture",
    updated: "20 min ago",
  },
  {
    id: "iron-ore",
    name: "Iron Ore",
    price: 5430.75,
    change: -78.25,
    percentChange: -1.42,
    volume: 542000,
    category: "Metals",
    updated: "25 min ago",
  },
  {
    id: "aluminium",
    name: "Aluminium",
    price: 245.30,
    change: 3.75,
    percentChange: 1.55,
    volume: 325000,
    category: "Metals",
    updated: "30 min ago",
  },
  {
    id: "sugar",
    name: "Sugar",
    price: 3850.25,
    change: 25.50,
    percentChange: 0.67,
    volume: 275000,
    category: "Agriculture",
    updated: "35 min ago",
  },
  {
    id: "cardamom",
    name: "Cardamom",
    price: 1250.75,
    change: 15.25,
    percentChange: 1.23,
    volume: 125000,
    category: "Spices",
    updated: "40 min ago",
  },
  {
    id: "turmeric",
    name: "Turmeric",
    price: 9850.50,
    change: 75.30,
    percentChange: 0.77,
    volume: 185000,
    category: "Spices",
    updated: "45 min ago",
  },
  {
    id: "pepper",
    name: "Black Pepper",
    price: 52450.25,
    change: -325.50,
    percentChange: -0.62,
    volume: 95000,
    category: "Spices",
    updated: "50 min ago",
  },
  {
    id: "soybean",
    name: "Soybean",
    price: 4530.75,
    change: 35.25,
    percentChange: 0.78,
    volume: 265000,
    category: "Oilseeds",
    updated: "55 min ago",
  },
  {
    id: "mustard-seed",
    name: "Mustard Seed",
    price: 5875.50,
    change: 45.25,
    percentChange: 0.78,
    volume: 185000,
    category: "Oilseeds",
    updated: "1 hour ago",
  },
  {
    id: "chana",
    name: "Chana (Chickpea)",
    price: 5230.25,
    change: -25.50,
    percentChange: -0.49,
    volume: 215000,
    category: "Pulses",
    updated: "1 hour ago",
  },
  {
    id: "moong",
    name: "Moong Dal",
    price: 7850.75,
    change: 65.25,
    percentChange: 0.84,
    volume: 125000,
    category: "Pulses",
    updated: "1 hour ago",
  },
  {
    id: "urad",
    name: "Urad Dal",
    price: 8450.50,
    change: 75.30,
    percentChange: 0.90,
    volume: 95000,
    category: "Pulses",
    updated: "1 hour ago",
  },
]
