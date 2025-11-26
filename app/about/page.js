'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, CheckCircle, Users } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const testimonials = [
    {
      name: "Raj Kumar",
      designation: "Daily Commuter, Mumbai",
      rating: 5,
      review: "Game changer! My helmet smells fresh even after 8-hour delivery shifts.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      verified: true
    },
    {
      name: "Priya Sharma",
      designation: "IT Professional, Bangalore",
      rating: 5,
      review: "Finally, no more embarrassing helmet odor. The cooling effect is amazing!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8af?w=50&h=50&fit=crop&crop=face",
      verified: true
    },
    {
      name: "Amit Patel",
      designation: "Food Delivery Partner",
      rating: 5,
      review: "Worth every rupee. My scalp itching completely stopped.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      verified: true
    }
  ]

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Hygena</h1>
          <p className="text-xl opacity-90">India's First Helmet Deodorant</p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-6">
              Hygena was born from a simple observation - millions of riders in India face the same embarrassing problem: helmet odor. As passionate riders ourselves, we understood the frustration of dealing with smelly helmets and the scalp issues that come with them.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              We spent two years researching and developing a formula that doesn't just mask odors but actually prevents bacterial growth at its source. Using the ancient wisdom of Ayurvedic ingredients combined with modern bacteriostatic technology, we created India's first helmet deodorant.
            </p>
            <p className="text-lg text-gray-600">
              Today, over 10,000 riders trust Hygena to keep their helmets fresh and their rides comfortable. We're proud to be part of India's riding community.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#D2691E] mb-2">10,000+</div>
              <div className="text-gray-600 text-lg">Happy Riders</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#D2691E] mb-2">4.8★</div>
              <div className="text-gray-600 text-lg">Average Rating</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#D2691E] mb-2">97%</div>
              <div className="text-gray-600 text-lg">Would Recommend</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-4">
              What Riders Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardHeader className="flex flex-row items-center gap-4 p-0 pb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.designation}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.review}"</p>
                  {testimonial.verified && (
                    <Badge className="mt-3 bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Purchase
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-4">
              Our Values
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality First</h3>
              <p className="text-gray-600">Every batch is tested for safety and efficacy before shipping</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">Built by riders, for riders. Your feedback shapes our products</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Made in India</h3>
              <p className="text-gray-600">Proudly formulated and manufactured in India</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Join the Hygena Family</h2>
          <p className="text-xl mb-8 opacity-90">Experience fresh rides like 10,000+ riders</p>
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
