'use client'
import { ScrollingBanner } from '@/components/ScrollingBanner'
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
  description: "Hygena Helmet Deodorant is India's first bacteriostatic helmet spray designed to control odour at its source. Instead of masking smells with heavy fragrance, it works by pausing the growth of odour-causing bacteria inside helmet padding for up to 24 hours. Enriched with natural ingredients, the formula helps maintain scalp comfort by reducing itchiness and discomfort commonly caused by prolonged helmet wear. It is gentle, dermatologically tested, and safe for regular use on helmet interiors. Ideal for daily riders, Hygena helps keep helmets feeling fresh and hygienic between washes, with long-lasting freshness when used regularly.",
  gallery: [IMAGES.main, IMAGES.img2, IMAGES.img3, IMAGES.img4, IMAGES.img5, IMAGES.img6, IMAGES.img7, IMAGES.img8, IMAGES.img9]
}

const REVIEWS = [
  { 
    id: 1, 
    user: "Raj Kumar", 
    date: "12 Oct 2024", 
    rating: 5, 
    verified: true, 
    title: "Essential for daily riders", 
    content: "I ride 40km daily in Mumbai heat. My helmet used to smell terrible by Friday. With Hygena, it stays fresh for weeks.", 
    initial: "R" 
  },
  { 
    id: 2, 
    user: "Sneha G.", 
    date: "28 Sep 2024", 
    rating: 5, 
    verified: true, 
    title: "Saved my hair", 
    content: "I was getting severe dandruff and scalp acne from my helmet. Hygena did exactly what it promised. No more itching.", 
    initial: "S" 
  },
]

