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
  Wind, 
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Lock
} from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'

// --- IMAGES ---
const IMAGES = {
  main: "/images/1st.jpg",
  img2: "/images/2nd.png",
  img3: "/images/3rd.png",
  img4: "/images/4th.png",
  img5: "/images/5th.png",
  img6: "/images/6th.png",
  img7: "/images/7th.png",
  img8: "/images/8th.png",
  img9: "/images/9th.png",
  paymentStrip: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/safe-checkout-badge.png?v=1662472627" 
}

// --- PRODUCT DATA ---
const PRODUCT = {
  id: "1",
  name: "Helmet Deodorant | 100ml",
  subtitle: "India's first helmet deodorant built for sweat, bacteria, and daily rides.",
  price: 399,
  originalPrice: 999,
  rating: 4.8,
  reviewCount: 124,
  description: "Experience the freshness of a new helmet every day. Hygena is India's first bacteriostatic helmet spray that doesn't just mask odor—it pauses bacterial growth. Enriched with Neem and Tea Tree, it protects your scalp from itchiness and dandruff while keeping your helmet smelling fresh for up to 30 days per application.",
  gallery: [IMAGES.main, IMAGES.img2, IMAGES.img3, IMAGES.img4, IMAGES.img5, IMAGES.img6, IMAGES.img7, IMAGES.img8, IMAGES.img9]
}

const REVIEWS = [
  { id: 1, user: "Raj Kumar", date: "12 Oct 2024", rating: 5, verified: true, title: "Essential for daily riders", content: "I ride 40km daily in Mumbai heat. My helmet used to smell terrible by Friday. With Hygena, it stays fresh for weeks.", initial: "R" },
  { id: 2, user: "Sneha G.", date: "28 Sep 2024", rating: 5, verified: true, title: "Saved my hair", content: "I was getting severe dandruff and scalp acne from my helmet. Hygena did exactly what it promised. No more itching.", initial: "S" },
]

const FAQS = [
  { q: "How often should I use this spray?", a: "For optimal hygiene, we recommend spraying it once before your ride. However, our bacteriostatic effect lasts up to 30 days." },
  { q: "Is it safe for my scalp?", a: "Absolutely. Hygena is formulated with natural extracts like Aloe Vera, Neem, and Chamomile. It is pH balanced and alcohol-free." },
  { q: "Will it damage my helmet padding?", a: "No. The formula is non-corrosive and designed specifically for foam and fabric liners." },
]

