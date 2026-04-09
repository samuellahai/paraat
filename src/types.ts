export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  barcode?: string
  store: Store
  stock: number
  available: boolean
}

export interface Store {
  id: string
  name: string
  address: string
  city: string
  lat: number
  lng: number
  phone?: string
  openingHours: string
}

export interface Reservation {
  id: string
  product: Product
  reservedAt: string
  expiresAt: string
  fee: number
  customerName: string
  customerEmail: string
  status: 'active' | 'redeemed' | 'expired'
}

export interface DashboardProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  barcode: string
  imageUrl: string
}
