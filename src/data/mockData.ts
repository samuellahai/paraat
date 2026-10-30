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
  // s1 — Pedalwerk (Fahrrad)
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
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    ],
  },
  // s2 — Sporthaus am Kröpcke
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
  // s3 — Backstube Lindemann
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
  // s4 — Naturkost Eilenriede (Bio-Supermarkt)
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
  // s5 — Küche & Co.
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
  // s6 — Laufladen Hannover (Lauf-Spezialgeschäft)
  {
    id: 's6',
    name: 'Laufladen Hannover',
    address: 'Vahrenwalder Str. 15',
    city: 'Hannover',
    lat: 52.3900,
    lng: 9.7210,
    phone: '+49 511 556677',
    openingHours: 'Mo–Fr 10–19 Uhr, Sa 10–17 Uhr',
    description: 'Spezialisiertes Laufgeschäft mit Laufanalyse vor Ort. Wir helfen dir, den richtigen Schuh zu finden.',
    photos: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80',
    ],
  },
  // s7 — Elektro Weber
  {
    id: 's7',
    name: 'Elektro Weber',
    address: 'Ständehausstr. 2',
    city: 'Hannover',
    lat: 52.3690,
    lng: 9.7360,
    phone: '+49 511 223344',
    openingHours: 'Mo–Fr 10–18 Uhr, Sa 10–16 Uhr',
    description: 'Kleines Elektronikgeschäft mit persönlicher Beratung. Kopfhörer, Kabel, Gadgets — kein Versandhandel.',
    photos: [
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    ],
  },
  // s8 — Biomarkt Kleeblatt (zweiter Bio-Laden, Südstadt)
  {
    id: 's8',
    name: 'Biomarkt Kleeblatt',
    address: 'Calenberger Str. 8',
    city: 'Hannover',
    lat: 52.3650,
    lng: 9.7280,
    phone: '+49 511 667788',
    openingHours: 'Mo–Sa 8–19 Uhr',
    description: 'Bio-Laden in der Südstadt. Schwerpunkt auf veganen Produkten und Unverpacktem.',
    photos: [
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
    ],
  },
  // s9 — Boutique am Maschsee (Mode)
  {
    id: 's9',
    name: 'Boutique am Maschsee',
    address: 'Maschstr. 12',
    city: 'Hannover',
    lat: 52.3580,
    lng: 9.7350,
    phone: '+49 511 334455',
    openingHours: 'Di–Fr 11–19 Uhr, Sa 11–17 Uhr',
    description: 'Kleine Modeboutique mit kuratierter Auswahl. Nachhaltige Labels und zeitlose Stücke.',
    photos: [
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80',
    ],
  },
]

