import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

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
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-razorpay-signature')
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

    // Root endpoint
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ 
        message: "Hygena API is running",
        status: "success",
        timestamp: new Date().toISOString()
      }))
    }

    // Products endpoints - Single Product Return
    if (route === '/products' && method === 'GET') {
      const products = [
        {
          id: "1",
          name: "Hygena Helmet Deodorant",
          subtitle: "Pollution & Odor Control",
          size: "100ml",
          duration: "30 Days Protection",
          price: 399,
          originalPrice: 999,
          features: ["Kills 99.9% Bacteria", "Scalp Safe", "Natural Ingredients"],
          badge: "Best Seller",
          discount: "31% OFF",
          inStock: true,
          image: "https://images.unsplash.com/photo-1649176154020-c695980078e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxkZW9kb3JhbnQlMjBzcHJheXxlbnwwfHx8b3JhbmdlfDE3NTczMTY5NzR8MA&ixlib=rb-4.1.0&q=85",
          created_at: new Date().toISOString()
        }
      ]
      
      return handleCORS(NextResponse.json({ 
        products,
        total: products.length,
        status: "success"
      }))
    }

    // Orders endpoints - POST
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

    // Orders endpoints - GET
    if (route === '/orders' && method === 'GET') {
      const orders = await db.collection('orders')
        .find({})
        .sort({ created_at: -1 })
        .limit(100)
        .toArray()

      const cleanedOrders = orders.map(({ _id, ...rest }) => rest)
      
      return handleCORS(NextResponse.json({
        orders: cleanedOrders,
        total: cleanedOrders.length,
        status: "success"
      }))
    }

    // Newsletter subscription
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

    // Contact form
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

    // Create Razorpay Order
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
        amount: Math.round(body.amount * 100), 
        currency: body.currency || 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: {
          customer_name: body.customer_name || '',
          customer_email: body.customer_email || '',
          customer_phone: body.customer_phone || '' 
        }
      }

      const razorpayOrder = await razorpayInstance.orders.create(options)
      
      const order = {
        id: uuidv4(),
        razorpay_order_id: razorpayOrder.id,
        amount: body.amount,
        currency: body.currency,
        customer_name: body.customer_name || '',
        customer_email: body.customer_email || '',
        customer_phone: body.customer_phone || '',
        user_id: body.user_id || null,
        shipping_address: body.shipping_address || {},
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

    // Verify Razorpay Payment
    if (route === '/razorpay/verify-payment' && method === 'POST') {
      const body = await request.json()
      
      if (!body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
        return handleCORS(NextResponse.json(
          { error: "Missing required payment verification parameters" }, 
          { status: 400 }
        ))
      }

      const text = body.razorpay_order_id + "|" + body.razorpay_payment_id
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(text.toString())
        .digest("hex")

      if (expectedSignature === body.razorpay_signature) {
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

    // Razorpay Webhook
    if (route === '/webhooks/razorpay' && method === 'POST') {
      try {
        const rawBody = await request.text()
        
        if (!rawBody) {
            return handleCORS(NextResponse.json(
              { error: "Empty request body" }, 
              { status: 400 }
            ))
        }

        const payload = JSON.parse(rawBody)
        const { event, payload: data } = payload

        if (event === 'payment.captured') {
          const paymentEntity = data.payment.entity
          const orderId = paymentEntity.order_id
          
          await db.collection('payments').updateOne(
            { razorpay_order_id: orderId },
            { 
              $set: { 
                status: "completed",
                payment_id: paymentEntity.id,
                method: paymentEntity.method,
                completed_at: new Date().toISOString(),
                webhook_processed: true
              }
            }
          )
        }

        return handleCORS(NextResponse.json({ status: "ok" }))

      } catch (error) {
        console.error('Webhook Error:', error)
        return handleCORS(NextResponse.json(
          { error: "Webhook processing failed" }, 
          { status: 500 }
        ))
      }
    }

    // Register
    if (route === '/register' && method === 'POST') {
      const body = await request.json()
      
      if (!body.name || !body.email || !body.password) {
        return handleCORS(NextResponse.json(
          { error: "name, email, and password are required" }, 
          { status: 400 }
        ))
      }

      const existingUser = await db.collection('users').findOne({ 
        email: body.email 
      })

      if (existingUser) {
        return handleCORS(NextResponse.json(
          { error: "User already exists with this email" }, 
          { status: 400 }
        ))
      }

      const hashedPassword = await bcrypt.hash(body.password, 12)

      const newUser = {
        id: uuidv4(),
        name: body.name,
        email: body.email,
        password: hashedPassword,
        age: body.age ? parseInt(body.age) : null,
        address: body.address || null,
        provider: 'credentials',
        image: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await db.collection('users').insertOne(newUser)

      await db.collection('wishlists').insertOne({
        id: uuidv4(),
        user_id: newUser.id,
        items: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      return handleCORS(NextResponse.json({
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          age: newUser.age,
          address: newUser.address
        },
        status: "success"
      }))
    }

    // Wishlist GET
    if (route.startsWith('/wishlist/') && method === 'GET') {
      const userId = route.split('/')[2]
      
      if (!userId) {
        return handleCORS(NextResponse.json(
          { error: "User ID is required" }, 
          { status: 400 }
        ))
      }

      const wishlist = await db.collection('wishlists').findOne({ user_id: userId })
      
      if (!wishlist) {
        const newWishlist = {
          id: uuidv4(),
          user_id: userId,
          items: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        await db.collection('wishlists').insertOne(newWishlist)
        return handleCORS(NextResponse.json({
          wishlist: newWishlist,
          status: "success"
        }))
      }

      return handleCORS(NextResponse.json({
        wishlist: wishlist,
        status: "success"
      }))
    }

    // Wishlist Add
    if (route.match(/^\/wishlist\/[^/]+\/add$/) && method === 'POST') {
      const userId = route.split('/')[2]
      const body = await request.json()
      
      if (!userId || !body.productId) {
        return handleCORS(NextResponse.json(
          { error: "User ID and Product ID are required" }, 
          { status: 400 }
        ))
      }

      const wishlist = await db.collection('wishlists').findOne({ user_id: userId })
      
      if (!wishlist) {
        return handleCORS(NextResponse.json(
          { error: "Wishlist not found" }, 
          { status: 404 }
        ))
      }

      const existingItem = wishlist.items.find(item => item.productId === body.productId)
      
      if (existingItem) {
        return handleCORS(NextResponse.json(
          { error: "Product already in wishlist" }, 
          { status: 400 }
        ))
      }

      const newItem = {
        id: uuidv4(),
        productId: body.productId,
        name: body.name,
        price: body.price,
        image: body.image,
        added_at: new Date().toISOString()
      }

      await db.collection('wishlists').updateOne(
        { user_id: userId },
        { 
          $push: { items: newItem },
          $set: { updated_at: new Date().toISOString() }
        }
      )

      return handleCORS(NextResponse.json({
        message: "Product added to wishlist",
        item: newItem,
        status: "success"
      }))
    }

    // Wishlist Remove
    if (route.match(/^\/wishlist\/[^/]+\/remove\/[^/]+$/) && method === 'DELETE') {
      const pathParts = route.split('/')
      const userId = pathParts[2]
      const productId = pathParts[4]
      
      if (!userId || !productId) {
        return handleCORS(NextResponse.json(
          { error: "User ID and Product ID are required" }, 
          { status: 400 }
        ))
      }

      await db.collection('wishlists').updateOne(
        { user_id: userId },
        { 
          $pull: { items: { productId: productId } },
          $set: { updated_at: new Date().toISOString() }
        }
      )

      return handleCORS(NextResponse.json({
        message: "Product removed from wishlist",
        status: "success"
      }))
    }

    // Users GET
    if (route.startsWith('/users/') && method === 'GET') {
      const userId = route.split('/')[2]
      
      if (!userId) {
        return handleCORS(NextResponse.json(
          { error: "User ID is required" }, 
          { status: 400 }
        ))
      }

      const user = await db.collection('users').findOne({ id: userId })
      
      if (!user) {
        return handleCORS(NextResponse.json(
          { error: "User not found" }, 
          { status: 404 }
        ))
      }

      const { password, _id, ...userProfile } = user

      return handleCORS(NextResponse.json({
        user: userProfile,
        status: "success"
      }))
    }

    // Users Update
    if (route.startsWith('/users/') && method === 'PUT') {
      const userId = route.split('/')[2]
      const body = await request.json()
      
      if (!userId) {
        return handleCORS(NextResponse.json(
          { error: "User ID is required" }, 
          { status: 400 }
        ))
      }

      const updateData = {
        updated_at: new Date().toISOString()
      }

      if (body.name) updateData.name = body.name
      if (body.age) updateData.age = parseInt(body.age)
      if (body.address) updateData.address = body.address

      await db.collection('users').updateOne(
        { id: userId },
        { $set: updateData }
      )

      return handleCORS(NextResponse.json({
        message: "Profile updated successfully",
        status: "success"
      }))
    }

    // User Orders
    if (route.match(/^\/orders\/user\/[^/]+$/) && method === 'GET') {
      const userId = route.split('/')[3]
      
      if (!userId) {
        return handleCORS(NextResponse.json(
          { error: "User ID is required" }, 
          { status: 400 }
        ))
      }
    
      const orders = await db.collection('payments')
        .find({ user_id: userId })
        .sort({ created_at: -1 })
        .toArray()
    
      const formattedOrders = orders.map(({ _id, ...order }) => ({
        id: order.id,
        razorpay_order_id: order.razorpay_order_id,
        items: order.items || [],
        total_amount: order.amount,
        status: order.status,
        shipping_address: order.shipping_address,
        created_at: order.created_at,
        completed_at: order.completed_at
      }))
    
      return handleCORS(NextResponse.json({
        orders: formattedOrders,
        total: formattedOrders.length,
        status: "success"
      }))
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

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
