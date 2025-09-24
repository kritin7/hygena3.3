import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'

// MongoDB connection
let client
let db
let razorpay

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Initialize Razorpay
function initializeRazorpay() {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
  }
  return razorpay
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // Root endpoint - GET /api/
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ 
        message: "Hygena API is running",
        status: "success",
        timestamp: new Date().toISOString()
      }))
    }

    // Products endpoints - GET /api/products
    if (route === '/products' && method === 'GET') {
      const products = [
        {
          id: "1",
          name: "Starter Pack",
          size: "100ml",
          duration: "2-3 months",
          price: 549,
          originalPrice: 799,
          features: ["Perfect for trying", "Free shipping", "Money-back guarantee"],
          badge: "Most Popular",
          discount: "31% OFF",
          inStock: true,
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          name: "Family Pack",
          size: "3 x 100ml",
          duration: "6-9 months",
          price: 1399,
          originalPrice: 2397,
          savings: "Save ₹998",
          features: ["Best value", "Free premium cloth", "Priority support"],
          badge: "Best Value",
          inStock: true,
          created_at: new Date().toISOString()
        },
        {
          id: "3",
          name: "Rider's Bundle",
          includes: "2 bottles + Travel size",
          duration: "4-6 months",
          price: 999,
          originalPrice: 1597,
          features: ["Home + Travel", "Free helmet cloth", "Exclusive sticker pack"],
          inStock: true,
          created_at: new Date().toISOString()
        }
      ]
      
      return handleCORS(NextResponse.json({ 
        products,
        total: products.length,
        status: "success"
      }))
    }

    // Orders endpoints - POST /api/orders
    if (route === '/orders' && method === 'POST') {
      const body = await request.json()
      
      if (!body.customer_name || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
        return handleCORS(NextResponse.json(
          { error: "customer_name and items array are required" }, 
          { status: 400 }
        ))
      }

      const order = {
        id: uuidv4(),
        customer_name: body.customer_name,
        customer_email: body.customer_email || "",
        customer_phone: body.customer_phone || "",
        items: body.items,
        total_amount: body.total_amount || 0,
        status: "pending",
        payment_method: body.payment_method || "cod",
        shipping_address: body.shipping_address || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await db.collection('orders').insertOne(order)
      return handleCORS(NextResponse.json({
        message: "Order created successfully",
        order: order,
        status: "success"
      }))
    }

    // Orders endpoints - GET /api/orders
    if (route === '/orders' && method === 'GET') {
      const orders = await db.collection('orders')
        .find({})
        .sort({ created_at: -1 })
        .limit(100)
        .toArray()

      // Remove MongoDB's _id field from response
      const cleanedOrders = orders.map(({ _id, ...rest }) => rest)
      
      return handleCORS(NextResponse.json({
        orders: cleanedOrders,
        total: cleanedOrders.length,
        status: "success"
      }))
    }

    // Newsletter subscription - POST /api/newsletter
    if (route === '/newsletter' && method === 'POST') {
      const body = await request.json()
      
      if (!body.email) {
        return handleCORS(NextResponse.json(
          { error: "email is required" }, 
          { status: 400 }
        ))
      }

      const subscription = {
        id: uuidv4(),
        email: body.email,
        subscribed_at: new Date().toISOString(),
        status: "active"
      }

      await db.collection('newsletter_subscriptions').insertOne(subscription)
      return handleCORS(NextResponse.json({
        message: "Successfully subscribed to newsletter",
        subscription: subscription,
        status: "success"
      }))
    }

    // Contact form - POST /api/contact
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      
      if (!body.name || !body.email || !body.message) {
        return handleCORS(NextResponse.json(
          { error: "name, email, and message are required" }, 
          { status: 400 }
        ))
      }

      const contact = {
        id: uuidv4(),
        name: body.name,
        email: body.email,
        subject: body.subject || "General Inquiry",
        message: body.message,
        status: "new",
        created_at: new Date().toISOString()
      }

      await db.collection('contact_messages').insertOne(contact)
      return handleCORS(NextResponse.json({
        message: "Message sent successfully",
        contact: contact,
        status: "success"
      }))
    }

    // Create Razorpay Order - POST /api/razorpay/create-order
    if (route === '/razorpay/create-order' && method === 'POST') {
      const body = await request.json()
      
      if (!body.amount || !body.currency) {
        return handleCORS(NextResponse.json(
          { error: "amount and currency are required" }, 
          { status: 400 }
        ))
      }

      const razorpayInstance = initializeRazorpay()
      
      const options = {
        amount: Math.round(body.amount * 100), // Convert to paise
        currency: body.currency || 'INR',
        receipt: `rcpt_${Date.now()}`, // Shorter receipt ID
        notes: {
          customer_name: body.customer_name || '',
          customer_email: body.customer_email || '',
          items: JSON.stringify(body.items || [])
        }
      }

      const razorpayOrder = await razorpayInstance.orders.create(options)
      
      // Store order in database
      const order = {
        id: uuidv4(),
        razorpay_order_id: razorpayOrder.id,
        amount: body.amount,
        currency: body.currency,
        customer_name: body.customer_name || '',
        customer_email: body.customer_email || '',
        items: body.items || [],
        status: "created",
        created_at: new Date().toISOString()
      }

      await db.collection('payments').insertOne(order)

      return handleCORS(NextResponse.json({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        status: "success"
      }))
    }

    // Verify Razorpay Payment - POST /api/razorpay/verify-payment
    if (route === '/razorpay/verify-payment' && method === 'POST') {
      const body = await request.json()
      
      if (!body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
        return handleCORS(NextResponse.json(
          { error: "Missing required payment verification parameters" }, 
          { status: 400 }
        ))
      }

      // Verify signature
      const text = body.razorpay_order_id + "|" + body.razorpay_payment_id
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(text.toString())
        .digest("hex")

      if (expectedSignature === body.razorpay_signature) {
        // Payment verified successfully
        await db.collection('payments').updateOne(
          { razorpay_order_id: body.razorpay_order_id },
          { 
            $set: { 
              status: "completed",
              payment_id: body.razorpay_payment_id,
              signature: body.razorpay_signature,
              completed_at: new Date().toISOString()
            }
          }
        )

        return handleCORS(NextResponse.json({
          message: "Payment verified successfully",
          status: "success"
        }))
      } else {
        // Payment verification failed
        await db.collection('payments').updateOne(
          { razorpay_order_id: body.razorpay_order_id },
          { 
            $set: { 
              status: "failed",
              failure_reason: "Signature verification failed",
              failed_at: new Date().toISOString()
            }
          }
        )

        return handleCORS(NextResponse.json(
          { error: "Payment verification failed" }, 
          { status: 400 }
        ))
      }
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` }, 
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error", details: error.message }, 
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute