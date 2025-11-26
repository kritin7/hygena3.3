'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Leaf } from 'lucide-react'
import Link from 'next/link'

export default function SciencePage() {
  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">The Science</h1>
          <p className="text-xl opacity-90">Science meets nature in every spray</p>
        </div>
      </div>

      {/* Ingredients */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-4">
              Key Ingredients
            </h2>
            <p className="text-xl text-gray-600">Every ingredient has a purpose</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg font-semibold">Neem Extract</CardTitle>
                <CardDescription className="text-[#D2691E] font-medium">Natural Antibacterial</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Prevents microbial growth naturally</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold">Tea Tree</CardTitle>
                <CardDescription className="text-[#D2691E] font-medium">Anti-Dandruff</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Controls scalp irritation and flakes</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-lg font-semibold">Aloe Vera</CardTitle>
                <CardDescription className="text-[#D2691E] font-medium">Cooling & Soothing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Calms skin and reduces inflammation</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-yellow-600" />
                </div>
                <CardTitle className="text-lg font-semibold">Chamomile</CardTitle>
                <CardDescription className="text-[#D2691E] font-medium">Sensitive Skin Safe</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Gentle protection for all scalp types</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="border-green-500 text-green-700 px-4 py-2">
              No Harsh Chemicals
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-700 px-4 py-2">
              pH Balanced
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-700 px-4 py-2">
              Alcohol-Free Base
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-700 px-4 py-2">
              No Artificial Colors
            </Badge>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-4">
              3 Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D2691E] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Spray</h3>
              <p className="text-gray-600 mb-2">6-8 sprays inside helmet padding</p>
              <Badge variant="outline" className="text-[#D2691E] border-[#D2691E]">5 seconds</Badge>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#D2691E] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Wait</h3>
              <p className="text-gray-600 mb-2">Let it settle and dry</p>
              <Badge variant="outline" className="text-[#D2691E] border-[#D2691E]">30 seconds</Badge>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#D2691E] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Wear</h3>
              <p className="text-gray-600 mb-2">Enjoy fresh, clean rides</p>
              <Badge variant="outline" className="text-[#D2691E] border-[#D2691E]">All day protection</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Experience the Science</h2>
          <p className="text-xl mb-8 opacity-90">Try Hygena risk-free with our 30-day guarantee</p>
          <Link href="/shop">
            <Button className="bg-white text-[#D2691E] hover:bg-gray-100 text-lg px-8 py-3">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
