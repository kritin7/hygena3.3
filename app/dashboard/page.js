'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { User, Heart, ShoppingBag, Settings, LogOut, Package, Calendar, MapPin, Mail, Edit } from 'lucide-react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [userProfile, setUserProfile] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchUserData()
  }, [session, status])

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      if (session?.user?.id) {
        const profileRes = await fetch(`/api/users/${session.user.id}`)
        if (profileRes.ok) {
          const profileData = await profileRes.json()
          setUserProfile(profileData.user)
        }

        // Fetch wishlist
        const wishlistRes = await fetch(`/api/wishlist/${session.user.id}`)
        if (wishlistRes.ok) {
          const wishlistData = await wishlistRes.json()
          setWishlist(wishlistData.wishlist.items || [])
        }

        // Fetch orders (you can implement this endpoint)
        const ordersRes = await fetch(`/api/orders/user/${session.user.id}`)
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          setOrders(ordersData.orders || [])
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D2691E]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="font-bold text-2xl text-[#D2691E]">Hygena</div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  ← Back to Shop
                </Button>
              </Link>
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-[#D2691E] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <CardTitle className="text-lg">{session.user.name}</CardTitle>
                <CardDescription>{session.user.email}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <Button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeTab === tab.id 
                          ? 'bg-[#D2691E] text-white' 
                          : 'text-gray-700 hover:text-[#D2691E]'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back, {session.user.name}! 👋
                  </h1>
                  <p className="text-gray-600">
                    Here's what's happening with your Hygena account
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Package className="w-5 h-5 mr-2 text-[#D2691E]" />
                        Total Orders
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-[#D2691E]">{orders.length}</div>
                      <p className="text-sm text-gray-600">Lifetime orders</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-red-500" />
                        Wishlist Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-500">{wishlist.length}</div>
                      <p className="text-sm text-gray-600">Saved for later</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-green-600" />
                        Member Since
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-bold text-green-600">
                        {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recently'}
                      </div>
                      <p className="text-sm text-gray-600">Join date</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Things you can do right now</CardDescription>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    <Link href="/#shop">
                      <Button className="w-full bg-[#D2691E] text-white hover:bg-[#8B4513]">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => setActiveTab('wishlist')}
                      variant="outline"
                      className="w-full"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      View Wishlist
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Order History</h1>
                  <p className="text-gray-600">Track and manage your Hygena orders</p>
                </div>

                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">
                        Start your journey with India's first helmet deodorant
                      </p>
                      <Link href="/#shop">
                        <Button className="bg-[#D2691E] text-white hover:bg-[#8B4513]">
                          Shop Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                              <CardDescription>
                                Placed on {new Date(order.created_at).toLocaleDateString('en-IN')}
                              </CardDescription>
                            </div>
                            <Badge className={`${
                              order.status === 'completed' ? 'bg-green-500' :
                              order.status === 'pending' ? 'bg-yellow-500' :
                              'bg-red-500'
                            } text-white`}>
                              {order.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="font-semibold text-[#D2691E]">₹{order.total_amount}</p>
                          <p className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                  <p className="text-gray-600">Products you've saved for later</p>
                </div>

                {wishlist.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-6">
                        Save products you love to buy them later
                      </p>
                      <Link href="/#shop">
                        <Button className="bg-[#D2691E] text-white hover:bg-[#8B4513]">
                          Browse Products
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <div className="text-2xl font-bold text-[#D2691E]">₹{item.price}</div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Button className="flex-1 bg-[#D2691E] text-white hover:bg-[#8B4513]">
                              Add to Cart
                            </Button>
                            <Button variant="outline" size="sm">
                              <Heart className="w-4 h-4 fill-current text-red-500" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
                  <p className="text-gray-600">Manage your account information</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="flex items-center">
                          <span className="text-gray-900">{session.user.name}</span>
                          <Button variant="ghost" size="sm" className="ml-2">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-900">{session.user.email}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>
                        <div className="flex items-center">
                          <span className="text-gray-900">
                            {userProfile?.age || 'Not specified'}
                          </span>
                          <Button variant="ghost" size="sm" className="ml-2">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-900">
                            {userProfile?.address || 'Not specified'}
                          </span>
                          <Button variant="ghost" size="sm" className="ml-2">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button className="bg-[#D2691E] text-white hover:bg-[#8B4513]">
                        Update Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}