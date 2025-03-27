"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, CheckCircle, TrendingDown, Download } from "lucide-react"
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
  ReferenceLine,
} from "@/components/ui/chart"

// Types
interface Product {
  id: string
  name: string
  category: string
  currentStock: number
  reorderPoint: number
  leadTime: number
  dailyUsage: number
  costPerUnit: number
}

export default function InventoryOptimization() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [demandVariability, setDemandVariability] = useState<number>(10)
  const [serviceLevel, setServiceLevel] = useState<number>(95)
  const [leadTimeVariability, setLeadTimeVariability] = useState<number>(20)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [inventoryForecast, setInventoryForecast] = useState<any[]>([])

  // Simulate loading data
  useState(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  })

  // Mock products data with Indian products and prices
  const products: Product[] = [
    {
      id: "1",
      name: "Basmati Rice",
      category: "Food Grains",
      currentStock: 250,
      reorderPoint: 50,
      leadTime: 5,
      dailyUsage: 10,
      costPerUnit: 85,
    },
    {
      id: "2",
      name: "Wheat Flour",
      category: "Food Grains",
      currentStock: 180,
      reorderPoint: 40,
      leadTime: 3,
      dailyUsage: 15,
      costPerUnit: 45,
    },
    {
      id: "3",
      name: "Refined Oil",
      category: "Cooking Oils",
      currentStock: 320,
      reorderPoint: 80,
      leadTime: 7,
      dailyUsage: 8,
      costPerUnit: 120,
    },
    {
      id: "4",
      name: "Mustard Oil",
      category: "Cooking Oils",
      currentStock: 120,
      reorderPoint: 60,
      leadTime: 4,
      dailyUsage: 12,
      costPerUnit: 150,
    },
    {
      id: "5",
      name: "Toor Dal",
      category: "Pulses",
      currentStock: 75,
      reorderPoint: 30,
      leadTime: 10,
      dailyUsage: 5,
      costPerUnit: 110,
    },
    {
      id: "6",
      name: "Moong Dal",
      category: "Pulses",
      currentStock: 95,
      reorderPoint: 35,
      leadTime: 8,
      dailyUsage: 6,
      costPerUnit: 125,
    },
    {
      id: "7",
      name: "Sugar",
      category: "Sweeteners",
      currentStock: 200,
      reorderPoint: 45,
      leadTime: 6,
      dailyUsage: 9,
      costPerUnit: 40,
    },
    {
      id: "8",
      name: "Jaggery",
      category: "Sweeteners",
      currentStock: 150,
      reorderPoint: 40,
      leadTime: 7,
      dailyUsage: 7,
      costPerUnit: 60,
    },
    {
      id: "9",
      name: "Tea Leaves",
      category: "Beverages",
      currentStock: 180,
      reorderPoint: 50,
      leadTime: 9,
      dailyUsage: 8,
      costPerUnit: 250,
    },
    {
      id: "10",
      name: "Coffee Beans",
      category: "Beverages",
      currentStock: 120,
      reorderPoint: 40,
      leadTime: 12,
      dailyUsage: 5,
      costPerUnit: 350,
    },
    {
      id: "11",
      name: "Turmeric Powder",
      category: "Spices",
      currentStock: 90,
      reorderPoint: 25,
      leadTime: 8,
      dailyUsage: 4,
      costPerUnit: 180,
    },
    {
      id: "12",
      name: "Red Chilli Powder",
      category: "Spices",
      currentStock: 85,
      reorderPoint: 30,
      leadTime: 7,
      dailyUsage: 5,
      costPerUnit: 200,
    },
  ]

  // Generate inventory forecast when product is selected
  const generateInventoryForecast = () => {
    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return []

    const forecast = []
    let currentStock = product.currentStock

    // Generate 30-day forecast
    for (let day = 1; day <= 30; day++) {
      // Daily demand with variability
      const variabilityFactor = 1 + (Math.random() * 2 - 1) * (demandVariability / 100)
      const dailyDemand = Math.max(0, Math.round(product.dailyUsage * variabilityFactor))

      // Update stock
      currentStock = Math.max(0, currentStock - dailyDemand)

      forecast.push({
        day,
        stock: currentStock,
        demand: dailyDemand,
      })

      // Simulate reorder arrival if stock falls below reorder point
      if (currentStock <= product.reorderPoint && day + product.leadTime <= 30) {
        // Calculate EOQ (Economic Order Quantity)
        const annualDemand = product.dailyUsage * 365
        const orderCost = 50 // Fixed cost per order (assumed)
        const holdingCost = product.costPerUnit * 0.2 // Assuming 20% holding cost
        const eoq = Math.round(Math.sqrt((2 * annualDemand * orderCost) / holdingCost))

        // Add the order to inventory after lead time
        forecast[day + product.leadTime - 1].stock += eoq
      }
    }

    return forecast
  }

  // Handle product selection
  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId)
    setInventoryForecast(generateInventoryForecast())
  }

  // Filter products based on search and category
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "all" || product.category === selectedCategory),
  )

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map((item) => item.category)))

  // Download data as CSV
  const downloadCSV = () => {
    // Create CSV content
    const headers = [
      "Product",
      "Category",
      "Current Stock",
      "Reorder Point",
      "Lead Time",
      "Daily Usage",
      "Cost Per Unit",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredProducts.map((item) =>
        [
          item.name,
          item.category,
          item.currentStock,
          item.reorderPoint,
          item.leadTime,
          item.dailyUsage,
          item.costPerUnit,
        ].join(","),
      ),
    ].join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "inventory_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4 bg-black text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">Inventory Optimization</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={downloadCSV}
          className="text-yellow-400 bg-black border-yellow-400 hover:bg-yellow-400/10"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Inventory Health</CardTitle>
            <CardDescription className="text-gray-400">Overall inventory status</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2 bg-gray-800" />
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">Healthy Items</span>
                  <Badge variant="outline" className="bg-green-900 text-green-300 border-green-700">
                    {products.filter((p) => p.currentStock > p.reorderPoint * 1.5).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">Warning Items</span>
                  <Badge variant="outline" className="bg-yellow-900 text-yellow-300 border-yellow-700">
                    {
                      products.filter((p) => p.currentStock <= p.reorderPoint * 1.5 && p.currentStock > p.reorderPoint)
                        .length
                    }
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">Critical Items</span>
                  <Badge variant="destructive">{products.filter((p) => p.currentStock <= p.reorderPoint).length}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Inventory Value</CardTitle>
            <CardDescription className="text-gray-400">Total value of current stock</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2 bg-gray-800" />
            ) : (
              <div className="text-3xl font-bold text-yellow-400">
                ₹{products.reduce((sum, p) => sum + p.currentStock * p.costPerUnit, 0).toLocaleString()}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1">Across {products.length} products</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Reorder Alerts</CardTitle>
            <CardDescription className="text-gray-400">Items that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2 bg-gray-800" />
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">Immediate Reorder</span>
                  <Badge variant="destructive">{products.filter((p) => p.currentStock <= p.reorderPoint).length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">Reorder This Week</span>
                  <Badge variant="default" className="bg-yellow-400 text-black">
                    {
                      products.filter(
                        (p) => p.currentStock > p.reorderPoint && p.currentStock <= p.reorderPoint + p.dailyUsage * 7,
                      ).length
                    }
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Inventory Forecast</CardTitle>
            <CardDescription className="text-gray-400">30-day projection of inventory levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={selectedProduct} onValueChange={handleProductSelect}>
                <SelectTrigger className="w-full md:w-[300px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Stock: {product.currentStock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="h-[300px]">
              {loading || inventoryForecast.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  {loading ? (
                    <Skeleton className="h-[300px] w-full bg-gray-800" />
                  ) : (
                    <div className="text-center space-y-2">
                      <p className="text-gray-400">Select a product to view inventory forecast</p>
                    </div>
                  )}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inventoryForecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="day"
                      label={{ value: "Day", position: "insideBottomRight", offset: -10, fill: "#ccc" }}
                      tick={{ fill: "#ccc" }}
                    />
                    <YAxis
                      label={{ value: "Units", angle: -90, position: "insideLeft", fill: "#ccc" }}
                      tick={{ fill: "#ccc" }}
                    />
                    <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444", color: "#fff" }} />
                    <Legend />
                    <Line type="monotone" dataKey="stock" stroke="#FFD700" name="Stock Level" />
                    <Line type="monotone" dataKey="demand" stroke="#fff" name="Daily Demand" />
                    {selectedProduct && (
                      <ReferenceLine
                        y={products.find((p) => p.id === selectedProduct)?.reorderPoint}
                        stroke="red"
                        strokeDasharray="3 3"
                        label={{ value: "Reorder Point", fill: "#ccc" }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Optimization Parameters</CardTitle>
            <CardDescription className="text-gray-400">Adjust inventory planning factors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="demand-variability" className="text-sm font-medium text-white">
                  Demand Variability
                </label>
                <span className="text-sm text-yellow-400">{demandVariability}%</span>
              </div>
              <Slider
                id="demand-variability"
                min={0}
                max={50}
                step={1}
                value={[demandVariability]}
                onValueChange={(value) => setDemandVariability(value[0])}
                className="[&>span]:bg-yellow-400"
              />
              <p className="text-xs text-gray-400">Higher variability requires larger safety stock</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="service-level" className="text-sm font-medium text-white">
                  Service Level
                </label>
                <span className="text-sm text-yellow-400">{serviceLevel}%</span>
              </div>
              <Slider
                id="service-level"
                min={80}
                max={99}
                step={1}
                value={[serviceLevel]}
                onValueChange={(value) => setServiceLevel(value[0])}
                className="[&>span]:bg-yellow-400"
              />
              <p className="text-xs text-gray-400">
                Higher service level reduces stockout risk but increases holding costs
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="lead-time-variability" className="text-sm font-medium text-white">
                  Lead Time Variability
                </label>
                <span className="text-sm text-yellow-400">{leadTimeVariability}%</span>
              </div>
              <Slider
                id="lead-time-variability"
                min={0}
                max={50}
                step={1}
                value={[leadTimeVariability]}
                onValueChange={(value) => setLeadTimeVariability(value[0])}
                className="[&>span]:bg-yellow-400"
              />
              <p className="text-xs text-gray-400">Higher lead time uncertainty requires earlier reordering</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Optimal Order Recommendations</CardTitle>
          <CardDescription className="text-gray-400">Calculated based on current parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full md:w-[300px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-gray-800">
            <div className="grid grid-cols-7 border-b border-gray-800 px-4 py-2 font-medium text-gray-300">
              <div>Product</div>
              <div>Category</div>
              <div>Current Stock</div>
              <div>Reorder Point</div>
              <div>Optimal Order Qty</div>
              <div>Days Until Reorder</div>
              <div>Status</div>
            </div>
            <div className="divide-y divide-gray-800">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-7 px-4 py-3">
                      <Skeleton className="h-4 w-3/4 bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800" />
                    </div>
                  ))
                : filteredProducts.map((product) => {
                    // Calculate EOQ
                    const annualDemand = product.dailyUsage * 365
                    const orderCost = 50 // Fixed cost per order (assumed)
                    const holdingCost = product.costPerUnit * 0.2 // Assuming 20% holding cost
                    const eoq = Math.round(Math.sqrt((2 * annualDemand * orderCost) / holdingCost))

                    // Calculate days until reorder
                    const daysUntilReorder =
                      product.currentStock > product.reorderPoint
                        ? Math.floor((product.currentStock - product.reorderPoint) / product.dailyUsage)
                        : 0

                    // Determine status
                    const status =
                      product.currentStock <= product.reorderPoint
                        ? "critical"
                        : product.currentStock <= product.reorderPoint * 1.5
                          ? "warning"
                          : "healthy"

                    return (
                      <div
                        key={product.id}
                        className={`grid grid-cols-7 px-4 py-3 cursor-pointer hover:bg-gray-800/50 ${selectedProduct === product.id ? "bg-gray-800" : ""}`}
                        onClick={() => handleProductSelect(product.id)}
                      >
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-gray-300">{product.category}</div>
                        <div className="text-white">{product.currentStock}</div>
                        <div className="text-white">{product.reorderPoint}</div>
                        <div className="text-white">{eoq}</div>
                        <div className="text-white">{daysUntilReorder}</div>
                        <div>
                          {status === "critical" ? (
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                              <AlertTriangle className="h-3 w-3" />
                              Reorder Now
                            </Badge>
                          ) : status === "warning" ? (
                            <Badge variant="default" className="flex items-center gap-1 w-fit bg-yellow-400 text-black">
                              <TrendingDown className="h-3 w-3" />
                              Reorder Soon
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 w-fit bg-green-900 text-green-300 border-green-700"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Healthy
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