const FAQS = [
  { 
    q: "How often should I use this spray?", 
    a: "For optimal hygiene, we recommend spraying it daily once before your ride. However, our bacteriostatic protection lasts up to 24 hours per application." 
  },
  { 
    q: "Is it safe for my scalp?", 
    a: "Absolutely. Hygena is dermatologically tested and formulated with natural extracts like Aloe Vera, Neem, and Chamomile which makes it gentle for scalp." 
  },
  { 
    q: "Will it damage my helmet padding?", 
    a: "No. It's specifically formulated for helmet interiors and won't damage or degrade the padding." 
  },
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
      {/* TOP PROMO BAR */}
      <div className="bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white text-center py-2.5 text-xs md:text-sm font-medium tracking-wide shadow-md">
        🎉 Limited Time: Get 10% OFF with code <span className="font-bold bg-white text-[#D2691E] px-2 py-0.5 rounded">FRESH10</span>
      </div>

      {/* STICKY BOTTOM PURCHASE BAR - ULTRA COMPACT - FIXED Z-INDEX */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black text-white shadow-2xl">
        <div className="container mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between gap-2 sm:gap-3 max-w-7xl mx-auto">
            
            {/* LEFT: Product Info - Ultra Compact */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-shrink">
              <img 
                src={PRODUCT.gallery[0]} 
                alt={PRODUCT.name}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded object-cover border border-gray-700 flex-shrink-0"
              />
              <div className="hidden sm:block min-w-0 max-w-[100px] md:max-w-[180px]">
                <h3 className="font-medium text-[11px] sm:text-xs truncate leading-tight">
                  {PRODUCT.name}
                </h3>
              </div>
            </div>

            {/* MIDDLE: Quantity + Price - Tightly Grouped */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
              {/* Quantity Controls - Ultra Compact */}
              <div className="flex items-center bg-gray-800 rounded px-1 py-0.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 text-center font-semibold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Price Display - Compact */}
              <div className="text-right min-w-[45px] sm:min-w-[60px]">
                <div className="text-base sm:text-lg font-bold leading-none">₹{PRODUCT.price * quantity}</div>
              </div>
            </div>

            {/* RIGHT: Buy Now Button - Compact */}
            <Button
              onClick={() => addToCart(true)}
              className="bg-[#D2691E] hover:bg-[#b85c1a] text-white font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded text-xs sm:text-sm transition-all hover:scale-105 flex-shrink-0 h-8 sm:h-9"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <span className="hover:text-black cursor-pointer" onClick={() => router.push('/')}>Home</span> 
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-black cursor-pointer" onClick={() => router.push('/shop')}>Shop</span> 
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium truncate">{PRODUCT.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-4">
            {/* Main Image */}
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

            {/* Thumbnail Gallery */}
            <div className="hidden md:flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {PRODUCT.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                    selectedImage === idx 
                      ? 'border-[#D2691E] opacity-100 ring-2 ring-[#D2691E] ring-offset-1' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT DETAILS */}
          <div className="flex flex-col">
            <div className="mb-6">
              {/* Product Title & Subtitle */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2 font-montserrat">
                {PRODUCT.name}
              </h1>
              <p className="text-base text-gray-600 mb-4">{PRODUCT.subtitle}</p>
              
              {/* Rating & Reviews */}
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

              {/* Feature Badges */}
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

              {/* Pricing */}
              <div className="flex flex-wrap items-end gap-3 mb-8">
                <span className="text-3xl font-bold text-gray-900 font-montserrat">₹{PRODUCT.price}</span>
                <span className="text-lg text-gray-400 line-through">₹{PRODUCT.originalPrice}</span>
                <span className="text-xs text-gray-500">(Incl. of all taxes)</span>
                <span className="text-white bg-red-500 font-bold text-xs px-2 py-1 rounded shadow-sm">
                  60% OFF
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <div className="flex gap-4 h-12">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-300 rounded-lg w-32 justify-between px-1 shadow-sm">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="p-2 hover:bg-gray-100 rounded-md text-gray-600"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)} 
                      className="p-2 hover:bg-gray-100 rounded-md text-gray-600"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <Button 
                    onClick={() => addToCart(false)} 
                    className="flex-1 bg-black text-white hover:bg-gray-800 h-full text-base font-medium rounded-lg shadow-md"
                  >
                    Add to Cart
                  </Button>

                  {/* Wishlist Button */}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-full w-12 border-gray-300 rounded-lg hover:border-[#D2691E] hover:text-[#D2691E]"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>

                {/* Buy Now Button */}
                <Button 
                  onClick={() => addToCart(true)} 
                  className="w-full bg-[#D2691E] text-white hover:bg-[#b85c1a] h-12 text-base font-bold shadow-lg shadow-orange-900/20 rounded-lg uppercase tracking-wide"
                >
                  Buy it now
                </Button>
              </div>

              {/* Payment Security Badge */}
              <div className="py-5 flex justify-center">
                <img
                  src="/images/paymentbadge.jpeg"
                  alt="Guaranteed Safe Checkout - Razorpay, Visa, Mastercard, UPI"
                  className="w-full max-w-[400px] h-auto object-contain"
                />
              </div>

              {/* Product Information Accordions */}
              <Accordion type="single" collapsible className="w-full mt-6">
                <AccordionItem value="details" className="border-b-gray-200">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[#D2691E] py-4">
                    Product Details
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-sm">
                    {PRODUCT.description}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ingredients" className="border-b-gray-200">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[#D2691E] py-4">
                    Key Ingredients
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid grid-cols-1 gap-3 text-gray-600 text-sm">
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D2691E] shrink-0" />
                        <span><strong>Neem Extract:</strong> Purifies deeply & keeps the scalp protected.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D2691E] shrink-0" />
                        <span><strong>Tea Tree Oil:</strong> Fights bacteria & controls odor-causing microbes.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D2691E] shrink-0" />
                        <span><strong>Aloe Extract:</strong> Soothes irritation & refreshes the scalp.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D2691E] shrink-0" />
                        <span><strong>Chamomile Oil:</strong> Calms inflammation & reduces redness.</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="usage" className="border-b-0">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[#D2691E] py-4">
                    How to Use
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Shake the bottle well before use.</li>
                      <li>Spray 2-3 times inside the helmet padding.</li>
                      <li>Let it air dry for 10-20 seconds.</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* SCROLLING BANNER */}
        <ScrollingBanner 
          items={["Dermatologically Tested", "Bacteriostatic Technology", "Scalp Safe", "No Harsh Chemicals", "Daily-Use Safe", "Made for Indian Riders"]}
          speed={10}
        />

        {/* FAQ & REVIEWS SECTION */}
        <div className="mt-16 grid lg:grid-cols-12 gap-10">
          {/* FAQ SECTION */}
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold mb-6 font-montserrat">Common Questions</h2>

            <Accordion 
              type="single" 
              collapsible 
              className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {FAQS.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="px-4 border-b last:border-0 border-gray-100"
                >
                  <AccordionTrigger className="text-sm font-semibold text-left py-4 hover:no-underline hover:text-[#D2691E] transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4 leading-relaxed text-sm">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* REVIEWS SECTION */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-montserrat">Customer Reviews</h2>
              <Button variant="outline" className="border-gray-300">Write a review</Button>
            </div>

            {/* Review Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REVIEWS.map((review) => (
                <div 
                  key={review.id} 
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full"
                >
                  <div>
                    {/* User & Verified Badge */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="font-bold text-sm text-gray-900">{review.user}</span>
                      {review.verified && (
                        <div className="flex items-center gap-0.5 text-[#10B981] text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 fill-[#10B981] text-white" />
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${
                            i < review.rating 
                              ? 'fill-[#D2691E] text-[#D2691E]' 
                              : 'fill-gray-200 text-gray-200'
                          }`} 
                        />
                      ))}
                    </div>

                    {/* Review Content */}
                    <p className="text-gray-600 text-[13px] leading-relaxed">
                      {review.content}
                    </p>
                  </div>

                  {/* Review Date */}
                  <div className="mt-5 text-[11px] text-gray-400 text-right font-medium">
                    {review.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
