"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, CheckCircle, TrendingDown } from "lucide-react"
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

  // Mock products data
  const products: Product[] = [
    {
      id: "1",
      name: "Product 1",
      category: "Raw Materials",
      currentStock: 250,
      reorderPoint: 50,
      leadTime: 5,
      dailyUsage: 10,
      costPerUnit: 25,
    },
    {
      id: "2",
      name: "Product 2",
      category: "Packaging",
      currentStock: 180,
      reorderPoint: 40,
      leadTime: 3,
      dailyUsage: 15,
      costPerUnit: 12,
    },
    {
      id: "3",
      name: "Product 3",
      category: "Finished Goods",
      currentStock: 320,
      reorderPoint: 80,
      leadTime: 7,
      dailyUsage: 8,
      costPerUnit: 45,
    },
    {
      id: "4",
      name: "Product 4",
      category: "Raw Materials",
      currentStock: 120,
      reorderPoint: 60,
      leadTime: 4,
      dailyUsage: 12,
      costPerUnit: 18,
    },
    {
      id: "5",
      name: "Product 5",
      category: "Spare Parts",
      currentStock: 75,
      reorderPoint: 30,
      leadTime: 10,
      dailyUsage: 5,
      costPerUnit: 65,
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Inventory Health</CardTitle>
            <CardDescription>Overall inventory status</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Healthy Items</span>
                  <Badge variant="outline" className="bg-green-100">
                    {products.filter((p) => p.currentStock > p.reorderPoint * 1.5).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Warning Items</span>
                  <Badge variant="outline" className="bg-yellow-100">
                    {
                      products.filter((p) => p.currentStock <= p.reorderPoint * 1.5 && p.currentStock > p.reorderPoint)
                        .length
                    }
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Critical Items</span>
                  <Badge variant="destructive">{products.filter((p) => p.currentStock <= p.reorderPoint).length}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Inventory Value</CardTitle>
            <CardDescription>Total value of current stock</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-3xl font-bold">
                ${products.reduce((sum, p) => sum + p.currentStock * p.costPerUnit, 0).toLocaleString()}
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-1">Across {products.length} products</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reorder Alerts</CardTitle>
            <CardDescription>Items that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Immediate Reorder</span>
                  <Badge variant="destructive">{products.filter((p) => p.currentStock <= p.reorderPoint).length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Reorder This Week</span>
                  <Badge variant="default">
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inventory Forecast</CardTitle>
            <CardDescription>30-day projection of inventory levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={selectedProduct} onValueChange={handleProductSelect}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
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
                    <Skeleton className="h-[300px] w-full" />
                  ) : (
                    <div className="text-center space-y-2">
                      <p className="text-muted-foreground">Select a product to view inventory forecast</p>
                    </div>
                  )}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inventoryForecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" label={{ value: "Day", position: "insideBottomRight", offset: -10 }} />
                    <YAxis label={{ value: "Units", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="stock" stroke="#8884d8" name="Stock Level" />
                    <Line type="monotone" dataKey="demand" stroke="#82ca9d" name="Daily Demand" />
                    {selectedProduct && (
                      <ReferenceLine
                        y={products.find((p) => p.id === selectedProduct)?.reorderPoint}
                        stroke="red"
                        strokeDasharray="3 3"
                        label="Reorder Point"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimization Parameters</CardTitle>
            <CardDescription>Adjust inventory planning factors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="demand-variability" className="text-sm font-medium">
                  Demand Variability
                </label>
                <span className="text-sm text-muted-foreground">{demandVariability}%</span>
              </div>
              <Slider
                id="demand-variability"
                min={0}
                max={50}
                step={1}
                value={[demandVariability]}
                onValueChange={(value) => setDemandVariability(value[0])}
              />
              <p className="text-xs text-muted-foreground">Higher variability requires larger safety stock</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="service-level" className="text-sm font-medium">
                  Service Level
                </label>
                <span className="text-sm text-muted-foreground">{serviceLevel}%</span>
              </div>
              <Slider
                id="service-level"
                min={80}
                max={99}
                step={1}
                value={[serviceLevel]}
                onValueChange={(value) => setServiceLevel(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Higher service level reduces stockout risk but increases holding costs
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="lead-time-variability" className="text-sm font-medium">
                  Lead Time Variability
                </label>
                <span className="text-sm text-muted-foreground">{leadTimeVariability}%</span>
              </div>
              <Slider
                id="lead-time-variability"
                min={0}
                max={50}
                step={1}
                value={[leadTimeVariability]}
                onValueChange={(value) => setLeadTimeVariability(value[0])}
              />
              <p className="text-xs text-muted-foreground">Higher lead time uncertainty requires earlier reordering</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Optimal Order Recommendations</CardTitle>
          <CardDescription>Calculated based on current parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
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

          <div className="rounded-md border">
            <div className="grid grid-cols-7 border-b px-4 py-2 font-medium">
              <div>Product</div>
              <div>Category</div>
              <div>Current Stock</div>
              <div>Reorder Point</div>
              <div>Optimal Order Qty</div>
              <div>Days Until Reorder</div>
              <div>Status</div>
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
                        className={`grid grid-cols-7 px-4 py-3 cursor-pointer hover:bg-muted/50 ${selectedProduct === product.id ? "bg-muted" : ""}`}
                        onClick={() => handleProductSelect(product.id)}
                      >
                        <div className="font-medium">{product.name}</div>
                        <div>{product.category}</div>
                        <div>{product.currentStock}</div>
                        <div>{product.reorderPoint}</div>
                        <div>{eoq}</div>
                        <div>{daysUntilReorder}</div>
                        <div>
                          {status === "critical" ? (
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                              <AlertTriangle className="h-3 w-3" />
                              Reorder Now
                            </Badge>
                          ) : status === "warning" ? (
                            <Badge variant="default" className="flex items-center gap-1 w-fit">
                              <TrendingDown className="h-3 w-3" />
                              Reorder Soon
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1 w-fit bg-green-100">
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

