"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CommodityExchange from "@/components/tabs/commodity-exchange"
import SalesAnalysis from "@/components/tabs/sales-analysis"
import PricePrediction from "@/components/tabs/price-prediction"
import InventoryOptimization from "@/components/tabs/inventory-optimization"
import MarketTrends from "@/components/tabs/market-trends"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("commodity")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <h1 className="text-xl font-bold">Commodity Forecast Dashboard</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</span>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Tabs defaultValue="commodity" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="commodity">Commodity Exchange</TabsTrigger>
            <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
            <TabsTrigger value="prediction">Price Prediction</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Optimization</TabsTrigger>
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="commodity" className="space-y-4">
            <CommodityExchange />
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <SalesAnalysis />
          </TabsContent>

          <TabsContent value="prediction" className="space-y-4">
            <PricePrediction />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <InventoryOptimization />
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <MarketTrends />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

