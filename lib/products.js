// lib/products.js
export const PRODUCT_DATA = {
  id: 1,
  name: "Hygena Helmet Deodorant",
  subtitle: "India's first helmet deodorant built for sweat, bacteria, and daily rides.",
  image: "/images/1_Hygena_helmet_deodorant_bottle.webp",
  size: "100ml",
  duration: "30 Days Protection",
  price: 599,
  originalPrice: 999,
  discount: "40% OFF",
  rating: 4.8,
  reviews: 124,
  badge: "Best Seller",
  inStock: true,
  
  // Product features for different contexts
  features: {
    main: ["Kills 99.9% Bacteria", "Scalp Safe", "Natural Ingredients"],
    detailed: [
      "Bacteriostatic formula prevents bacterial growth",
      "Lasts up to 30 days per application",
      "Safe for daily use on helmets",
      "Natural ayurvedic ingredients"
    ]
  },
  
  // Gallery images
  gallery: [
    "/images/1_Hygena_helmet_deodorant_bottle.webp",
    "/images/2_Hyegna_helmet_deodorant_features.webp",
    "/images/3_Hygena_helmet_deodorant_Bacteriostatic_tech.webp",
    "/images/4_Hygena_helmet_deodorant_Ingredients.webp",
    "/images/5_Hygena_helmet_deodorant_How_to_Use.webp",
    "/images/6_Hygena_helmet_deodorant_Why_Hygena_Better.webp",
    "/images/7_Hygena_helmet_deodorant_Daily_Use.webp",
    "/images/8_Hygena_helmet_deodorant_Process.webp",
    "/images/9_Hygena_helmet_deodorant_Natural_Actives.webp",
  ],
  
  // Full description
  description: "Hygena Helmet Deodorant is India's first bacteriostatic helmet spray designed to control odour at its source. Instead of masking smells with heavy fragrance, it works by pausing the growth of odour-causing bacteria inside helmet padding for up to 24 hours. Enriched with natural ingredients, the formula helps maintain scalp comfort by reducing itchiness and discomfort commonly caused by prolonged helmet wear. It is gentle, dermatologically tested, and safe for regular use on helmet interiors. Ideal for daily riders, Hygena helps keep helmets feeling fresh and hygienic between washes, with long-lasting freshness when used regularly."
}
