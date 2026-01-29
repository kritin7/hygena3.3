'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Calendar, Leaf, Clock, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function WhyHygenaPage() {
  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Why Hygena?</h1>
          <p className="text-xl opacity-90">The hidden problem in your helmet - and how we solve it</p>
        </div>
      </div>

      {/* Problem Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-4">
              The Hidden Problem in Your Helmet
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                </div>
                <CardTitle className="text-xl font-semibold">Bacteria Buildup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Sweat + Heat + Darkness = Perfect breeding ground for bacteria</p>
                <Badge className="bg-red-500 text-white">10x more bacteria than a toilet seat</Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
                </div>
                <CardTitle className="text-xl font-semibold">Persistent Odor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Regular deodorants just mask the smell temporarily</p>
                <Badge className="bg-yellow-500 text-white">87% riders report helmet odor issues</Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                </div>
                <CardTitle className="text-xl font-semibold">Scalp Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Itching, dandruff, and hair fall from bacterial growth</p>
                <Badge className="bg-orange-500 text-white">3 in 5 riders face scalp issues</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800 mb-4">
              Traditional sprays mask the problem. Hygena solves it.
            </p>
            <ChevronDown className="w-8 h-8 text-[#D2691E] mx-auto animate-bounce" />
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-4">
              Bacteriostatic Technology That Works
            </h2>
            <p className="text-xl text-gray-600">Not just fragrance - real helmet hygiene</p>
          </div>

          <div className="space-y-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <Shield className="w-8 h-8 text-[#D2691E] mr-3" />
                  <h3 className="text-2xl font-semibold">Pauses Bacterial Growth</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Our bacteriostatic formula prevents bacteria from multiplying without harsh chemicals
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-8 rounded-2xl flex items-center justify-center">
                <Shield className="w-24 h-24 text-green-600" />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <div className="flex items-center mb-4">
                  <Calendar className="w-8 h-8 text-[#D2691E] mr-3" />
                  <h3 className="text-2xl font-semibold">24-Hour Protection</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  One application keeps your helmet fresh for up to 24 hours of use
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-100 to-red-100 p-8 rounded-2xl flex items-center justify-center lg:order-1">
                <Calendar className="w-24 h-24 text-orange-600" />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <Leaf className="w-8 h-8 text-[#D2691E] mr-3" />
                  <h3 className="text-2xl font-semibold">Scalp-Safe Formula</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Plant-based extracts like Neem, Aloe, and Tea Tree protect your scalp
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-8 rounded-2xl flex items-center justify-center">
                <Leaf className="w-24 h-24 text-green-600" />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <div className="flex items-center mb-4">
                  <Clock className="w-8 h-8 text-[#D2691E] mr-3" />
                  <h3 className="text-2xl font-semibold">Instant Application</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Spray, wait 30 seconds, wear. That simple.
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-2xl flex items-center justify-center lg:order-1">
                <Clock className="w-24 h-24 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready for Fresh Rides?</h2>
          <p className="text-xl mb-8 opacity-90">Experience the Hygena difference today</p>
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
