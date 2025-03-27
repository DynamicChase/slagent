"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from "@/components/ui/chart"

// Types
interface ProductSales {
  product: string
  salesVolume: string
  revenue: string
  commodityImpact: string
  inventoryLevel: string
}

interface SalesVsCommodity {
  month: string
  sales: number
  price: number
}

interface InventoryData {
  day: number
  level: number
}

const SalesAnalysis = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [salesData, setSalesData] = useState<ProductSales[]>([])
  const [salesVsCommodity, setSalesVsCommodity] = useState<SalesVsCommodity[]>([])
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([])
  const [optimalRestockDay, setOptimalRestockDay] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    setLoading(true)

    // In a real app, this would be an API call
    // For now, we'll simulate with dummy data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate dummy sales data
    const dummySalesData: ProductSales[] = [
      {
        product: "Plastic Containers",
        salesVolume: "12,450",
        revenue: "$45,230",
        commodityImpact: "High",
        inventoryLevel: "Low",
      },
      {
        product: "Packaging Materials",
        salesVolume: "8,320",
        revenue: "$28,750",
        commodityImpact: "Medium",
        inventoryLevel: "Medium",
      },
      {
        product: "Fuel Products",
        salesVolume: "15,780",
        revenue: "$89,450",
        commodityImpact: "Very High",
        inventoryLevel: "High",
      },
      {
        product: "Chemical Solutions",
        salesVolume: "5,230",
        revenue: "$32,780",
        commodityImpact: "Medium",
        inventoryLevel: "Low",
      },
      {
        product: "Transport Services",
        salesVolume: "3,450",
        revenue: "$67,890",
        commodityImpact: "High",
        inventoryLevel: "N/A",
      },
    ]

    // Generate dummy sales vs commodity data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const dummySalesVsCommodity = months.map((month) => ({
      month,
      sales: Math.floor(Math.random() * 10000) + 5000,
      price: Math.floor(Math.random() * 20) + 60,
    }))

    // Generate dummy inventory data
    const days = Array.from({ length: 30 }, (_, i) => i + 1)
    let inventory = 100
    const dummyInventoryData = days.map((day) => {
      // Random daily consumption between 2 and 5 units
      const consumption = Math.random() * 3 + 2
      inventory = Math.max(0, inventory - consumption)
      return { day, level: Number(inventory.toFixed(1)) }
    })

    // Find optimal restock day (when inventory crosses 20)
    const restock = dummyInventoryData.findIndex((item) => item.level <= 20)
    setOptimalRestockDay(restock !== -1 ? dummyInventoryData[restock].day : null)

    setSalesData(dummySalesData)
    setSalesVsCommodity(dummySalesVsCommodity)
    setInventoryData(dummyInventoryData)
    setLoading(false)
  }

  const handleSearch = () => {
    // In a real app, this would filter data from an API or database
    console.log(`Searching for: ${searchTerm}`)
    // For demo, we'll just refresh the data
    fetchSalesData()
  }

  const filteredSalesData = salesData.filter((item) => item.product.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button type="submit" onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Sales Data</CardTitle>
          <CardDescription>Sales performance and commodity impact</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Sales Volume</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Commodity Impact</TableHead>
                <TableHead>Inventory Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalesData.map((item) => (
                <TableRow key={item.product}>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell>{item.salesVolume}</TableCell>
                  <TableCell>{item.revenue}</TableCell>
                  <TableCell>
                    <span
                      className={
                        item.commodityImpact === "Very High"
                          ? "text-red-600"
                          : item.commodityImpact === "High"
                            ? "text-orange-500"
                            : item.commodityImpact === "Medium"
                              ? "text-yellow-500"
                              : "text-green-500"
                      }
                    >
                      {item.commodityImpact}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        item.inventoryLevel === "Low"
                          ? "text-red-600"
                          : item.inventoryLevel === "Medium"
                            ? "text-yellow-500"
                            : item.inventoryLevel === "High"
                              ? "text-green-500"
                              : ""
                      }
                    >
                      {item.inventoryLevel}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Volume vs Commodity Price</CardTitle>
            <CardDescription>Relationship between sales and commodity prices</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesVsCommodity} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="sales" fill="#8884d8" name="Sales Volume" />
                <Line yAxisId="right" type="monotone" dataKey="price" stroke="#82ca9d" name="Commodity Price ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Level and Optimal Restocking</CardTitle>
            <CardDescription>Inventory trends and reorder points</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inventoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" label={{ value: "Day of Month", position: "insideBottomRight", offset: -10 }} />
                <YAxis label={{ value: "Inventory Level", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <ReferenceLine y={20} stroke="red" strokeDasharray="3 3" label="Reorder Point" />
                {optimalRestockDay && (
                  <ReferenceLine
                    x={optimalRestockDay}
                    stroke="green"
                    strokeDasharray="3 3"
                    label={{ value: `Optimal Restock (Day ${optimalRestockDay})`, position: "top" }}
                  />
                )}
                <Line type="monotone" dataKey="level" stroke="#8884d8" name="Inventory Level" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SalesAnalysis

