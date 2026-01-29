'use client'
import Script from "next/script";
import { ScrollingBanner } from '@/components/ScrollingBanner'
import { useState, useRef, useEffect } from 'react'
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
  Lock,
  ChevronDown
} from 'lucide-react'
import ProductTabs from '@/components/ProductTabs'

// UI Components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { PRODUCT_DATA } from '@/lib/products'

// --- PRODUCT DATA ---
const PRODUCT = {
  ...PRODUCT_DATA,
  name: "Helmet Deodorant | 100ml",
  gallery: PRODUCT_DATA.gallery
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
  
  const reviewsSectionRef = useRef(null)

  // Track ViewContent event when page loads

useEffect(() => {
  if (typeof window === "undefined") return;

  const key = `viewcontent_${PRODUCT.id}`;

  const fireViewContent = () => {
    if (!window.fbq) return;

    if (sessionStorage.getItem(key)) return;

    window.fbq("track", "ViewContent", {
      content_ids: [PRODUCT.id.toString()],
      content_type: "product",
      content_category: "Helmet Care",
      value: PRODUCT.price,
      currency: "INR",
    });

    sessionStorage.setItem(key, "true");
  };

  // Try immediately
  fireViewContent();

  // Retry for async pixel load
  const interval = setInterval(() => {
    if (window.fbq) {
      fireViewContent();
      clearInterval(interval);
    }
  }, 300);

  return () => clearInterval(interval);

}, []);

  const scrollToReviews = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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

    // Track AddToCart event
 if (window.fbq) {
      const key = `addtocart_${PRODUCT.id}`;

      if (!sessionStorage.getItem(key)) {
        window.fbq("track", "AddToCart", {
          content_ids: [PRODUCT.id.toString()],
          content_type: "product",
          value: PRODUCT.price * quantity,
          currency: "INR",
          content_name: PRODUCT.name,
          contents: [
            {
              id: PRODUCT.id,
              quantity,
              price: PRODUCT.price,
            },
          ],
        });

        sessionStorage.setItem(key, "true");
      }
    }
  };

  const handleBuyNow = () => {
    if (window.fbq) {
      const key = `initiatecheckout_${PRODUCT.id}`;

      if (!sessionStorage.getItem(key)) {
        window.fbq("track", "InitiateCheckout", {
          content_ids: [PRODUCT.id.toString()],
          content_type: "product",
          value: PRODUCT.price * quantity,
          currency: "INR",
          num_items: quantity,
        });

        sessionStorage.setItem(key, "true");
      }
    }

    router.push("/checkout");
  };


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
    {/* --- PRODUCT SCHEMA --- */}
<Script
  id="product-schema"
  type="application/ld+json"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: PRODUCT.name,
      image: PRODUCT.gallery.map(img => `https://www.hygena.in${img}`),
      description: PRODUCT.subtitle,
      brand: {
        "@type": "Brand",
        name: "Hygena",
      },
      offers: {
        "@type": "Offer",
        url: "https://www.hygena.in/shop",
        priceCurrency: "INR",
        price: PRODUCT.price,
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        reviewCount: PRODUCT.reviewCount?.toString() || "2",
      },
    }),
  }}
/>

{/* --- FAQ SCHEMA --- */}
<Script
  id="faq-schema"
  type="application/ld+json"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map(faq => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    }),
  }}
