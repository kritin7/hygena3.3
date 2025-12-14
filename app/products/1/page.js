'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Star, 
  Minus, 
  Plus, 
  Heart, 
  Truck, 
  ShieldCheck, 
  Leaf, 
  Info, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// --- PLACEHOLDER IMAGES ---
// Using high-quality Unsplash images to ensure the page looks "Prod Ready" immediately.
const IMAGES = {
  main: "https://images.unsplash.com/photo-1649176154020-c695980078e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxkZW9kb3JhbnQlMjBzcHJheXxlbnwwfHx8b3JhbmdlfDE3NTczMTY5NzR8MA&ixlib=rb-4.1.0&q=85",
  side: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000",
  lifestyle: "https://images.unsplash.com/photo-1558981806-ec527fa84c3d?auto=format&fit=crop&q=80&w=1000",
  user1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  user2: "https://images.unsplash.com/photo-1494790108755-2616b612b8af?w=100&h=100&fit=crop&crop=face"
}

// --- MOCK DATA ---
const PRODUCT = {
  id: 1,
  name: "Hygena Helmet Deodorant",
  subtitle: "Pollution & Odor Control | 100ml",
  price: 549,
  originalPrice: 799,
  rating: 4.8,
  reviewCount: 124,
  description: "Tired of helmet smell? Hygena is India's first bacteriostatic helmet spray. It doesn't just mask odor; it eliminates the bacteria causing it. Safe for your scalp and your helmet padding.",
  gallery: [
    IMAGES.main,
    IMAGES.side,
    IMAGES.lifestyle,
    IMAGES.main
  ]
}

const REVIEWS = [
  {
    id: 1,
    user: "Rohit Sharma",
    date: "Oct 12, 2024",
    rating: 5,
    verified: true,
    title: "Literally washes away the smell",
    content: "I saw Hygena on Instagram and wasn't sure, but to my surprise, it turned out really good. My helmet smells fresh even after a long ride in Mumbai traffic. Recommended.",
    image: null
  },
  {
    id: 2,
    user: "Priya Patel",
    date: "Sep 08, 2024",
    rating: 5,
    verified: true,
    title: "Scalp itching gone",
    content: "Very good product. I used to get an itchy scalp after wearing my helmet for delivery shifts. This completely stopped it.",
    image: null
  }
]

const FAQS = [
  { q: "How often should I use this spray?", a: "For best results, use it once daily. A quick spray before you ride or after you park keeps your helmet fresh 24/7." },
  { q: "Is this suitable for all helmets?", a: "Yes! Our formula is safe for all inner padding materials, including foam, fabric, and leather linings." },
  { q: "Does it help with dandruff?", a: "Yes, it contains Tea Tree and Neem extracts which are natural anti-dandruff agents that keep your scalp healthy." },
  { q: "Is it a gas or liquid spray?", a: "It is a liquid-based mist spray that settles deep into the foam for maximum protection, unlike gas sprays that evaporate quickly." }
]

