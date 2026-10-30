import type { Product, Store } from '../types'

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3_600_000).toISOString()

export function formatStockAge(isoStr: string): string {
  const diffH = Math.floor((Date.now() - new Date(isoStr).getTime()) / 3_600_000)
  if (diffH < 1) return 'vor wenigen Minuten'
  if (diffH === 1) return 'vor 1 Stunde'
  if (diffH < 24) return `vor ${diffH} Stunden`
  const d = Math.floor(diffH / 24)
  return d === 1 ? 'vor 1 Tag' : `vor ${d} Tagen`
}

export const stores: Store[] = [
  {
    id: 's1',
    name: 'Pedalwerk',
    address: 'Lister Meile 12',
    city: 'Hannover',
    lat: 52.3851,
    lng: 9.7432,
    phone: '+49 511 123456',
    openingHours: 'Mo–Fr 10–19 Uhr, Sa 10–17 Uhr',
    description: 'Fahrradladen mit Reparaturwerkstatt im Herzen der List. Hier findest du Zubehör, Ersatzteile und alles rund ums Rad.',
    photos: [
      'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=600&q=80',
      'https://images.unsplash.com/photo-1558981285-6f0c8c3dc89e?w=600&q=80',
    ],
  },
  {
    id: 's2',
    name: 'Sporthaus am Kröpcke',
    address: 'Georgstraße 31',
    city: 'Hannover',
    lat: 52.3740,
    lng: 9.7395,
    phone: '+49 511 654321',
    openingHours: 'Mo–Sa 9–20 Uhr',
    description: 'Drei Etagen Sport auf bester Lage. Laufschuhe, Outdoor, Fitness — alles unter einem Dach.',
    photos: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    ],
  },
  {
    id: 's3',
    name: 'Backstube Lindemann',
    address: 'Limmerstraße 45',
    city: 'Hannover',
    lat: 52.3706,
    lng: 9.7089,
    phone: '+49 511 789012',
    openingHours: 'Mo–Fr 6–18 Uhr, Sa–So 6–14 Uhr',
    description: 'Traditionelle Handwerksbäckerei seit 1987. Jeden Morgen frisch aus dem Steinofen.',
    photos: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
    ],
  },
  {
    id: 's4',
    name: 'Naturkost Eilenriede',
    address: 'Klagesmarkt 8',
    city: 'Hannover',
    lat: 52.3817,
    lng: 9.7340,
    phone: '+49 511 345678',
    openingHours: 'Mo–Sa 8–20 Uhr',
    description: 'Bio-Supermarkt am Klagesmarkt. Regionale Erzeuger, faire Preise, kein Schnickschnack.',
    photos: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
      'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=600&q=80',
    ],
  },
  {
    id: 's5',
    name: 'Küche & Co.',
    address: 'Marktstraße 17',
    city: 'Hannover',
    lat: 52.3749,
    lng: 9.7297,
    phone: '+49 511 901234',
    openingHours: 'Mo–Fr 10–18 Uhr, Sa 10–16 Uhr',
    description: 'Haushaltsgeräte, Kochzubehör und Geschenke in der Altstadt. Kleine Auswahl, große Qualität.',
    photos: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
    ],
  },
]

