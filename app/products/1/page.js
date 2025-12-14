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
  CheckCircle2,
  Droplets,
  Wind
} from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// --- IMAGES (Unsplash Placeholders for Prod) ---
const IMAGES = {
  main: "https://images.unsplash.com/photo-1649176154020-c695980078e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxkZW9kb3JhbnQlMjBzcHJheXxlbnwwfHx8b3JhbmdlfDE3NTczMTY5NzR8MA&ixlib=rb-4.1.0&q=85",
  side: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000", // Generic bottle spray
  lifestyle: "https://images.unsplash.com/photo-1558981806-ec527fa84c3d?auto=format&fit=crop&q=80&w=1000", // Biker
  ingredients: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=1000" // Natural vibe
}

// --- HARDCODED SINGLE PRODUCT DATA ---
const PRODUCT = {
  id: "1", // String ID to match cart logic usually
  name: "Hygena Helmet Deodorant",
  subtitle: "Bacteriostatic Formula | 100ml",
  price: 549,
  originalPrice: 799,
  rating: 4.8,
  reviewCount: 124,
  description: "Experience the freshness of a new helmet every day. Hygena is India's first bacteriostatic helmet spray that doesn't just mask odor—it pauses bacterial growth. Enriched with Neem and Tea Tree, it protects your scalp from itchiness and dandruff while keeping your helmet smelling fresh for up to 30 days per application.",
  gallery: [
    IMAGES.main,
    IMAGES.side,
    IMAGES.lifestyle,
    IMAGES.ingredients
  ]
}

const REVIEWS = [
  {
    id: 1,
    user: "Raj Kumar",
    date: "12 Oct 2024",
    rating: 5,
    verified: true,
    title: "Essential for daily riders",
    content: "I ride 40km daily in Mumbai heat. My helmet used to smell terrible by Friday. With Hygena, it stays fresh for weeks. The cooling sensation is a bonus!",
    initial: "R"
  },
  {
    id: 2,
    user: "Sneha G.",
    date: "28 Sep 2024",
    rating: 5,
    verified: true,
    title: "Saved my hair",
    content: "I was getting severe dandruff and scalp acne from my helmet. My dermatologist suggested keeping the helmet clean. Hygena did exactly that. No more itching.",
    initial: "S"
  },
  {
    id: 3,
    user: "Amit Patel",
    date: "15 Sep 2024",
    rating: 4,
    verified: true,
    title: "Good product",
    content: "Works as advertised. The smell is pleasant and not too strong like cheap perfumes. Delivery took 4 days though.",
    initial: "A"
  }
]