export default function ProductPage() {
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
      cartItems = [
        ...cartItems,
        {
          ...PRODUCT,
          quantity,
          image: PRODUCT.gallery[0]
        }
      ]
    }

    localStorage.setItem('hygena_cart', JSON.stringify(cartItems))
    window.dispatchEvent(new Event('cartUpdated'))

    if (buyNow) router.push('/checkout')
    else alert('Added to cart!')
  }

  const navigateImage = (direction) => {
    if (direction === 'prev') {
      setSelectedImage(prev =>
        prev === 0 ? PRODUCT.gallery.length - 1 : prev - 1
      )
    } else {
      setSelectedImage(prev =>
        prev === PRODUCT.gallery.length - 1 ? 0 : prev + 1
      )
    }
  }

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* 1. TOP PROMO BAR - Brand Orange Gradient */}
      <div className="bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white text-center py-2.5 text-xs md:text-sm font-medium tracking-wide shadow-md">
        🎉 Limited Time: Get 20% OFF with code <span className="font-bold bg-white text-[#D2691E] px-2 py-0.5 rounded">FRESH20</span>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <span className="hover:text-black cursor-pointer" onClick={() => router.push('/')}>Home</span> 
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-black cursor-pointer" onClick={() => router.push('/shop')}>Shop</span> 
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium truncate">{PRODUCT.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* --- LEFT: GALLERY --- */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative group border border-gray-100 shadow-sm">
              <img 
                src={PRODUCT.gallery[selectedImage]} 
                alt={PRODUCT.name} 
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <Badge className="absolute top-4 left-4 bg-[#D2691E] hover:bg-[#b85c1a] border-none text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md">
                Best Seller
              </Badge>
              
              {/* Navigation Arrows */}
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">
                {selectedImage + 1} / {PRODUCT.gallery.length}
              </div>
            </div>
            <div className="hidden md:flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {PRODUCT.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                    selectedImage === idx ? 'border-[#D2691E] opacity-100 ring-2 ring-[#D2691E] ring-offset-1' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT: DETAILS --- */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 font-montserrat">
                {PRODUCT.name}
              </h1>
              <p className="text-base text-gray-600 mb-4">{PRODUCT.subtitle}</p>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D2691E] text-[#D2691E]" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900 border-b border-gray-300 hover:border-black cursor-pointer transition-all">
                  {PRODUCT.reviewCount} Verified Reviews
                </span>
              </div>

              {/* Functional Badges - Orange & Gray */}
              <div className="flex flex-wrap gap-2 mb-8">
                <Badge variant="outline" className="text-gray-700 border-gray-200 bg-gray-50 py-1.5 px-3">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#D2691E]" /> BACTERIOSTATIC FORMULA
                </Badge>
                <Badge variant="outline" className="text-gray-700 border-gray-200 bg-gray-50 py-1.5 px-3">
                  <Leaf className="w-3.5 h-3.5 mr-1.5 text-[#D2691E]" /> NATURAL ACTIVES
                </Badge>
                <Badge variant="outline" className="text-gray-700 border-gray-200 bg-gray-50 py-1.5 px-3">
                  <Wind className="w-3.5 h-3.5 mr-1.5 text-[#D2691E]" /> ODOR BLOCK
                </Badge>
              </div>

              <div className="flex flex-wrap items-end gap-3 mb-8">
                <span className="text-3xl font-bold text-gray-900 font-montserrat">₹{PRODUCT.price}</span>
                <span className="text-lg text-gray-400 line-through">₹{PRODUCT.originalPrice}</span>
                <span className="text-xs text-gray-500">(Incl. of all taxes)</span>
                <span className="text-white bg-red-500 font-bold text-xs px-2 py-1 rounded shadow-sm">
                  60% OFF
                </span>
              </div>

              <div className="bg-orange-50/60 p-5 rounded-xl border border-orange-100 italic text-gray-700 text-sm mb-8 relative">
                <div className="flex gap-1 mb-2">
                   {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#D2691E] text-[#D2691E]" />)}
                </div>
                <p className="relative z-10 leading-relaxed">
                  "I've tried every hack for smelly helmets but they all felt temporary. This one actually controls oil, keeps acne away, and works after long metro rides."
                </p>
                <div className="text-right font-bold text-[#D2691E] text-xs mt-3 uppercase tracking-wide flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Rahul, Verified Buyer
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <div className="flex gap-4 h-12">
                  <div className="flex items-center border border-gray-300 rounded-lg w-32 justify-between px-1 shadow-sm">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-gray-900">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Add to Cart - Black */}
                  <Button onClick={() => addToCart(false)} className="flex-1 bg-black text-white hover:bg-gray-800 h-full text-base font-medium rounded-lg shadow-md">
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon" className="h-full w-12 border-gray-300 rounded-lg hover:border-[#D2691E] hover:text-[#D2691E]">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>

                {/* Buy Now - Orange (Brand) */}
                <Button onClick={() => addToCart(true)} className="w-full bg-[#D2691E] text-white hover:bg-[#b85c1a] h-12 text-base font-bold shadow-lg shadow-orange-900/20 rounded-lg uppercase tracking-wide">
                  Buy it now
                </Button>
              </div>

{/* --- PAYMENT & SECURITY BADGES --- */}
              <div className="py-5 flex justify-center">
                <img
                  src="/images/paymentbadge.jpeg"
                  alt="Guaranteed Safe Checkout - Razorpay, Visa, Mastercard, UPI"
                  className="w-full max-w-[400px] h-auto object-contain"
                />
              </div>

              {/* Accordions */}
              <Accordion type="single" collapsible className="w-full mt-6">
                <AccordionItem value="details" className="border-b-gray-200">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[#D2691E] py-4">Product Details</AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-sm">
                    {PRODUCT.description}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ingredients" className="border-b-gray-200">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[#D2691E] py-4">Key Ingredients</AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid grid-cols-1 gap-3 text-gray-600 text-sm">
                      <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D2691E] shrink-0" /><span><strong>Neem Extract:</strong> Powerful antibacterial agent that kills germs.</span></li>
                      <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D2691E] shrink-0" /><span><strong>Tea Tree Oil:</strong> Fights dandruff, fungus, and keeps scalp clean.</span></li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="usage" className="border-b-0">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[#D2691E] py-4">How to Use</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Shake the bottle well before use.</li>
                      <li>Spray 6-8 times inside the helmet padding.</li>
                      <li>Let it air dry for 30-60 seconds.</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

            </div>
          </div>
        </div>

        {/* --- REVIEWS & FAQ SECTION --- */}
        <div className="grid lg:grid-cols-12 gap-12 py-16 border-t border-gray-100 mt-16">
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-montserrat">Customer Reviews</h2>
              <Button variant="outline" className="border-gray-300">Write a review</Button>
            </div>
            <div className="space-y-8">
              {REVIEWS.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                  <div className="flex items-center gap-3 mb-3">
                    {/* Review Initial - Dark Gray (No Green) */}
                    <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold">{review.initial}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{review.user}</span>
                        {review.verified && <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 border-none"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>}
                      </div>
                      <div className="flex gap-1 mt-0.5">{[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#D2691E] text-[#D2691E]" />)}</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm mb-2 text-gray-900">{review.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold mb-6 font-montserrat">Common Questions</h2>
            <Accordion type="single" collapsible className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="px-4 border-b last:border-0 border-gray-100">
                  <AccordionTrigger className="text-sm font-semibold text-left py-4 hover:no-underline hover:text-[#D2691E] transition-colors">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4 leading-relaxed text-sm">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

      </div>
    </div>
  )
}
