import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // Root
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({
        message: "Hygena API running"
      }))
    }

    // ---------------- PRODUCTS ----------------
    if (route === '/products' && method === 'GET') {
      const products = [{
        id: 1,
        name: "Hygena Helmet Deodorant",
        price: 599,
        originalPrice: 999,
        inStock: true
      }]

      return handleCORS(NextResponse.json({ products }))
    }

    // ---------------- ORDERS (manual only, not Razorpay) ----------------
    if (route === '/orders' && method === 'POST') {
      const body = await request.json()

      const order = {
        id: uuidv4(),
        ...body,
        status: "pending",
        created_at: new Date().toISOString()
      }

      await db.collection('orders').insertOne(order)

      return handleCORS(NextResponse.json(order))
    }

    if (route === '/orders' && method === 'GET') {
      const orders = await db.collection('orders').find({}).toArray()
      return handleCORS(NextResponse.json(orders))
    }

    // ---------------- NEWSLETTER ----------------
    if (route === '/newsletter' && method === 'POST') {
      const body = await request.json()

      await db.collection('newsletter_subscriptions').insertOne({
        id: uuidv4(),
        email: body.email,
        created_at: new Date().toISOString()
      })

      return handleCORS(NextResponse.json({ success: true }))
    }

    // ---------------- CONTACT ----------------
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()

      await db.collection('contact_messages').insertOne({
        id: uuidv4(),
        ...body,
        created_at: new Date().toISOString()
      })

      return handleCORS(NextResponse.json({ success: true }))
    }

    // ---------------- REGISTER ----------------
    if (route === '/register' && method === 'POST') {
      const body = await request.json()

      const hashedPassword = await bcrypt.hash(body.password, 12)

      await db.collection('users').insertOne({
        id: uuidv4(),
        name: body.name,
        email: body.email,
        password: hashedPassword
      })

      return handleCORS(NextResponse.json({ success: true }))
    }

    return handleCORS(
      NextResponse.json({ error: `Route ${route} not found` }, { status: 404 })
    )

  } catch (error) {
    return handleCORS(
      NextResponse.json({ error: error.message }, { status: 500 })
    )
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