const FAQS = [
  { q: "How often should I use this spray?", a: "For optimal hygiene, we recommend spraying it once before your ride. However, our bacteriostatic effect lasts up to 30 days, so even weekly application works for casual riders." },
  { q: "Is it safe for my scalp?", a: "Absolutely. Hygena is formulated with natural extracts like Aloe Vera, Neem, and Chamomile. It is pH balanced, alcohol-free, and dermatologically tested to be safe for skin and hair." },
  { q: "Will it damage my helmet padding?", a: "No. The formula is non-corrosive and designed specifically for foam and fabric liners found in helmets. It dries quickly without leaving sticky residue." },
  { q: "Can I use it on riding gloves?", a: "Yes! Hygena works excellently on riding gloves, jackets, and even gym bags to neutralize odor-causing bacteria." }
]

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const router = useRouter()

  const addToCart = (buyNow = false) => {
    const savedCart = localStorage.getItem('hygena_cart')
    let cartItems = savedCart ? JSON.parse(savedCart) : []
    
    // Check if item exists
    const existing = cartItems.find(item => item.id === PRODUCT.id)
    if (existing) {
      cartItems = cartItems.map(item => 
        item.id === PRODUCT.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      // Add new item with image property for cart display
      cartItems = [...cartItems, { 
        ...PRODUCT, 
        quantity: quantity, 
        image: PRODUCT.gallery[0] 
      }]
    }
    
    localStorage.setItem('hygena_cart', JSON.stringify(cartItems))
    // Dispatch event to update Navbar count immediately
    window.dispatchEvent(new Event('cartUpdated'))
    
    if (buyNow) {
      router.push('/checkout')
    } else {
      alert('Added to cart!')
    }
  }

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* 1. TOP PROMO BAR */}
      <div className="bg-[#1A3C34] text-white text-center py-2 text-xs md:text-sm font-medium tracking-wide">
        🎉 Limited Time: Get 20% OFF with code <span className="font-bold text-[#FF8C00]">FRESH20</span>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="text-xs md:text-sm text-gray-500 mb-8 flex items-center gap-2">
          <span className="hover:text-black cursor-pointer transition-colors" onClick={() => router.push('/')}>Home</span> 
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-black cursor-pointer transition-colors" onClick={() => router.push('/shop')}>Shop</span> 
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium truncate">{PRODUCT.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* --- LEFT COLUMN: IMAGE GALLERY --- */}
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
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {PRODUCT.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                    selectedImage === idx ? 'border-[#D2691E] opacity-100 ring-2 ring-[#D2691E] ring-offset-1' : 'border-transparent opacity-70 hover:opacity-100'
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
                <span className="text-sm font-medium text-gray-900 border-b border-gray-300 hover:border-black cursor-pointer transition-all">
                  {PRODUCT.reviewCount} Verified Reviews
                </span>
              </div>

              {/* Functional Badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                <Badge variant="outline" className="text-[#1A3C34] border-[#1A3C34]/20 bg-[#1A3C34]/5 py-1.5 px-3">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> BACTERIOSTATIC
                </Badge>
                <Badge variant="outline" className="text-[#1A3C34] border-[#1A3C34]/20 bg-[#1A3C34]/5 py-1.5 px-3">
                  <Leaf className="w-3.5 h-3.5 mr-1.5" /> NATURAL ACTIVES
                </Badge>
                <Badge variant="outline" className="text-[#1A3C34] border-[#1A3C34]/20 bg-[#1A3C34]/5 py-1.5 px-3">
                  <Wind className="w-3.5 h-3.5 mr-1.5" /> ODOR BLOCK
                </Badge>
              </div>

              {/* Price Block */}
              <div className="flex items-end gap-3 mb-8">
                <span className="text-4xl font-bold text-gray-900 font-montserrat">₹{PRODUCT.price}</span>
                <span className="text-xl text-gray-400 line-through mb-1">₹{PRODUCT.originalPrice}</span>
                <span className="text-white bg-red-500 font-bold text-xs px-2 py-1 rounded mb-2 shadow-sm">
                  {Math.round(((PRODUCT.originalPrice - PRODUCT.price) / PRODUCT.originalPrice) * 100)}% OFF
                </span>
              </div>

              {/* Testimonial Snippet */}
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

              {/* Add to Cart Actions */}
              <div className="space-y-4 pb-8 border-b border-gray-100">
                <div className="flex gap-4 h-12">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-lg w-32 justify-between px-1 shadow-sm">
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
                    className="flex-1 bg-black text-white hover:bg-gray-800 h-full text-base font-medium rounded-lg shadow-md transition-all hover:scale-[1.02]"
                  >
                    Add to Cart
                  </Button>
                  
                  {/* Wishlist */}
                  <Button variant="outline" size="icon" className="h-full w-12 border-gray-300 rounded-lg hover:border-[#D2691E] hover:text-[#D2691E] transition-colors">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>

                {/* Buy Now */}
                <Button 
                  onClick={() => addToCart(true)}
                  className="w-full bg-[#D2691E] text-white hover:bg-[#b85c1a] h-12 text-base font-bold shadow-lg shadow-orange-900/20 rounded-lg uppercase tracking-wide transition-all hover:scale-[1.01]"
                >
                  Buy it now
                </Button>
              </div>
              
              {/* Trust Signals */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="flex flex-col items-center text-center gap-2 group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-orange-50 transition-colors flex items-center justify-center">
                    <Truck className="w-5 h-5 text-gray-600 group-hover:text-[#D2691E]" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Free Shipping<br/>Above ₹499</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-orange-50 transition-colors flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-gray-600 group-hover:text-[#D2691E]" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Secure<br/>Payments</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-orange-50 transition-colors flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-gray-600 group-hover:text-[#D2691E]" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">30-Day<br/>Returns</span>
                </div>
              </div>

              {/* Accordions */}
              <Accordion type="single" collapsible className="w-full mt-10">
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
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D2691E] shrink-0" />
                        <span><strong className="text-gray-900">Neem Extract:</strong> Powerful antibacterial agent that kills germs.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D2691E] shrink-0" />
                        <span><strong className="text-gray-900">Tea Tree Oil:</strong> Fights dandruff, fungus, and keeps scalp clean.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D2691E] shrink-0" />
                        <span><strong className="text-gray-900">Aloe Vera:</strong> Soothes skin irritation and provides cooling.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D2691E] shrink-0" />
                        <span><strong className="text-gray-900">Chamomile:</strong> Adds a gentle, non-overpowering fragrance.</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="usage" className="border-b-0">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-[#D2691E] py-4">How to Use</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <div className="grid gap-4">
                      <div className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D2691E] text-white text-xs font-bold shrink-0">1</span>
                        <p className="text-sm">Shake the bottle well before use.</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D2691E] text-white text-xs font-bold shrink-0">2</span>
                        <p className="text-sm">Spray 6-8 times inside the helmet padding (sides and top).</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D2691E] text-white text-xs font-bold shrink-0">3</span>
                        <p className="text-sm">Let it air dry for 30 seconds before wearing.</p>
                      </div>
                    </div>
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
              <div key={item} className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300">
                 {/* Fake Video Thumbnail Effect */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 z-10">
                    <span className="bg-white/90 p-3 rounded-full shadow-lg">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-[#D2691E] border-b-[6px] border-b-transparent ml-1"></div>
                    </span>
                 </div>
                 <img 
                    src={`https://images.unsplash.com/photo-${item === 1 ? '1622185135895-1405545ea3e4' : item === 2 ? '1558981806-ec527fa84c3d' : item === 3 ? '1605218427368-35b81a3d82fa' : '1591181520189-d6880346a3b2'}?auto=format&fit=crop&q=80&w=400`} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                    alt="Social Proof"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                 <div className="absolute bottom-4 left-4 text-white z-20">
                    <p className="text-xs font-medium opacity-90 flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-white" /> @rider_{item}
                    </p>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 3: REVIEWS & FAQ GRID --- */}
        <div className="grid lg:grid-cols-12 gap-12 py-16">
          
          {/* Reviews List */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-montserrat">Customer Reviews</h2>
              <Button variant="outline" className="border-gray-300">Write a review</Button>
            </div>
            
            {/* Review Stats */}
            <div className="bg-gray-50/80 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6 border border-gray-100">
              <div>
                <div className="text-4xl font-bold flex items-center gap-2 mb-1 text-gray-900">
                  4.8 <Star className="w-6 h-6 fill-[#D2691E] text-[#D2691E]" />
                </div>
                <p className="text-sm text-gray-500 font-medium">Based on {PRODUCT.reviewCount} verified reviews</p>
              </div>
              <div className="flex-1 max-w-xs space-y-2">
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
                        {review.initial}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">{review.user}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 h-5 px-1.5 font-normal flex gap-1 border-none">
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
                    <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                  </div>

                  <h3 className="font-bold text-sm mb-2 text-gray-900">{review.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.content}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="ghost" className="text-[#D2691E] hover:text-[#b85c1a] hover:bg-orange-50 font-medium">
                Load More Reviews
              </Button>
            </div>
          </div>

          {/* FAQ Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold mb-6 font-montserrat">Common Questions</h2>
              <Accordion type="single" collapsible className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="px-4 border-b last:border-0 border-gray-100">
                    <AccordionTrigger className="text-sm font-semibold text-left py-4 hover:no-underline hover:text-[#D2691E] transition-colors">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-4 leading-relaxed text-sm">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-xl text-center border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-2">Still have questions?</h4>
                <p className="text-sm text-gray-600 mb-4">We're here to help you ride fresh.</p>
                <Button variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100 font-medium shadow-sm" onClick={() => router.push('/contact')}>
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