export default function ProductPage({ params }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const router = useRouter()

  const addToCart = (buyNow = false) => {
    const savedCart = localStorage.getItem('hygena_cart')
    let cartItems = savedCart ? JSON.parse(savedCart) : []
    
    const existing = cartItems.find(item => item.id === PRODUCT.id)
    if (existing) {
      cartItems = cartItems.map(item => 
        item.id === PRODUCT.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      cartItems = [...cartItems, { ...PRODUCT, quantity: quantity, image: PRODUCT.gallery[0] }]
    }
    
    localStorage.setItem('hygena_cart', JSON.stringify(cartItems))
    window.dispatchEvent(new Event('cartUpdated'))
    
    if (buyNow) {
      router.push('/checkout')
    } else {
      // You can replace this with your existing toast component if preferred
      alert('Added to cart successfully!')
    }
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 1. TOP PROMO BAR */}
      <div className="bg-[#1A3C34] text-white text-center py-2.5 text-xs md:text-sm font-medium tracking-wide">
        Get 10% OFF on your first order • Use code <span className="font-bold text-[#FF8C00]">FRESH10</span>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="text-xs md:text-sm text-gray-500 mb-8 flex items-center gap-2">
          <span className="hover:text-black cursor-pointer" onClick={() => router.push('/')}>Home</span> 
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-black cursor-pointer" onClick={() => router.push('/shop')}>Shop</span> 
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium truncate">{PRODUCT.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* --- LEFT COLUMN: IMAGE GALLERY --- */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative group border border-gray-100">
              <img 
                src={PRODUCT.gallery[selectedImage]} 
                alt={PRODUCT.name} 
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <Badge className="absolute top-4 left-4 bg-[#D2691E] hover:bg-[#D2691E] border-none text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Best Seller
              </Badge>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {PRODUCT.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                    selectedImage === idx ? 'border-[#D2691E] ring-1 ring-[#D2691E] ring-offset-2' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT COLUMN: PRODUCT DETAILS --- */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-montserrat">
                {PRODUCT.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{PRODUCT.subtitle}</p>
              
              {/* Reviews Summary */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D2691E] text-[#D2691E]" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900 border-b border-black cursor-pointer">
                  {PRODUCT.reviewCount} Reviews
                </span>
              </div>

              {/* Functional Badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                <Badge variant="outline" className="text-[#1A3C34] border-[#1A3C34] bg-[#1A3C34]/5 py-1 px-3">
                  <ShieldCheck className="w-3 h-3 mr-1.5" /> BACTERIOSTATIC
                </Badge>
                <Badge variant="outline" className="text-[#1A3C34] border-[#1A3C34] bg-[#1A3C34]/5 py-1 px-3">
                  <Leaf className="w-3 h-3 mr-1.5" /> NATURAL ACTIVES
                </Badge>
                <Badge variant="outline" className="text-[#1A3C34] border-[#1A3C34] bg-[#1A3C34]/5 py-1 px-3">
                  <Info className="w-3 h-3 mr-1.5" /> SCALP SAFE
                </Badge>
              </div>

              {/* Price Block */}
              <div className="flex items-end gap-3 mb-8">
                <span className="text-4xl font-bold text-gray-900 font-montserrat">₹{PRODUCT.price}</span>
                <span className="text-xl text-gray-400 line-through mb-1">₹{PRODUCT.originalPrice}</span>
                <span className="text-white bg-red-500 font-bold text-xs px-2 py-1 rounded mb-2">
                  {Math.round(((PRODUCT.originalPrice - PRODUCT.price) / PRODUCT.originalPrice) * 100)}% OFF
                </span>
              </div>

              {/* Testimonial Snippet */}
              <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 italic text-gray-700 text-sm mb-8 relative">
                <span className="absolute top-4 left-4 text-4xl text-[#D2691E]/20 font-serif leading-3">"</span>
                <p className="relative z-10 pl-4">
                  I've tried every hack for smelly helmets but they all felt temporary. This one actually controls oil, keeps acne away, and works after long metro rides.
                </p>
                <div className="text-right font-bold text-[#D2691E] text-xs mt-2 uppercase tracking-wide">- Rahul, Verified Buyer</div>
              </div>

              {/* Add to Cart Actions */}
              <div className="space-y-4 pb-8 border-b border-gray-100">
                <div className="flex gap-4 h-12">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-lg w-32 justify-between px-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Cart Button */}
                  <Button 
                    onClick={() => addToCart(false)}
                    className="flex-1 bg-black text-white hover:bg-gray-800 h-full text-base font-medium rounded-lg"
                  >
                    Add to Cart
                  </Button>
                  
                  {/* Wishlist */}
                  <Button variant="outline" size="icon" className="h-full w-12 border-gray-300 rounded-lg hover:border-[#D2691E] hover:text-[#D2691E]">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>

                {/* Buy Now */}
                <Button 
                  onClick={() => addToCart(true)}
                  className="w-full bg-[#D2691E] text-white hover:bg-[#b85c1a] h-12 text-base font-bold shadow-lg shadow-orange-900/10 rounded-lg uppercase tracking-wide"
                >
                  Buy it now
                </Button>
              </div>
              
              {/* Trust Signals */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Free Shipping<br/>Above ₹499</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Secure<br/>Checkout</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">30-Day<br/>Returns</span>
                </div>
              </div>

              {/* Accordions */}
              <Accordion type="single" collapsible className="w-full mt-10">
                <AccordionItem value="details" className="border-b-gray-200">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[#D2691E]">Product Details</AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-base">
                    {PRODUCT.description}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ingredients" className="border-b-gray-200">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[#D2691E]">Ingredients</AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid grid-cols-1 gap-2 text-gray-600 text-sm">
                      <li className="flex items-start"><span className="font-bold text-gray-900 w-32 shrink-0">Neem Extract:</span> Natural antibacterial agent that prevents germs.</li>
                      <li className="flex items-start"><span className="font-bold text-gray-900 w-32 shrink-0">Tea Tree Oil:</span> Fights dandruff, fungus, and scalp itch.</li>
                      <li className="flex items-start"><span className="font-bold text-gray-900 w-32 shrink-0">Aloe Vera:</span> Soothes skin and provides a cooling effect.</li>
                      <li className="flex items-start"><span className="font-bold text-gray-900 w-32 shrink-0">Chamomile:</span> Adds a calming, fresh fragrance.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="usage" className="border-b-0">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[#D2691E]">How to Use</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Shake the bottle well before use.</li>
                      <li>Hold the bottle upright and spray 6-8 times inside the helmet padding.</li>
                      <li>Allow it to air dry for 30-60 seconds.</li>
                      <li>Wear your helmet and enjoy the freshness!</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

            </div>
          </div>
        </div>

        {/* --- SECTION 2: UGC / SOCIAL PROOF --- */}
        <section className="py-20 border-t border-gray-100 mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 font-montserrat">See it in Action</h2>
            <p className="text-gray-600">Join 10,000+ riders who choose Hygena daily</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-all">
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <span className="font-bold text-2xl opacity-20">UGC</span>
                    <span className="text-xs opacity-40">Review {item}</span>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                 <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs font-medium opacity-90">@rider_account</p>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 3: UPSELLS --- */}
        <section className="py-16 bg-gray-50 -mx-4 px-4 sm:rounded-3xl my-8">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2 font-montserrat">Complete The Routine</h2>
              <p className="text-gray-600">Riders who bought this also bought</p>
            </div>
            
            <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                {[1, 2, 3, 4].map((_, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/3 lg:basis-1/4">
                    <Card className="border-none shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white">
                      <CardContent className="p-4">
                        <div className="aspect-square bg-gray-100 rounded-xl mb-4 overflow-hidden">
                          <img 
                            src={IMAGES.main} 
                            alt="Product" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h3 className="font-bold text-sm mb-1 line-clamp-1">Hygena Travel Mini (30ml)</h3>
                        <p className="text-xs text-gray-500 mb-3">Pocket friendly protection</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-[#D2691E]">₹199</span>
                            <span className="text-xs text-gray-400 line-through ml-2">₹299</span>
                          </div>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full border-[#D2691E] text-[#D2691E] hover:bg-[#D2691E] hover:text-white">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>
        </section>

        {/* --- SECTION 4: REVIEWS & FAQ GRID --- */}
        <div className="grid lg:grid-cols-12 gap-12 py-16">
          
          {/* Reviews List */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-montserrat">Customer Reviews</h2>
              <Button variant="outline" className="border-gray-300">Write a review</Button>
            </div>
            
            {/* Review Stats */}
            <div className="bg-gray-50/80 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
              <div>
                <div className="text-4xl font-bold flex items-center gap-2 mb-1">
                  4.8 <Star className="w-6 h-6 fill-[#D2691E] text-[#D2691E]" />
                </div>
                <p className="text-sm text-gray-500">Based on {PRODUCT.reviewCount} verified reviews</p>
              </div>
              <div className="flex-1 max-w-xs space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-3 text-xs font-medium">
                    <span className="w-3 text-gray-400">{star}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#D2691E]" style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : '2%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-8">
              {REVIEWS.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1A3C34] text-white flex items-center justify-center text-sm font-bold">
                        {review.user.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">{review.user}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 h-5 px-1.5 font-normal flex gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1 mt-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#D2691E] text-[#D2691E]" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>

                  <h3 className="font-bold text-sm mb-2">{review.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.content}</p>
                  
                  {/* Generic Review Image Placeholder if needed */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">
                    User Photo
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="ghost" className="text-[#D2691E] hover:text-[#b85c1a] hover:bg-orange-50">
                Load More Reviews
              </Button>
            </div>
          </div>

          {/* FAQ Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold mb-6 font-montserrat">Common Questions</h2>
              <Accordion type="single" collapsible className="w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="px-4 border-b last:border-0 border-gray-100">
                    <AccordionTrigger className="text-sm font-semibold text-left py-4 hover:no-underline hover:text-[#D2691E] transition-colors">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-4 leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-xl text-center">
                <h4 className="font-bold text-gray-900 mb-2">Still have questions?</h4>
                <p className="text-sm text-gray-600 mb-4">We're here to help you ride fresh.</p>
                <Button variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100">
                  Chat with Support
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
