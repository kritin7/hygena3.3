import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

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

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const db = await connectToMongo()
          const user = await db.collection('users').findOne({ 
            email: credentials.email 
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image || null
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const db = await connectToMongo()
        
        // Check if user exists
        const existingUser = await db.collection('users').findOne({ 
          email: user.email 
        })

        if (!existingUser) {
          // Create new user
          const newUser = {
            id: uuidv4(),
            name: user.name,
            email: user.email,
            image: user.image,
            provider: account.provider,
            age: null,
            address: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          await db.collection('users').insertOne(newUser)
          
          // Create empty wishlist for new user
          await db.collection('wishlists').insertOne({
            id: uuidv4(),
            user_id: newUser.id,
            items: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        } else {
          // Update existing user info
          await db.collection('users').updateOne(
            { email: user.email },
            { 
              $set: { 
                name: user.name,
                image: user.image,
                updated_at: new Date().toISOString()
              } 
            }
          )
        }

        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return false
      }
    },
    async session({ session, token }) {
      if (session?.user?.email) {
        try {
          const db = await connectToMongo()
          const user = await db.collection('users').findOne({ 
            email: session.user.email 
          })
          
          if (user) {
            session.user.id = user.id
            session.user.age = user.age
            session.user.address = user.address
          }
        } catch (error) {
          console.error('Session callback error:', error)
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  session: {
    strategy: 'jwt'
  }
})

export { handler as GET, handler as POST }