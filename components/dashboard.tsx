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
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <h1 className="text-xl font-bold text-yellow-400">Forecast X</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</span>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Tabs defaultValue="commodity" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-gray-900">
            <TabsTrigger value="commodity" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Commodity Exchange
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Sales Analysis
            </TabsTrigger>
            <TabsTrigger
              value="prediction"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
            >
              Price Prediction
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Inventory Optimization
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Market Trends
            </TabsTrigger>
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

