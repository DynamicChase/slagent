"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Download, ArrowUpDown } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "@/components/ui/chart"

// Types
interface SalesData {
  id: string
  product: string
  category: string
  salesVolume: number
  revenue: number
  commodityImpact: "Low" | "Medium" | "High" | "Very High"
  inventoryLevel: "Low" | "Medium" | "High" | "N/A"
  trend: "up" | "down" | "stable"
}

export default function SalesAnalysis() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTimeframe, setSelectedTimeframe] = useState("6m")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Simulate loading data
  useState(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  })

  // Mock data for sales
  const salesData: SalesData[] = [
    {
      id: "1",
      product: "Plastic Containers",
      category: "Packaging",
      salesVolume: 12450,
      revenue: 45230,
      commodityImpact: "High",
      inventoryLevel: "Low",
      trend: "up",
    },
    {
      id: "2",
      product: "Packaging Materials",
      category: "Packaging",
      salesVolume: 8320,
      revenue: 28750,
      commodityImpact: "Medium",
      inventoryLevel: "Medium",
      trend: "stable",
    },
    {
      id: "3",
      product: "Fuel Products",
      category: "Energy",
      salesVolume: 15780,
      revenue: 89450,
      commodityImpact: "Very High",
      inventoryLevel: "High",
      trend: "up",
    },
    {
      id: "4",
      product: "Chemical Solutions",
      category: "Chemicals",
      salesVolume: 5230,
      revenue: 32780,
      commodityImpact: "Medium",
      inventoryLevel: "Low",
      trend: "down",
    },
    {
      id: "5",
      product: "Transport Services",
      category: "Services",
      salesVolume: 3450,
      revenue: 67890,
      commodityImpact: "High",
      inventoryLevel: "N/A",
      trend: "up",
    },
  ]

  // Filter products based on search and category
  const filteredData = salesData.filter(
    (item) =>
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "all" || item.category === selectedCategory),
  )

  // Get unique categories for filter
  const categories = Array.from(new Set(salesData.map((item) => item.category)))

  // Mock data for charts
  const salesVsCommodity = [
    { month: "Jan", sales: 8500, price: 65 },
    { month: "Feb", sales: 9200, price: 68 },
    { month: "Mar", sales: 7800, price: 72 },
    { month: "Apr", sales: 8900, price: 70 },
    { month: "May", sales: 9800, price: 75 },
    { month: "Jun", sales: 10200, price: 78 },
  ]

  // Category sales data for pie chart
  const categorySales = [
    { name: "Packaging", value: 73980 },
    { name: "Energy", value: 89450 },
    { name: "Chemicals", value: 32780 },
    { name: "Services", value: 67890 },
  ]

  // COLORS for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const exportData = () => {
    // In a real app, this would export data to CSV
    console.log("Exporting data...")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full md:w-[300px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="12m">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={exportData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Overall sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-3xl font-bold">
                ${salesData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-1">+12.5% from previous period</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Sales Volume</CardTitle>
            <CardDescription>Number of units sold</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-3xl font-bold">
                {salesData.reduce((sum, item) => sum + item.salesVolume, 0).toLocaleString()}
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-1">+8.2% from previous period</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Commodity Impact</CardTitle>
            <CardDescription>Products affected by commodity prices</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-red-100">
                  High Impact:{" "}
                  {
                    salesData.filter((item) => item.commodityImpact === "High" || item.commodityImpact === "Very High")
                      .length
                  }
                </Badge>
                <Badge variant="outline" className="bg-yellow-100">
                  Medium Impact: {salesData.filter((item) => item.commodityImpact === "Medium").length}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sales vs Commodity Price</CardTitle>
            <CardDescription>Relationship between sales and commodity prices</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesVsCommodity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sales" fill="#8884d8" name="Sales Volume" />
                  <Bar yAxisId="right" dataKey="price" fill="#82ca9d" name="Commodity Price ($)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySales}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Sales Data</CardTitle>
          <CardDescription>Detailed sales performance and commodity impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-7 border-b px-4 py-2 font-medium">
              <div className="flex items-center gap-1 cursor-pointer">
                Product <ArrowUpDown className="h-3 w-3" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                Category <ArrowUpDown className="h-3 w-3" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                Sales Volume <ArrowUpDown className="h-3 w-3" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                Revenue <ArrowUpDown className="h-3 w-3" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                Commodity Impact <ArrowUpDown className="h-3 w-3" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                Inventory Level <ArrowUpDown className="h-3 w-3" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                Trend <ArrowUpDown className="h-3 w-3" />
              </div>
            </div>
            <div className="divide-y">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-7 px-4 py-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))
                : filteredData.map((item) => (
                    <div key={item.id} className="grid grid-cols-7 px-4 py-3">
                      <div className="font-medium">{item.product}</div>
                      <div>{item.category}</div>
                      <div>{item.salesVolume.toLocaleString()}</div>
                      <div>${item.revenue.toLocaleString()}</div>
                      <div>
                        <Badge
                          variant={
                            item.commodityImpact === "Very High"
                              ? "destructive"
                              : item.commodityImpact === "High"
                                ? "destructive"
                                : item.commodityImpact === "Medium"
                                  ? "default"
                                  : "outline"
                          }
                        >
                          {item.commodityImpact}
                        </Badge>
                      </div>
                      <div>
                        <Badge
                          variant={
                            item.inventoryLevel === "Low"
                              ? "destructive"
                              : item.inventoryLevel === "Medium"
                                ? "default"
                                : item.inventoryLevel === "High"
                                  ? "outline"
                                  : "secondary"
                          }
                        >
                          {item.inventoryLevel}
                        </Badge>
                      </div>
                      <div>
                        <Badge
                          variant={item.trend === "up" ? "default" : item.trend === "down" ? "destructive" : "outline"}
                        >
                          {item.trend === "up" ? "↑ Up" : item.trend === "down" ? "↓ Down" : "→ Stable"}
                        </Badge>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

