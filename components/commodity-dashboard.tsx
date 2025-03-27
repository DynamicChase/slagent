"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  Cell,
} from "@/components/ui/chart"

// Types
interface CommodityPrice {
  commodity: string
  price: string
  change: string
  percentChange: string
  updated: string
}

interface CorrelationData {
  product: string
  correlation: number
}

const CommodityDashboard = () => {
  const [selectedCommodity, setSelectedCommodity] = useState("Crude Oil")
  const [priceData, setPriceData] = useState<CommodityPrice[]>([])
  const [trendData, setTrendData] = useState<{ date: string; price: number }[]>([])
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch data on component mount and when commodity changes
  useEffect(() => {
    fetchCommodityData()
  }, [selectedCommodity])

  const fetchCommodityData = async () => {
    setLoading(true)

    // In a real app, this would be an API call
    // For now, we'll simulate with dummy data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate dummy price data
    const dummyPriceData: CommodityPrice[] = [
      { commodity: "Crude Oil", price: "$75.23", change: "+0.45", percentChange: "+0.60%", updated: "Just now" },
      { commodity: "Natural Gas", price: "$2.87", change: "-0.12", percentChange: "-4.01%", updated: "1 min ago" },
      { commodity: "Gold", price: "$1,923.45", change: "+12.30", percentChange: "+0.64%", updated: "Just now" },
      { commodity: "Silver", price: "$23.67", change: "+0.23", percentChange: "+0.98%", updated: "2 min ago" },
      { commodity: "Copper", price: "$3.78", change: "-0.05", percentChange: "-1.31%", updated: "Just now" },
    ]

    // Generate dummy trend data (30 days)
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split("T")[0]
    })

    // Random walk for prices
    let price =
      selectedCommodity === "Crude Oil"
        ? 75
        : selectedCommodity === "Natural Gas"
          ? 3
          : selectedCommodity === "Gold"
            ? 1900
            : selectedCommodity === "Silver"
              ? 24
              : 4 // Copper

    const dummyTrendData = dates.map((date) => {
      price += (Math.random() - 0.5) * (price * 0.02) // Random walk with 2% volatility
      return { date, price: Number(price.toFixed(2)) }
    })

    // Generate dummy correlation data
    const products = ["Plastic", "Packaging", "Fuel", "Chemicals", "Transport"]
    const dummyCorrelationData = products.map((product) => ({
      product,
      correlation: Number((Math.random() * 0.6 + 0.3).toFixed(2)), // Random correlation between 0.3 and 0.9
    }))

    setPriceData(dummyPriceData)
    setTrendData(dummyTrendData)
    setCorrelationData(dummyCorrelationData)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
            <SelectTrigger className="w-[180px]">
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

          <Button variant="outline" size="icon" onClick={fetchCommodityData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Commodity Prices</CardTitle>
          <CardDescription>Real-time prices of major commodities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>% Change</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceData.map((item) => (
                <TableRow key={item.commodity}>
                  <TableCell className="font-medium">{item.commodity}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell className={item.change.startsWith("+") ? "text-green-600" : "text-red-600"}>
                    {item.change}
                  </TableCell>
                  <TableCell className={item.percentChange.startsWith("+") ? "text-green-600" : "text-red-600"}>
                    {item.percentChange}
                  </TableCell>
                  <TableCell>{item.updated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{selectedCommodity} Price Trend (30 Days)</CardTitle>
            <CardDescription>Historical price movement</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
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
                  formatter={(value) => [`$${value}`, "Price"]}
                  labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} name="Price ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{selectedCommodity} Impact on Products</CardTitle>
            <CardDescription>Correlation between commodity and product prices</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={correlationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 1]} />
                <YAxis dataKey="product" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value}`, "Correlation"]} />
                <Legend />
                <Bar dataKey="correlation" fill="#82ca9d" name="Correlation Coefficient">
                  {correlationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.correlation > 0.6 ? "#ff8042" : "#82ca9d"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CommodityDashboard