/>
      {/* TOP PROMO BAR */}
      <div className="bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white text-center py-2.5 text-xs md:text-sm font-medium tracking-wide shadow-md">
        🎉 Limited Time: Get 10% OFF with code <span className="font-bold bg-white text-[#D2691E] px-2 py-0.5 rounded">FRESH10</span>
      </div>

      {/* STICKY BOTTOM PURCHASE BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black text-white shadow-2xl">
        <div className="container mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between gap-2 sm:gap-3 max-w-7xl mx-auto">
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

            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
              <div className="flex items-center bg-gray-800 rounded px-1 py-0.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 text-center font-semibold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="text-right min-w-[45px] sm:min-w-[60px]">
                <div className="text-base sm:text-lg font-bold leading-none">₹{PRODUCT.price * quantity}</div>
              </div>
            </div>

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
        <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <span className="hover:text-black cursor-pointer" onClick={() => router.push('/')}>Home</span> 
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-black cursor-pointer" onClick={() => router.push('/shop')}>Shop</span> 
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium truncate">{PRODUCT.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          {/* LEFT COLUMN - Images */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative group border border-gray-100 shadow-sm">
              <img 
                src={PRODUCT.gallery[selectedImage]} 
                alt={PRODUCT.name} 
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <Badge className="absolute top-4 left-4 bg-[#D2691E] hover:bg-[#b85c1a] border-none text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md">
                Best Seller
              </Badge>
              
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
              
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

          {/* RIGHT COLUMN - Product Details */}
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
                <span 
                  onClick={scrollToReviews}
                  className="text-sm font-medium text-gray-900 border-b border-gray-300 hover:border-black cursor-pointer transition-all"
                >
                  {PRODUCT.reviewCount} Verified Reviews
                </span>
              </div>

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

              <div className="space-y-4 pb-6 border-b border-gray-100">
                <div className="flex gap-4 h-12">
                  <div className="flex items-center border border-gray-300 rounded-lg w-32 justify-between px-1 shadow-sm">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="p-2 hover:bg-gray-100 rounded-md text-gray-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)} 
                      className="p-2 hover:bg-gray-100 rounded-md text-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <Button 
                    onClick={() => addToCart(false)} 
                    className="flex-1 bg-black text-white hover:bg-gray-800 h-full text-base font-medium rounded-lg shadow-md"
                  >
                    Add to Cart
                  </Button>

                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-full w-12 border-gray-300 rounded-lg hover:border-[#D2691E] hover:text-[#D2691E]"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>

                <Button 
                  onClick={() => addToCart(true)} 
                  className="w-full bg-[#D2691E] text-white hover:bg-[#b85c1a] h-12 text-base font-bold shadow-lg shadow-orange-900/20 rounded-lg uppercase tracking-wide"
                >
                  Buy it now
                </Button>
              </div>

              <div className="py-5 flex justify-center border-b border-gray-100">
                <img
                  src="/images/paymentbadge.jpeg"
                  alt="Guaranteed Safe Checkout"
                  className="w-full max-w-[400px] h-auto object-contain"
                />
              </div>

              {/* PROMOTIONAL TEXT - IN THE RIGHT COLUMN */}
              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 text-center">
                  REAL HELMET HYGIENE. NO MASKING. NO PERFUME.
                </h3>
                <h4 className="text-lg font-bold text-[#D2691E] text-center">
                  JUST ODOUR CONTROL.
                </h4>
                
                <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="text-[#D2691E] font-bold">•</span>
                    <p><strong>Stops odour at the source:</strong> Pauses odour-causing bacteria inside helmet padding instead of covering smell with perfume</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#D2691E] font-bold">•</span>
                    <p><strong>Works within minutes:</strong> Quick-dry formula that freshens your helmet before your next ride</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#D2691E] font-bold">•</span>
                    <p><strong>Safe for daily use:</strong> Gentle on scalp contact areas and helmet liners—no irritation, no damage</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#D2691E] font-bold">•</span>
                    <p><strong>Freshness between washes:</strong> Keeps your helmet hygienic even when frequent washing isn't practical</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#D2691E] font-bold">•</span>
                    <p><strong>No heavy fragrance:</strong> Clean, neutral freshness without that overpowering deodorant smell</p>
                  </div>
                </div>

                <p className="text-sm text-gray-900 font-medium text-center mt-6">
                  Ride without second thoughts. Make helmet hygiene part of your daily routine.
                  <br />
                  <span className="text-[#D2691E] font-bold">Choose Hygena.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT TABS */}
      <ProductTabs />

      {/* SCROLLING BANNER */}
      <ScrollingBanner 
        items={["Dermatologically Tested", "Bacteriostatic Technology", "Scalp Safe", "No Harsh Chemicals", "Daily-Use Safe", "Made for Indian Riders"]}
        speed={10}
      />

      {/* FAQS & REVIEWS */}
      <div className="container mx-auto px-4 mt-16">
        <div className="grid lg:grid-cols-12 gap-10">
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

          <div ref={reviewsSectionRef} className="lg:col-span-7 scroll-mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-montserrat">Customer Reviews</h2>
              <Button variant="outline" className="border-gray-300">Write a review</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REVIEWS.map((review) => (
                <div 
                  key={review.id} 
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="font-bold text-sm text-gray-900">{review.user}</span>
                      {review.verified && (
                        <div className="flex items-center gap-0.5 text-[#10B981] text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 fill-[#10B981] text-white" />
                          Verified
                        </div>
                      )}
                    </div>

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

                    <p className="text-gray-600 text-[13px] leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                  <div className="mt-5 text-[11px] text-gray-400 text-right font-medium">
                    {review.date}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button 
                variant="ghost" 
                className="text-gray-500 hover:text-[#D2691E] font-bold text-xs tracking-widest flex items-center gap-2 group transition-all"
              >
                VIEW MORE REVIEWS
                <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
