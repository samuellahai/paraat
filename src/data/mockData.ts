import type { Product, Store } from '../types'

export const stores: Store[] = [
  {
    id: 's1',
    name: 'Bio-Markt Grünzeug',
    address: 'Schönhauser Allee 12',
    city: 'Berlin',
    lat: 52.5402,
    lng: 13.4141,
    phone: '+49 30 1234567',
    openingHours: 'Mo–Sa 8–20 Uhr',
  },
  {
    id: 's2',
    name: 'Elektro König',
    address: 'Berliner Str. 45',
    city: 'Berlin',
    lat: 52.5320,
    lng: 13.4050,
    phone: '+49 30 9876543',
    openingHours: 'Mo–Fr 9–18 Uhr, Sa 10–16 Uhr',
  },
  {
    id: 's3',
    name: 'Mode & Stil Boutique',
    address: 'Kastanienallee 78',
    city: 'Berlin',
    lat: 52.5380,
    lng: 13.4080,
    phone: '+49 30 5556677',
    openingHours: 'Mo–Sa 10–19 Uhr',
  },
  {
    id: 's4',
    name: 'Bäckerei Vollkorn',
    address: 'Prenzlauer Berg 3',
    city: 'Berlin',
    lat: 52.5350,
    lng: 13.4200,
    phone: '+49 30 3334455',
    openingHours: 'Mo–So 6–18 Uhr',
  },
  {
    id: 's5',
    name: 'Sport & Outdoor Depot',
    address: 'Danziger Str. 22',
    city: 'Berlin',
    lat: 52.5430,
    lng: 13.4250,
    phone: '+49 30 7778899',
    openingHours: 'Mo–Sa 9–20 Uhr',
  },
]

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Bio-Apfelsaft 1L',
    description: 'Frisch gepresster Apfelsaft aus regionalem Anbau, ungefiltert',
    price: 3.49,
    category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80',
    barcode: '4012345678901',
    store: stores[0]!,
    stock: 12,
    available: true,
  },
  {
    id: 'p2',
    name: 'Kopfhörer Sony WH-1000XM5',
    description: 'Kabellose Noise-Cancelling Kopfhörer, bis zu 30h Akku',
    price: 279.99,
    category: 'Elektronik',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    barcode: '4901660196498',
    store: stores[1]!,
    stock: 3,
    available: true,
  },
  {
    id: 'p3',
    name: 'Leinenjacke Natur',
    description: '100% Leinen, nachhaltig produziert, Größen S–XL verfügbar',
    price: 89.95,
    category: 'Mode',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80',
    barcode: '3614273325820',
    store: stores[2]!,
    stock: 7,
    available: true,
  },
  {
    id: 'p4',
    name: 'Sauerteigbrot Dinkel',
    description: 'Traditionell gebacken, 500g, täglich frisch',
    price: 4.80,
    category: 'Backwaren',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
    barcode: '2012345000015',
    store: stores[3]!,
    stock: 5,
    available: true,
  },
  {
    id: 'p5',
    name: 'Trailrunning-Schuhe',
    description: 'Wasserdicht, Grip-Sohle, ideal für Gelände und Asphalt',
    price: 129.00,
    category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    barcode: '5060289070015',
    store: stores[4]!,
    stock: 2,
    available: true,
  },
  {
    id: 'p6',
    name: 'Bio-Granola Beeren',
    description: 'Glutenfrei, ohne Zuckerzusatz, 400g',
    price: 5.99,
    category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=400&q=80',
    barcode: '4006381333931',
    store: stores[0]!,
    stock: 0,
    available: false,
  },
  {
    id: 'p7',
    name: 'USB-C Ladekabel 2m',
    description: 'Schnellladekabel 100W, geflochten, kompatibel mit allen Geräten',
    price: 19.99,
    category: 'Elektronik',
    imageUrl: 'https://images.unsplash.com/photo-1618492688-54b9823a7a53?w=400&q=80',
    barcode: '4260123456789',
    store: stores[1]!,
    stock: 25,
    available: true,
  },
  {
    id: 'p8',
    name: 'Yoga-Matte Premium',
    description: '6mm dick, rutschfest, inkl. Tragetasche',
    price: 45.00,
    category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400&q=80',
    barcode: '5060289070022',
    store: stores[4]!,
    stock: 8,
    available: true,
  },
]

export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}
