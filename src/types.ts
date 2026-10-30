export type StockLevel = 'high' | 'low' | 'none'
export type ProductStatus = 'approved' | 'pending'

export interface Product {
  id: string
  catalogId: string       // groups same product across multiple stores
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  barcode?: string
  status: ProductStatus
  store: Store
  stock: number
  available: boolean
  stockLevel: StockLevel
  stockUpdatedAt: string
  onSale?: boolean
  salePrice?: number
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
  description?: string
  photos?: string[]
}

export interface Reservation {
  id: string
  product: Product
  reservedAt: string
  expiresAt: string
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
  stockUpdatedAt: string
  onSale?: boolean
  salePrice?: number
  status: ProductStatus
}

// Saved search area (user-defined geographic zone)
export interface SearchArea {
  id: string
  label: string
  lat: number
  lng: number
  radiusKm: number
}
