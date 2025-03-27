"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download } from 'lucide-react'
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
  category: string
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
  const [categoryFilter, setCategoryFilter] = useState("All")
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

    // Generate dummy sales data with Indian products
    const dummySalesData: ProductSales[] = [
      {
        product: "HDPE Containers",
        category: "Plastics",
        salesVolume: "12,450",
        revenue: "₹8,45,230",
        commodityImpact: "High",
        inventoryLevel: "Low",
      },
      {
        product: "Jute Packaging",
        category: "Packaging",
        salesVolume: "8,320",
        revenue: "₹5,28,750",
        commodityImpact: "Medium",
        inventoryLevel: "Medium",
      },
      {
        product: "Diesel Products",
        category: "Fuel",
        salesVolume: "15,780",
        revenue: "₹12,89,450",
        commodityImpact: "Very High",
        inventoryLevel: "High",
      },
      {
        product: "Fertilizer Solutions",
        category: "Chemicals",
        salesVolume: "5,230",
        revenue: "₹6,32,780",
        commodityImpact: "Medium",
        inventoryLevel: "Low",
      },
      {
        product: "Logistics Services",
        category: "Transport",
        salesVolume: "3,450",
        revenue: "₹9,67,890",
        commodityImpact: "High",
        inventoryLevel: "N/A",
      },
      {
        product: "Cotton Textiles",
        category: "Textiles",
        salesVolume: "7,850",
        revenue: "₹11,45,320",
        commodityImpact: "High",
        inventoryLevel: "Medium",
      },
      {
        product: "Basmati Rice",
        category: "Food",
        salesVolume: "9,250",
        revenue: "₹7,85,450",
        commodityImpact: "Medium",
        inventoryLevel: "High",
      },
      {
        product: "Spice Extracts",
        category: "Food",
        salesVolume: "4,120",
        revenue: "₹5,65,780",
        commodityImpact: "Low",
        inventoryLevel: "Medium",
      },
      {
        product: "Steel Components",
        category: "Metals",
        salesVolume: "6,540",
        revenue: "₹8,92,340",
        commodityImpact: "Very High",
        inventoryLevel: "Low",
      },
      {
        product: "Aluminum Products",
        category: "Metals",
        salesVolume: "5,780",
        revenue: "₹7,45,620",
        commodityImpact: "High",
        inventoryLevel: "Low",
      },
    ]

    // Generate dummy sales vs commodity data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const dummySalesVsCommodity = months.map((month) => ({
      month,
      sales: Math.floor(Math.random() * 10000) + 5000,
      price: Math.floor(Math.random() * 2000) + 4000, // Indian rupee prices
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

  // Get unique categories for filtering
  const categories = ["All", ...Array.from(new Set(salesData.map(item => item.category)))]

  // Filter sales data based on search term and category
  const filteredSalesData = salesData.filter((item) => 
    item.product.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (categoryFilter === "All" || item.category === categoryFilter)
  )

  // Download data as CSV
  const downloadCSV = () => {
    // Create CSV content
    const headers = ["Product", "Category", "Sales Volume", "Revenue", "Commodity Impact", "Inventory Level"];
    const csvContent = [
      headers.join(","),
      ...filteredSalesData.map(item => 
        [
          item.product,
          item.category,
          item.salesVolume,
          item.revenue,
          item.commodityImpact,
          item.inventoryLevel
        ].join(",")
      )
    ].join("\n");

    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sales_analysis_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 bg-black text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">Indian Sales Analysis</h1>
        <Button variant="outline" size="icon" onClick={downloadCSV} className="text-yellow-400 bg-black border-yellow-400 hover:bg-yellow-400/10">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
          <Button 
            type="submit" 
            onClick={handleSearch} 
            disabled={loading}
            className="bg-yellow-400 text-black hover:bg-yellow-500"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Filter by Category:</span>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-1"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Product Sales Data</CardTitle>
          <CardDescription className="text-gray-400">Sales performance and commodity impact</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead className="text-gray-300">Product</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300">Sales Volume</TableHead>
                <TableHead className="text-gray-300">Revenue</TableHead>
                <TableHead className="text-gray-300">Commodity Impact</TableHead>
                <TableHead className="text-gray-300">Inventory Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalesData.map((item) => (
                <TableRow key={item.product} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="font-medium text-white">{item.product}</TableCell>
                  <TableCell className="text-gray-300">{item.category}</TableCell>
                  <TableCell className="text-white">{item.salesVolume}</TableCell>
                  <TableCell className="text-white">{item.revenue}</TableCell>
                  <TableCell>
                    <span
                      className={
                        item.commodityImpact === "Very High"
                          ? "text-red-400"
                          : item.commodityImpact === "High"
                            ? "text-orange-400"
                            : item.commodityImpact === "Medium"
                              ? "text-yellow-400"
                              : "text-green-400"
                      }
                    >
                      {item.commodityImpact}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        item.inventoryLevel === "Low"
                          ? "text-red-400"
                          : item.inventoryLevel === "Medium"
                            ? "text-yellow-400"
                            : item.inventoryLevel === "High"
                              ? "text-green-400"
                              : "text-gray-400"
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
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Sales Volume vs Commodity Price</CardTitle>
            <CardDescription className="text-gray-400">Relationship between sales and commodity prices</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesVsCommodity} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" tick={{ fill: "#ccc" }} />
                <YAxis yAxisId="left" orientation="left" stroke="#FFD700" tick={{ fill: "#ccc" }} />
                <YAxis yAxisId="right" orientation="right" stroke="#FFFFFF" tick={{ fill: "#ccc" }} />
                <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                <Legend wrapperStyle={{ color: "#ccc" }} />
                <Bar yAxisId="left" dataKey="sales" fill="#FFD700" name="Sales Volume" />
                <Line yAxisId="right" type="monotone" dataKey="price" stroke="#FFFFFF" name="Commodity Price (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Inventory Level and Optimal Restocking</CardTitle>
            <CardDescription className="text-gray-400">Inventory trends and reorder points</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inventoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="day" 
                  label={{ value: "Day of Month", position: "insideBottomRight", offset: -10, fill: "#ccc" }} 
                  tick={{ fill: "#ccc" }}
                />
                <YAxis 
                  label={{ value: "Inventory Level", angle: -90, position: "insideLeft", fill: "#ccc" }} 
                  tick={{ fill: "#ccc" }}
                />
                <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                <Legend wrapperStyle={{ color: "#ccc" }} />
                <ReferenceLine y={20} stroke="red" strokeDasharray="3 3" label={{ value: "Reorder Point", fill: "#ccc" }} />
                {optimalRestockDay && (
                  <ReferenceLine
                    x={optimalRestockDay}
                    stroke="#FFD700"
                    strokeDasharray="3 3"
                    label={{ value: `Optimal Restock (Day ${optimalRestockDay})`, position: "top", fill: "#ccc" }}
                  />
                )}
                <Line type="monotone" dataKey="level" stroke="#FFD700" name="Inventory Level" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SalesAnalysis