export const products: Product[] = [
  // ── Pedalwerk (s1) ──────────────────────────────────────────────────
  {
    id: 'p1', catalogId: 'c1',
    name: 'Fahrradschloss Kryptonite U-Lock',
    description: 'Bügelschloss, gehärteter Stahl, inkl. Halterung',
    price: 49.99, category: 'Fahrrad',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    barcode: '4011905120330', status: 'approved',
    store: stores[0]!, stock: 4, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(2),
  },
  {
    id: 'p2', catalogId: 'c2',
    name: 'Fahrradhelm Uvex City 4',
    description: 'Stadthelm, belüftet, LED-Rücklicht, Gr. S–XL',
    price: 79.95, category: 'Fahrrad',
    imageUrl: 'https://images.unsplash.com/photo-1576768267175-5a0aef7bf1b2?w=400&q=80',
    barcode: '4043197301129', status: 'approved',
    store: stores[0]!, stock: 8, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(5),
  },
  {
    id: 'p3', catalogId: 'c3',
    name: 'Reparaturset Fahrrad 16-tlg.',
    description: 'Flickzeug, Reifenheber, Minipumpe, Inbusschlüssel',
    price: 14.99, category: 'Fahrrad',
    imageUrl: 'https://images.unsplash.com/photo-1609209869034-fdb7be90f48b?w=400&q=80',
    barcode: '4011905199001', status: 'approved',
    store: stores[0]!, stock: 15, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(1),
  },
  // Trinkflasche Nalgene — auch bei Pedalwerk (Radfahrer brauchen Wasserflaschen)
  {
    id: 'p6', catalogId: 'c6',
    name: 'Trinkflasche Nalgene 1L',
    description: 'BPA-frei, bruchsicher, Weithals, spülmaschinenfest',
    price: 13.99, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    barcode: '0661195020025', status: 'approved',
    store: stores[0]!, stock: 5, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(3),
  },

  // ── Sporthaus am Kröpcke (s2) ────────────────────────────────────────
  {
    id: 'p4', catalogId: 'c4',
    name: 'Laufschuhe Brooks Ghost 16',
    description: 'Neutral-Laufschuh, Gr. 38–47, gedämpfte Zwischensohle',
    price: 139.95, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    barcode: '0190341234501', status: 'approved',
    store: stores[1]!, stock: 2, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(3),
  },
  {
    id: 'p5', catalogId: 'c5',
    name: 'Yoga-Matte Casall 4mm',
    description: 'Rutschfest, inkl. Tragegurt, Farben: schwarz/sand',
    price: 54.00, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400&q=80',
    barcode: '5704010123456', status: 'approved',
    store: stores[1]!, stock: 6, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(4),
  },
  // Trinkflasche Nalgene — auch bei Sporthaus, aber ausverkauft
  {
    id: 'p6b', catalogId: 'c6',
    name: 'Trinkflasche Nalgene 1L',
    description: 'BPA-frei, bruchsicher, Weithals, spülmaschinenfest',
    price: 12.99, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    barcode: '0661195020025', status: 'approved',
    store: stores[1]!, stock: 0, available: false, stockLevel: 'none', stockUpdatedAt: hoursAgo(6),
  },

  // ── Backstube Lindemann (s3) ─────────────────────────────────────────
  {
    id: 'p7', catalogId: 'c7',
    name: 'Roggenmischbrot 750g',
    description: 'Sauerteig, Steinofen, täglich frisch gebacken',
    price: 4.20, category: 'Backwaren',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
    barcode: '2001234000010', status: 'approved',
    store: stores[2]!, stock: 9, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(1),
  },
  {
    id: 'p8', catalogId: 'c8',
    name: 'Buttercroissant 3er-Pack',
    description: 'Feine Butterblätterteigteilchen, noch warm',
    price: 3.60, category: 'Backwaren',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
    barcode: '2001234000027', status: 'approved',
    store: stores[2]!, stock: 3, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(0),
    onSale: true, salePrice: 2.90,
  },
  {
    id: 'p9', catalogId: 'c9',
    name: 'Dinkelbrötchen 6er-Pack',
    description: 'Aus vollem Dinkelkorn, knusprige Kruste',
    price: 3.00, category: 'Backwaren',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80',
    barcode: '2001234000034', status: 'approved',
    store: stores[2]!, stock: 0, available: false, stockLevel: 'none', stockUpdatedAt: hoursAgo(2),
  },

  // ── Naturkost Eilenriede (s4) ────────────────────────────────────────
  {
    id: 'p10', catalogId: 'c10',
    name: 'Bio-Äpfel Elstar 1 kg',
    description: 'Aus der Region Hannover, unbehandelt',
    price: 2.99, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80',
    barcode: '4012345000112', status: 'approved',
    store: stores[3]!, stock: 20, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(3),
  },
  {
    id: 'p11', catalogId: 'c11',
    name: 'Hafermilch Oatly Barista 1L',
    description: 'Aufschäumbar, ohne Zuckerzusatz',
    price: 1.99, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=400&q=80',
    barcode: '7394376616304', status: 'approved',
    store: stores[3]!, stock: 5, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(1),
    onSale: true, salePrice: 1.49,
  },
  {
    id: 'p12', catalogId: 'c12',
    name: 'Bio-Granola Erdnuss & Schokolade',
    description: 'Vegan, 350g, ohne raffinierten Zucker',
    price: 5.49, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=400&q=80',
    barcode: '4006381333948', status: 'approved',
    store: stores[3]!, stock: 11, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(4),
  },
  // Hafermilch — auch bei Küche & Co. (für Kochkurse / Demos)
  {
    id: 'p11b', catalogId: 'c11',
    name: 'Hafermilch Oatly Barista 1L',
    description: 'Aufschäumbar, ohne Zuckerzusatz',
    price: 2.19, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=400&q=80',
    barcode: '7394376616304', status: 'approved',
    store: stores[4]!, stock: 8, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(2),
  },

  // ── Küche & Co. (s5) ────────────────────────────────────────────────
  {
    id: 'p13', catalogId: 'c13',
    name: 'Gusseisenpfanne Lodge 26 cm',
    description: 'Voreingeseasoned, Induktion geeignet, für Herd & Ofen',
    price: 34.95, category: 'Haushalt',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    barcode: '0078725000339', status: 'approved',
    store: stores[4]!, stock: 3, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(8),
  },
  {
    id: 'p14', catalogId: 'c14',
    name: 'Messerblock Wüsthof Classic 5-teilig',
    description: 'Kochmesser, Brotmesser, Schälmesser + Schleifstab',
    price: 189.00, category: 'Haushalt',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80',
    barcode: '4009880024462', status: 'approved',
    store: stores[4]!, stock: 1, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(12),
  },
  {
    id: 'p15', catalogId: 'c15',
    name: 'Schneidebrett Bambus 40×25 cm',
    description: 'Antibakteriell, mit Saftrille, beidseitig nutzbar',
    price: 19.95, category: 'Haushalt',
    imageUrl: 'https://images.unsplash.com/photo-1584990347449-39d16b56b2c4?w=400&q=80',
    barcode: '4251234500018', status: 'approved',
    store: stores[4]!, stock: 7, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(6),
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

/** All store listings for a given catalogId */
export function getProductVariants(catalogId: string): Product[] {
  return products.filter((p) => p.catalogId === catalogId)
}

/** Cheapest available price across all listings of a catalogId */
export function getMinPrice(catalogId: string): number | null {
  const variants = getProductVariants(catalogId).filter((p) => p.available && p.stock > 0)
  if (variants.length === 0) return null
  return Math.min(...variants.map((p) => (p.onSale && p.salePrice != null ? p.salePrice : p.price)))
}

/**
 * Deduplicated product list for home sheet.
 * Returns one entry per catalogId, with minPrice + closest available store.
 */
export function getUniqueProducts(
  userLat: number,
  userLng: number,
  storeFilter?: string | null,
  categoryFilter?: string,
  query?: string,
): Array<{ catalogId: string; product: Product; minPrice: number | null; storeCount: number }> {
  let filtered = products.filter((p) => p.status === 'approved')

  if (storeFilter) filtered = filtered.filter((p) => p.store.id === storeFilter)
  if (categoryFilter && categoryFilter !== 'Alle') filtered = filtered.filter((p) => p.category === categoryFilter)
  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.store.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }

  // When a store filter is active, show each product individually (with store-specific price)
  if (storeFilter) {
    return filtered.map((p) => ({
      catalogId: p.catalogId,
      product: p,
      minPrice: p.onSale && p.salePrice != null ? p.salePrice : p.price,
      storeCount: 1,
    }))
  }

  // Without store filter: deduplicate by catalogId, show cheapest nearby
  const seen = new Map<string, { catalogId: string; product: Product; minPrice: number | null; storeCount: number }>()
  for (const p of filtered) {
    const existing = seen.get(p.catalogId)
    const thisPrice = p.onSale && p.salePrice != null ? p.salePrice : p.price
    const thisDist = getDistance(userLat, userLng, p.store.lat, p.store.lng)

    if (!existing) {
      seen.set(p.catalogId, {
        catalogId: p.catalogId,
        product: p,
        minPrice: p.available && p.stock > 0 ? thisPrice : null,
        storeCount: 1,
      })
    } else {
      const existingDist = getDistance(userLat, userLng, existing.product.store.lat, existing.product.store.lng)
      // Update closest store reference
      if (thisDist < existingDist) existing.product = p
      // Update min price
      if (p.available && p.stock > 0) {
        existing.minPrice = existing.minPrice === null ? thisPrice : Math.min(existing.minPrice, thisPrice)
      }
      existing.storeCount++
    }
  }

  return Array.from(seen.values())
}