export const products: Product[] = [

  // ═══════════════════════════════════════════════════════════════
  // PEDALWERK (s1) — Fahrrad + Zubehör
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'p1', catalogId: 'c1',
    name: 'Fahrradschloss Kryptonite U-Lock',
    description: 'Bügelschloss aus gehärtetem Stahl, inkl. Lenkerhalterung. Sicherheitslevel 9/10.',
    price: 49.99, category: 'Fahrrad',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    barcode: '4011905120330', status: 'approved',
    store: stores[0]!, stock: 4, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(2),
  },
  {
    id: 'p2', catalogId: 'c2',
    name: 'Fahrradhelm Uvex City 4',
    description: 'Stadthelm mit integriertem LED-Rücklicht, 14 Belüftungskanäle, Gr. S–XL.',
    price: 79.95, category: 'Fahrrad',
    imageUrl: 'https://images.unsplash.com/photo-1576768267175-5a0aef7bf1b2?w=400&q=80',
    barcode: '4043197301129', status: 'approved',
    store: stores[0]!, stock: 8, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(5),
  },
  {
    id: 'p3', catalogId: 'c3',
    name: 'Reparaturset Fahrrad 16-tlg.',
    description: 'Flickzeug, Reifenheber, Minipumpe, Inbusschlüssel — alles für den Pannenfall.',
    price: 14.99, category: 'Fahrrad',
    imageUrl: 'https://images.unsplash.com/photo-1609209869034-fdb7be90f48b?w=400&q=80',
    barcode: '4011905199001', status: 'approved',
    store: stores[0]!, stock: 15, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(1),
  },
  {
    id: 'p6', catalogId: 'c6',
    name: 'Trinkflasche Nalgene 1L',
    description: 'BPA-frei, bruchsicher, Weithals, spülmaschinenfest. Ideal für Rad & Outdoor.',
    price: 13.99, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    barcode: '0661195020025', status: 'approved',
    store: stores[0]!, stock: 5, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(3),
  },
  {
    id: 'p16', catalogId: 'c16',
    name: 'Fahrradbeleuchtung Set Busch & Müller',
    description: 'Front- und Rücklicht, StVZO-zugelassen, USB-aufladbar, bis 80 Lux.',
    price: 39.90, category: 'Fahrrad',
    imageUrl: 'https://images.unsplash.com/photo-1558981285-6f0c8c3dc89e?w=400&q=80',
    barcode: '4002467116003', status: 'approved',
    store: stores[0]!, stock: 7, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(4),
  },
  {
    id: 'p17', catalogId: 'c17',
    name: 'Fahrradpumpe Lezyne Alloy Drive',
    description: 'Standpumpe aus Aluminium, Manometer bis 170 psi, Presta & Schrader.',
    price: 44.95, category: 'Fahrrad',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    barcode: '4712805979237', status: 'approved',
    store: stores[0]!, stock: 3, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(6),
  },
  {
    id: 'p18', catalogId: 'c18',
    name: 'Packtasche Ortlieb Back-Roller 40L',
    description: 'Wasserdicht, Rolltop-Verschluss, je 20L pro Tasche, für alle Gepäckträger.',
    price: 109.95, category: 'Fahrrad',
    imageUrl: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=400&q=80',
    barcode: '4013051003483', status: 'approved',
    store: stores[0]!, stock: 2, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(24),
  },
  {
    id: 'p19', catalogId: 'c19',
    name: 'Fahrradkette Shimano CN-HG601',
    description: '11-fach, 116 Glieder, Hyperglide, inkl. Quick-Link.',
    price: 17.50, category: 'Fahrrad',
    imageUrl: 'https://images.unsplash.com/photo-1609209869034-fdb7be90f48b?w=400&q=80',
    barcode: '4550170213336', status: 'approved',
    store: stores[0]!, stock: 12, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(2),
  },
  {
    id: 'p20', catalogId: 'c20',
    name: 'Sattelstütze Ergon CF3 Pro Carbon',
    description: 'Carbon, 27,2 mm, Flex-Technologie für mehr Komfort, 240g.',
    price: 129.00, category: 'Fahrrad',
    imageUrl: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=400&q=80',
    barcode: '4260477073458', status: 'approved',
    store: stores[0]!, stock: 1, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(48),
  },

  // ═══════════════════════════════════════════════════════════════
  // SPORTHAUS AM KRÖPCKE (s2) — Sport & Fitness
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'p4', catalogId: 'c4',
    name: 'Laufschuhe Brooks Ghost 16',
    description: 'Neutraler Laufschuh mit DNA Loft v2 Dämpfung, Gr. 38–47, für Alltag & Training.',
    price: 139.95, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    barcode: '0190341234501', status: 'approved',
    store: stores[1]!, stock: 5, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(3),
  },
  {
    id: 'p5', catalogId: 'c5',
    name: 'Yoga-Matte Casall PRO 4mm',
    description: 'Rutschfest, inkl. Tragegurt, Farben: schwarz/sand, recyceltes Material.',
    price: 54.00, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400&q=80',
    barcode: '5704010123456', status: 'approved',
    store: stores[1]!, stock: 6, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(4),
  },
  {
    id: 'p6b', catalogId: 'c6',
    name: 'Trinkflasche Nalgene 1L',
    description: 'BPA-frei, bruchsicher, Weithals, spülmaschinenfest.',
    price: 12.99, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    barcode: '0661195020025', status: 'approved',
    store: stores[1]!, stock: 0, available: false, stockLevel: 'none', stockUpdatedAt: hoursAgo(6),
  },
  {
    id: 'p21', catalogId: 'c21',
    name: 'Laufschuhe Nike Air Zoom Pegasus 41',
    description: 'Reaktionsfreudige Dämpfung, Engineered Mesh Obermaterial, Gr. 37–47.',
    price: 129.99, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80',
    barcode: '0195248373889', status: 'approved',
    store: stores[1]!, stock: 3, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(5),
  },
  {
    id: 'p22', catalogId: 'c22',
    name: 'Pulsuhr Garmin Forerunner 165',
    description: 'GPS, AMOLED-Display, 24/7 Herzfrequenz, bis 11 Tage Akku.',
    price: 249.99, category: 'Elektronik',
    imageUrl: 'https://images.unsplash.com/photo-1523475496153-3bbb4fcf3a68?w=400&q=80',
    barcode: '0753759317508', status: 'approved',
    store: stores[1]!, stock: 4, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(12),
  },
  {
    id: 'p23', catalogId: 'c23',
    name: 'Sporttasche Nike Gym Club 24L',
    description: 'Hauptfach + Schuhfach, verstellbarer Schulterriemen, 100% Polyester.',
    price: 34.99, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    barcode: '0195867027590', status: 'approved',
    store: stores[1]!, stock: 9, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(2),
  },
  {
    id: 'p24', catalogId: 'c24',
    name: 'Widerstandsbänder Set 5-tlg.',
    description: 'Latexbänder in 5 Stärken (5–35 kg), für Home-Workout & Reha.',
    price: 22.90, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
    barcode: '4251234500056', status: 'approved',
    store: stores[1]!, stock: 14, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(1),
  },
  {
    id: 'p25', catalogId: 'c25',
    name: 'Adidas Stan Smith Sneaker',
    description: 'Klassischer Lederschuh, Gr. 36–48, weiß/grün — zeitloser Streetstyle.',
    price: 99.95, category: 'Mode',
    imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80',
    barcode: '4066759501874', status: 'approved',
    store: stores[1]!, stock: 7, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(8),
  },

  // ═══════════════════════════════════════════════════════════════
  // BACKSTUBE LINDEMANN (s3) — Backwaren
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'p7', catalogId: 'c7',
    name: 'Roggenmischbrot 750g',
    description: 'Sauerteig, Steinofen, täglich frisch gebacken. Hält 4–5 Tage frisch.',
    price: 4.20, category: 'Backwaren',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
    barcode: '2001234000010', status: 'approved',
    store: stores[2]!, stock: 9, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(1),
  },
  {
    id: 'p8', catalogId: 'c8',
    name: 'Buttercroissant 3er-Pack',
    description: 'Feine Butterblätterteigteilchen, noch warm aus dem Ofen.',
    price: 3.60, category: 'Backwaren',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
    barcode: '2001234000027', status: 'approved',
    store: stores[2]!, stock: 3, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(0),
    onSale: true, salePrice: 2.90,
  },
  {
    id: 'p9', catalogId: 'c9',
    name: 'Dinkelbrötchen 6er-Pack',
    description: 'Aus vollem Dinkelkorn, knusprige Kruste, mild-nussiger Geschmack.',
    price: 3.00, category: 'Backwaren',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80',
    barcode: '2001234000034', status: 'approved',
    store: stores[2]!, stock: 0, available: false, stockLevel: 'none', stockUpdatedAt: hoursAgo(2),
  },
  {
    id: 'p26', catalogId: 'c26',
    name: 'Laugenbrezel groß',
    description: 'Handgeformt, goldbraun, mit grobem Meersalz bestreut.',
    price: 1.20, category: 'Backwaren',
    imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=80',
    barcode: '2001234000041', status: 'approved',
    store: stores[2]!, stock: 16, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(0),
  },
  {
    id: 'p27', catalogId: 'c27',
    name: 'Streuselkuchen 4 Stücke',
    description: 'Hefeteig, buttrige Streusel, pur oder mit Pflaumenfüllung.',
    price: 4.80, category: 'Backwaren',
    imageUrl: 'https://images.unsplash.com/photo-1533910534207-90f31029a78e?w=400&q=80',
    barcode: '2001234000058', status: 'approved',
    store: stores[2]!, stock: 5, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(1),
  },
  {
    id: 'p28', catalogId: 'c28',
    name: 'Bauernkruste Sauerteig 500g',
    description: 'Dunkle Roggen-Weizenmehl-Kombination, lange Teigführung (18h).',
    price: 3.60, category: 'Backwaren',
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400&q=80',
    barcode: '2001234000065', status: 'approved',
    store: stores[2]!, stock: 7, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(0),
  },
  {
    id: 'p29', catalogId: 'c29',
    name: 'Nusszopf 400g',
    description: 'Gefüllt mit Walnüssen und Zimt, ideal zum Frühstück.',
    price: 5.20, category: 'Backwaren',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
    barcode: '2001234000072', status: 'approved',
    store: stores[2]!, stock: 3, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(2),
    onSale: true, salePrice: 3.90,
  },

  // ═══════════════════════════════════════════════════════════════
  // NATURKOST EILENRIEDE (s4) — Lebensmittel Bio
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'p10', catalogId: 'c10',
    name: 'Bio-Äpfel Elstar 1 kg',
    description: 'Aus der Region Hannover, unbehandelt, saftig-süßsäuerlich.',
    price: 2.99, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80',
    barcode: '4012345000112', status: 'approved',
    store: stores[3]!, stock: 20, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(3),
  },
  {
    id: 'p11', catalogId: 'c11',
    name: 'Hafermilch Oatly Barista 1L',
    description: 'Aufschäumbar, ohne Zuckerzusatz, für Kaffee und Müsli.',
    price: 1.99, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=400&q=80',
    barcode: '7394376616304', status: 'approved',
    store: stores[3]!, stock: 5, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(1),
    onSale: true, salePrice: 1.49,
  },
  {
    id: 'p12', catalogId: 'c12',
    name: 'Bio-Granola Erdnuss & Schokolade',
    description: 'Vegan, 350g, ohne raffinierten Zucker, langsam geröstet.',
    price: 5.49, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=400&q=80',
    barcode: '4006381333948', status: 'approved',
    store: stores[3]!, stock: 11, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(4),
  },
  {
    id: 'p30', catalogId: 'c30',
    name: 'Bio-Tofu Natur 400g',
    description: 'Aus deutschen Sojabohnen, fest, geeignet zum Braten & Grillen.',
    price: 2.49, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80',
    barcode: '4104420001001', status: 'approved',
    store: stores[3]!, stock: 8, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(2),
  },
  {
    id: 'p31', catalogId: 'c31',
    name: 'Bio-Olivenöl nativ extra 500ml',
    description: 'Kaltgepresst, fruchtig-mild, aus Kreta, erste Ernte.',
    price: 9.95, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    barcode: '4104420002001', status: 'approved',
    store: stores[3]!, stock: 13, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(5),
  },
  {
    id: 'p32', catalogId: 'c32',
    name: 'Rote Linsen 500g',
    description: 'Bio, geschält, schnell garend, reich an Eiweiß und Eisen.',
    price: 3.20, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400&q=80',
    barcode: '4104420003001', status: 'approved',
    store: stores[3]!, stock: 18, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(6),
  },
  {
    id: 'p33', catalogId: 'c33',
    name: 'Mandel-Drink Alpro 1L',
    description: 'Ungesüßt, nur 13 kcal/100ml, angereichert mit Calcium & Vitamin D.',
    price: 2.29, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    barcode: '5411188110293', status: 'approved',
    store: stores[3]!, stock: 6, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(3),
  },

  // Hafermilch auch bei Küche & Co.
  {
    id: 'p11b', catalogId: 'c11',
    name: 'Hafermilch Oatly Barista 1L',
    description: 'Aufschäumbar, ohne Zuckerzusatz.',
    price: 2.19, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=400&q=80',
    barcode: '7394376616304', status: 'approved',
    store: stores[4]!, stock: 8, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(2),
  },

  // ═══════════════════════════════════════════════════════════════
  // KÜCHE & CO. (s5) — Haushalt & Kochzubehör
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'p13', catalogId: 'c13',
    name: 'Gusseisenpfanne Lodge 26 cm',
    description: 'Voreingeseasoned, Induktion geeignet, für Herd, Ofen & Grill.',
    price: 34.95, category: 'Haushalt',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    barcode: '0078725000339', status: 'approved',
    store: stores[4]!, stock: 3, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(8),
  },
  {
    id: 'p14', catalogId: 'c14',
    name: 'Messerblock Wüsthof Classic 5-tlg.',
    description: 'Kochmesser 20 cm, Brotmesser, Schälmesser + Wetzstab + Block.',
    price: 189.00, category: 'Haushalt',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80',
    barcode: '4009880024462', status: 'approved',
    store: stores[4]!, stock: 1, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(12),
  },
  {
    id: 'p15', catalogId: 'c15',
    name: 'Schneidebrett Bambus 40×25 cm',
    description: 'Antibakteriell, mit Saftrille, beidseitig nutzbar, pflegeleicht.',
    price: 19.95, category: 'Haushalt',
    imageUrl: 'https://images.unsplash.com/photo-1584990347449-39d16b56b2c4?w=400&q=80',
    barcode: '4251234500018', status: 'approved',
    store: stores[4]!, stock: 7, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(6),
  },
  {
    id: 'p34', catalogId: 'c34',
    name: 'Küchenwaage Soehnle Page Compact',
    description: 'Digital, bis 5 kg, 1g-Genauigkeit, Tara-Funktion, flaches Design.',
    price: 24.99, category: 'Haushalt',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80',
    barcode: '4006501650141', status: 'approved',
    store: stores[4]!, stock: 5, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(10),
  },
  {
    id: 'p35', catalogId: 'c35',
    name: 'Wasserkocher WMF Lono 1,6L',
    description: 'Edelstahl, 360°-Standfuß, Kalkfilter, Schnellkochfunktion, 2400W.',
    price: 49.99, category: 'Haushalt',
    imageUrl: 'https://images.unsplash.com/photo-1584269600519-112d071b35e9?w=400&q=80',
    barcode: '4000530573508', status: 'approved',
    store: stores[4]!, stock: 2, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(14),
  },
  {
    id: 'p36', catalogId: 'c36',
    name: 'Glasdosen Set 3-tlg. Weck',
    description: 'Borosilikatglas, mit Deckel & Klammern, 0,5 / 0,75 / 1,0 Liter.',
    price: 18.90, category: 'Haushalt',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    barcode: '4009075065527', status: 'approved',
    store: stores[4]!, stock: 10, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(3),
  },

  // Wasserkocher auch bei Elektro Weber
  {
    id: 'p35b', catalogId: 'c35',
    name: 'Wasserkocher WMF Lono 1,6L',
    description: 'Edelstahl, 360°-Standfuß, Kalkfilter, Schnellkochfunktion, 2400W.',
    price: 46.99, category: 'Haushalt',
    imageUrl: 'https://images.unsplash.com/photo-1584269600519-112d071b35e9?w=400&q=80',
    barcode: '4000530573508', status: 'approved',
    store: stores[6]!, stock: 3, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(20),
  },

  // ═══════════════════════════════════════════════════════════════
  // LAUFLADEN HANNOVER (s6) — Laufschuhe & Running-Zubehör
  // ═══════════════════════════════════════════════════════════════
  // Brooks Ghost 16 — auch hier (Lauf-Spezialist)
  {
    id: 'p4b', catalogId: 'c4',
    name: 'Laufschuhe Brooks Ghost 16',
    description: 'Neutraler Laufschuh mit DNA Loft v2 Dämpfung, Gr. 37–47.',
    price: 134.95, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    barcode: '0190341234501', status: 'approved',
    store: stores[5]!, stock: 8, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(1),
  },
  // Nike Pegasus auch hier
  {
    id: 'p21b', catalogId: 'c21',
    name: 'Laufschuhe Nike Air Zoom Pegasus 41',
    description: 'Reaktionsfreudige Dämpfung, Engineered Mesh Obermaterial, Gr. 36–47.',
    price: 124.99, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80',
    barcode: '0195248373889', status: 'approved',
    store: stores[5]!, stock: 4, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(4),
  },
  {
    id: 'p37', catalogId: 'c37',
    name: 'Laufschuhe On Running Cloudmonster 2',
    description: 'Maximale Dämpfung, CloudTec® Phase-Sohle, Gr. 37–46, für lange Läufe.',
    price: 169.95, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80',
    barcode: '7630340587214', status: 'approved',
    store: stores[5]!, stock: 5, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(2),
  },
  {
    id: 'p38', catalogId: 'c38',
    name: 'Laufschuhe Asics Gel-Kayano 31',
    description: 'Stabilitätsschuh, 4D Guidance System, Gr. 38–47, für Überpronation.',
    price: 159.95, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80',
    barcode: '4550457188601', status: 'approved',
    store: stores[5]!, stock: 3, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(6),
  },
  {
    id: 'p39', catalogId: 'c39',
    name: 'Laufsocken Falke RU5 3er-Pack',
    description: 'Gepolstert, anatomisch, schnell trocknend, Gr. 37–48.',
    price: 26.90, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&q=80',
    barcode: '4043874049191', status: 'approved',
    store: stores[5]!, stock: 15, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(3),
  },
  // Sporttasche auch beim Laufladen
  {
    id: 'p23b', catalogId: 'c23',
    name: 'Sporttasche Nike Gym Club 24L',
    description: 'Hauptfach + Schuhfach, verstellbarer Schulterriemen.',
    price: 32.99, category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    barcode: '0195867027590', status: 'approved',
    store: stores[5]!, stock: 6, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(4),
  },
  // Garmin Uhr auch beim Laufladen
  {
    id: 'p22b', catalogId: 'c22',
    name: 'Pulsuhr Garmin Forerunner 165',
    description: 'GPS, AMOLED-Display, 24/7 Herzfrequenz, Laufanalyse.',
    price: 239.99, category: 'Elektronik',
    imageUrl: 'https://images.unsplash.com/photo-1523475496153-3bbb4fcf3a68?w=400&q=80',
    barcode: '0753759317508', status: 'approved',
    store: stores[5]!, stock: 2, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(8),
  },

  // ═══════════════════════════════════════════════════════════════
  // ELEKTRO WEBER (s7) — Elektronik & Gadgets
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'p40', catalogId: 'c40',
    name: 'Kopfhörer Sony WH-1000XM5',
    description: 'Over-Ear, Active Noise Cancelling, 30h Akku, Bluetooth 5.2, schwarz/silber.',
    price: 299.00, category: 'Elektronik',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    barcode: '4548736133099', status: 'approved',
    store: stores[6]!, stock: 3, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(24),
  },
  {
    id: 'p41', catalogId: 'c41',
    name: 'Powerbank Anker Prime 20.000 mAh',
    description: '65W USB-C PD, lädt Laptop & Handy, Display, 443g.',
    price: 79.99, category: 'Elektronik',
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
    barcode: '0194644037635', status: 'approved',
    store: stores[6]!, stock: 6, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(10),
  },
  {
    id: 'p42', catalogId: 'c42',
    name: 'USB-C Hub 7-in-1 Anker',
    description: '4K HDMI, 100W PD, 2× USB-A, SD-Kartenleser, kompakt.',
    price: 34.99, category: 'Elektronik',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80',
    barcode: '0194644048174', status: 'approved',
    store: stores[6]!, stock: 9, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(5),
  },
  {
    id: 'p43', catalogId: 'c43',
    name: 'Bluetooth-Lautsprecher JBL Flip 6',
    description: 'IP67 wasserdicht, 12h Akku, PartyBoost, Stereopaar-fähig.',
    price: 129.99, category: 'Elektronik',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
    barcode: '6925281983207', status: 'approved',
    store: stores[6]!, stock: 4, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(15),
  },
  {
    id: 'p44', catalogId: 'c44',
    name: 'E-Reader Kindle Paperwhite 16GB',
    description: 'Wasserdicht, 300 ppi, 12 Wochen Akku, 6,8"-Display, blendfrei.',
    price: 149.99, category: 'Elektronik',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    barcode: '0840080561979', status: 'approved',
    store: stores[6]!, stock: 2, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(30),
  },
  {
    id: 'p45', catalogId: 'c45',
    name: 'Kabelloses Ladegerät Belkin 15W',
    description: 'Qi2-Standard, 15W für iPhone, 10W für Android, Standfuß.',
    price: 44.99, category: 'Elektronik',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e62bd5f62399?w=400&q=80',
    barcode: '0745883853786', status: 'approved',
    store: stores[6]!, stock: 11, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(7),
  },

  // ═══════════════════════════════════════════════════════════════
  // BIOMARKT KLEEBLATT (s8) — Bio Lebensmittel Südstadt
  // ═══════════════════════════════════════════════════════════════
  // Tofu auch hier
  {
    id: 'p30b', catalogId: 'c30',
    name: 'Bio-Tofu Natur 400g',
    description: 'Aus deutschen Sojabohnen, fest, geeignet zum Braten & Grillen.',
    price: 2.59, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80',
    barcode: '4104420001001', status: 'approved',
    store: stores[7]!, stock: 5, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(4),
  },
  // Olivenöl auch hier
  {
    id: 'p31b', catalogId: 'c31',
    name: 'Bio-Olivenöl nativ extra 500ml',
    description: 'Kaltgepresst, fruchtig-mild, aus Kreta, erste Ernte.',
    price: 10.50, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    barcode: '4104420002001', status: 'approved',
    store: stores[7]!, stock: 9, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(6),
  },
  {
    id: 'p46', catalogId: 'c46',
    name: 'Erdnussbutter natürlich 250g',
    description: '100% Erdnüsse, ohne Palmöl & Zucker, cremig oder stückig.',
    price: 3.99, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&q=80',
    barcode: '4104420005001', status: 'approved',
    store: stores[7]!, stock: 14, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(2),
  },
  {
    id: 'p47', catalogId: 'c47',
    name: 'Chiasamen Bio 300g',
    description: 'Omega-3-reich, glutenfrei, 30g Ballaststoffe/100g, aus Mexiko.',
    price: 4.49, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1574570012212-df41f1b2c68c?w=400&q=80',
    barcode: '4104420006001', status: 'approved',
    store: stores[7]!, stock: 20, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(5),
  },
  // Äpfel auch beim Kleeblatt
  {
    id: 'p10b', catalogId: 'c10',
    name: 'Bio-Äpfel Elstar 1 kg',
    description: 'Aus der Region Hannover, unbehandelt, saftig-süßsäuerlich.',
    price: 3.19, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80',
    barcode: '4012345000112', status: 'approved',
    store: stores[7]!, stock: 12, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(4),
  },
  // Mandel-Drink auch beim Kleeblatt
  {
    id: 'p33b', catalogId: 'c33',
    name: 'Mandel-Drink Alpro 1L',
    description: 'Ungesüßt, nur 13 kcal/100ml, angereichert mit Calcium & Vitamin D.',
    price: 2.49, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    barcode: '5411188110293', status: 'approved',
    store: stores[7]!, stock: 7, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(3),
  },
  {
    id: 'p48', catalogId: 'c48',
    name: 'Dunkle Schokolade Lindt 90% 100g',
    description: 'Intensiver Kakaogeschmack, wenig Zucker, vegan.',
    price: 2.79, category: 'Lebensmittel',
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80',
    barcode: '3046920022651', status: 'approved',
    store: stores[7]!, stock: 25, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(1),
  },

  // ═══════════════════════════════════════════════════════════════
  // BOUTIQUE AM MASCHSEE (s9) — Mode
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'p49', catalogId: 'c49',
    name: 'Leinenjacke Damen mittelblau',
    description: '100% Leinen, lockere Passform, Knopfleiste, Gr. XS–XL.',
    price: 89.00, category: 'Mode',
    imageUrl: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&q=80',
    barcode: '4251900003001', status: 'approved',
    store: stores[8]!, stock: 4, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(48),
  },
  {
    id: 'p50', catalogId: 'c50',
    name: 'Chino Hose Herren beige slim',
    description: 'Baumwoll-Stretch, 5-Pocket, Gr. 29–38, bügelleicht.',
    price: 59.90, category: 'Mode',
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80',
    barcode: '4251900004001', status: 'approved',
    store: stores[8]!, stock: 6, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(24),
  },
  {
    id: 'p51', catalogId: 'c51',
    name: 'Basic T-Shirt 2er-Pack Unisex',
    description: '100% Bio-Baumwolle, Rundhals, weiß & schwarz, Gr. XS–3XL.',
    price: 29.90, category: 'Mode',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    barcode: '4251900005001', status: 'approved',
    store: stores[8]!, stock: 12, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(12),
  },
  {
    id: 'p52', catalogId: 'c52',
    name: 'Canvas-Sneaker Off-White unisex',
    description: 'Handgefärbt, Gummisohle, Gr. 36–45, veganes Leder.',
    price: 79.00, category: 'Mode',
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80',
    barcode: '4251900006001', status: 'approved',
    store: stores[8]!, stock: 3, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(36),
  },
  // Adidas Stan Smith auch in der Boutique
  {
    id: 'p25b', catalogId: 'c25',
    name: 'Adidas Stan Smith Sneaker',
    description: 'Klassischer Lederschuh, Gr. 36–46, weiß/grün.',
    price: 104.95, category: 'Mode',
    imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80',
    barcode: '4066759501874', status: 'approved',
    store: stores[8]!, stock: 5, available: true, stockLevel: 'low', stockUpdatedAt: hoursAgo(48),
  },
  {
    id: 'p53', catalogId: 'c53',
    name: 'Wollmütze Merino naturgrau',
    description: '100% Merinowolle, weich & wärmend, One Size, kein Jucken.',
    price: 34.90, category: 'Mode',
    imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&q=80',
    barcode: '4251900007001', status: 'approved',
    store: stores[8]!, stock: 8, available: true, stockLevel: 'high', stockUpdatedAt: hoursAgo(10),
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
      if (thisDist < existingDist) existing.product = p
      if (p.available && p.stock > 0) {
        existing.minPrice = existing.minPrice === null ? thisPrice : Math.min(existing.minPrice, thisPrice)
      }
      existing.storeCount++
    }
  }

  return Array.from(seen.values())
}
