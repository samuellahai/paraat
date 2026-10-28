import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Plus, Edit2, Trash2, Package, Camera, X, Check,
  AlertCircle, Search, ChevronDown, Scan, Clock,
  LayoutList, Boxes, ClipboardList, QrCode,
} from 'lucide-react'
import jsQR from 'jsqr'
import type { DashboardProduct } from '../types'

const now = () => new Date().toISOString()
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()

function formatStockAge(isoStr: string): string {
  const diffH = Math.floor((Date.now() - new Date(isoStr).getTime()) / 3_600_000)
  if (diffH < 1) return 'gerade eben'
  if (diffH === 1) return 'vor 1 Stunde'
  if (diffH < 24) return `vor ${diffH} Stunden`
  const d = Math.floor(diffH / 24)
  return d === 1 ? 'vor 1 Tag' : `vor ${d} Tagen`
}

const CATEGORIES = ['Lebensmittel', 'Elektronik', 'Mode', 'Backwaren', 'Sport', 'Haushalt', 'Fahrrad', 'Sonstiges']

const INITIAL_PRODUCTS: DashboardProduct[] = [
  {
    id: 'd1', name: 'Roggenmischbrot 750g', description: 'Sauerteig, Steinofen',
    price: 4.20, category: 'Backwaren', stock: 9, barcode: '2001234000010',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80',
    stockUpdatedAt: hoursAgo(1),
  },
  {
    id: 'd2', name: 'Buttercroissant 3er-Pack', description: 'Feine Butterblätterteilchen',
    price: 2.90, category: 'Backwaren', stock: 3, barcode: '2001234000027',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&q=80',
    stockUpdatedAt: hoursAgo(0),
  },
  {
    id: 'd3', name: 'Dinkelbrötchen 6er-Pack', description: 'Aus vollem Dinkelkorn',
    price: 3.00, category: 'Backwaren', stock: 0, barcode: '2001234000034',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=200&q=80',
    stockUpdatedAt: hoursAgo(2),
  },
]

interface MockReservation {
  id: string
  code: string
  productName: string
  customerName: string
  customerPhone: string
  createdAt: string
  status: 'active' | 'redeemed' | 'expired'
}

const INITIAL_RESERVATIONS: MockReservation[] = [
  { id: 'r1', code: 'PAR-X4K2J1', productName: 'Roggenmischbrot 750g',    customerName: 'Max M.',   customerPhone: '+49 511 112233', createdAt: 'Heute, 09:32',    status: 'active' },
  { id: 'r2', code: 'PAR-Q9L7R3', productName: 'Buttercroissant 3er-Pack', customerName: 'Laura S.', customerPhone: '+49 151 445566', createdAt: 'Heute, 08:15',    status: 'active' },
  { id: 'r3', code: 'PAR-M3T8X2', productName: 'Roggenmischbrot 750g',    customerName: 'Jonas K.', customerPhone: '+49 176 778899', createdAt: 'Gestern, 16:44', status: 'redeemed' },
  { id: 'r4', code: 'PAR-V2N5L9', productName: 'Dinkelbrötchen 6er-Pack', customerName: 'Anna W.',  customerPhone: '+49 162 001122', createdAt: 'Gestern, 11:20', status: 'expired' },
]

const EMPTY_FORM: Omit<DashboardProduct, 'id' | 'stockUpdatedAt'> = {
  name: '', description: '', price: 0, category: 'Backwaren',
  stock: 0, barcode: '', imageUrl: '', onSale: false, salePrice: undefined,
}

type ModalMode = 'add' | 'edit' | null
type Tab = 'products' | 'stock' | 'reservations'

const STATUS_COLORS: Record<MockReservation['status'], { bg: string; text: string; label: string }> = {
  active:   { bg: 'bg-green-50',  text: 'text-green-700',  label: 'Aktiv' },
  redeemed: { bg: 'bg-blue-50',   text: 'text-blue-700',   label: 'Eingelöst' },
  expired:  { bg: 'bg-gray-100',  text: 'text-gray-500',   label: 'Abgelaufen' },
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('products')
  const [products, setProducts] = useState<DashboardProduct[]>(INITIAL_PRODUCTS)
  const [reservations, setReservations] = useState<MockReservation[]>(INITIAL_RESERVATIONS)

  // Product form
  const [modal, setModal] = useState<ModalMode>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({})
  const [searchQ, setSearchQ] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [savedToast, setSavedToast] = useState(false)

  // Barcode scanner (product form)
  const [barcodeScanning, setBarcodeScanning] = useState(false)
  const barcodeVideoRef = useRef<HTMLVideoElement>(null)
  const barcodeStreamRef = useRef<MediaStream | null>(null)

  // QR scanner (reservations)
  const [qrScanning, setQrScanning] = useState(false)
  const [scanResult, setScanResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const qrVideoRef = useRef<HTMLVideoElement>(null)
  const qrStreamRef = useRef<MediaStream | null>(null)
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  const qrAnimRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      barcodeStreamRef.current?.getTracks().forEach((t) => t.stop())
      qrStreamRef.current?.getTracks().forEach((t) => t.stop())
      cancelAnimationFrame(qrAnimRef.current)
    }
  }, [])

  // ── QR scanner for reservations ──────────────────────────────────────
  const startQrScanner = async () => {
    setScanResult(null)
    setQrScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      qrStreamRef.current = stream
      if (qrVideoRef.current) {
        qrVideoRef.current.srcObject = stream
        qrVideoRef.current.play()
      }
    } catch {
      setQrScanning(false)
      setScanResult({ type: 'error', message: 'Kamera nicht verfügbar' })
    }
  }

  const stopQrScanner = useCallback(() => {
    qrStreamRef.current?.getTracks().forEach((t) => t.stop())
    qrStreamRef.current = null
    cancelAnimationFrame(qrAnimRef.current)
    setQrScanning(false)
  }, [])

  const handleQrFrame = useCallback(() => {
    const video = qrVideoRef.current
    const canvas = qrCanvasRef.current
    if (!video || !canvas || video.readyState < 2) {
      qrAnimRef.current = requestAnimationFrame(handleQrFrame)
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, canvas.width, canvas.height)
    if (code?.data) {
      const scannedCode = code.data.trim().toUpperCase()
      stopQrScanner()
      const match = reservations.find((r) => r.code === scannedCode)
      if (!match) {
        setScanResult({ type: 'error', message: `Code „${scannedCode}" nicht gefunden.` })
      } else if (match.status === 'redeemed') {
        setScanResult({ type: 'error', message: `${scannedCode} wurde bereits eingelöst.` })
      } else if (match.status === 'expired') {
        setScanResult({ type: 'error', message: `${scannedCode} ist abgelaufen.` })
      } else {
        setReservations((prev) =>
          prev.map((r) => r.id === match.id ? { ...r, status: 'redeemed' } : r)
        )
        setScanResult({ type: 'success', message: `✓ ${match.productName} für ${match.customerName} eingelöst!` })
      }
      return
    }
    qrAnimRef.current = requestAnimationFrame(handleQrFrame)
  }, [reservations, stopQrScanner])

  useEffect(() => {
    if (qrScanning && qrVideoRef.current) {
      const video = qrVideoRef.current
      const onPlay = () => { qrAnimRef.current = requestAnimationFrame(handleQrFrame) }
      video.addEventListener('play', onPlay)
      return () => video.removeEventListener('play', onPlay)
    }
  }, [qrScanning, handleQrFrame])

  const simulateQrScan = () => {
    stopQrScanner()
    const active = reservations.find((r) => r.status === 'active')
    if (active) {
      setReservations((prev) =>
        prev.map((r) => r.id === active.id ? { ...r, status: 'redeemed' } : r)
      )
      setScanResult({ type: 'success', message: `✓ ${active.productName} für ${active.customerName} eingelöst!` })
    } else {
      setScanResult({ type: 'error', message: 'Keine aktiven Reservierungen.' })
    }
  }

  // ── Barcode scanner (product form) ────────────────────────────────────
  const startBarcodeScanner = async () => {
    setBarcodeScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      barcodeStreamRef.current = stream
      if (barcodeVideoRef.current) { barcodeVideoRef.current.srcObject = stream; barcodeVideoRef.current.play() }
      if ('BarcodeDetector' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detector = new (window as any).BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128'] })
        const scan = async () => {
          if (!barcodeVideoRef.current) return
          try {
            const codes = await detector.detect(barcodeVideoRef.current)
            if (codes.length > 0) { setForm((f) => ({ ...f, barcode: codes[0].rawValue as string })); stopBarcodeScanner(); return }
          } catch { /* ignore */ }
          requestAnimationFrame(scan)
        }
        requestAnimationFrame(scan)
      }
    } catch { setBarcodeScanning(false) }
  }

  const stopBarcodeScanner = () => {
    barcodeStreamRef.current?.getTracks().forEach((t) => t.stop())
    barcodeStreamRef.current = null
    setBarcodeScanning(false)
  }

  const simulateBarcodeScan = () => {
    const barcodes = ['4012345678901', '2001234000010', '2001234000027', '5060289070015']
    setForm((f) => ({ ...f, barcode: barcodes[Math.floor(Math.random() * barcodes.length)]! }))
    stopBarcodeScanner()
  }

  // ── Product CRUD ──────────────────────────────────────────────────────
  const openAdd = () => { setForm(EMPTY_FORM); setFormErrors({}); setEditingId(null); setModal('add') }
  const openEdit = (p: DashboardProduct) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, barcode: p.barcode, imageUrl: p.imageUrl, onSale: p.onSale ?? false, salePrice: p.salePrice })
    setFormErrors({}); setEditingId(p.id); setModal('edit')
  }
  const closeModal = () => { setModal(null); stopBarcodeScanner() }

  const validate = () => {
    const e: typeof formErrors = {}
    if (!form.name.trim()) e.name = 'Pflichtfeld'
    if (form.price <= 0) e.price = 'Muss größer als 0 sein'
    if (form.stock < 0) e.stock = 'Darf nicht negativ sein'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    if (modal === 'add') {
      setProducts((prev) => [...prev, { ...form, id: `d${Date.now()}`, stockUpdatedAt: now() }])
    } else if (modal === 'edit' && editingId) {
      setProducts((prev) => prev.map((p) => p.id === editingId ? { ...p, ...form, stockUpdatedAt: now() } : p))
    }
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 2500)
    closeModal()
  }

  const handleDelete = (id: string) => { setProducts((prev) => prev.filter((p) => p.id !== id)); setDeleteConfirm(null) }

  const handleStockChange = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta), stockUpdatedAt: now() } : p)
    )
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQ.toLowerCase()) ||
    p.barcode.includes(searchQ)
  )

  const outOfStock = products.filter((p) => p.stock === 0).length
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 3).length
  const activeCount = reservations.filter((r) => r.status === 'active').length

  const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'products',     label: 'Produkte',      icon: <LayoutList className="w-4 h-4" /> },
    { id: 'stock',        label: 'Bestand',        icon: <Boxes className="w-4 h-4" />, badge: outOfStock || undefined },
    { id: 'reservations', label: 'Reservierungen', icon: <ClipboardList className="w-4 h-4" />, badge: activeCount || undefined },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-[54px]">
      {/* Toast */}
      {savedToast && (
        <div className="fixed bottom-[70px] left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4" /> Gespeichert!
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Händler-Dashboard</p>
              <h1 className="text-lg font-extrabold text-gray-900 leading-tight">Backstube Lindemann</h1>
              <p className="text-xs text-gray-400">Limmerstraße 45 · Mo–Fr 6–18, Sa–So 6–14 Uhr</p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 text-white font-semibold px-3 py-2 rounded-xl text-sm transition-colors shadow"
              style={{ background: '#E05C00' }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Produkt</span>
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-0 border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors relative -mb-px ${
                  activeTab === tab.id
                    ? 'text-gray-900 border-[#E05C00]'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge != null && (
                  <span className="absolute -top-0.5 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5">

        {/* ── TAB: Produkte ── */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Produkt suchen..." className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-400 focus:outline-none bg-white" />
            </div>
            {outOfStock > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">
                  <strong>{outOfStock} {outOfStock === 1 ? 'Produkt' : 'Produkte'}</strong> ausverkauft.
                </p>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {filtered.length === 0 ? (
                <div className="py-14 text-center">
                  <p className="text-4xl mb-3">📦</p>
                  <p className="font-semibold text-gray-700 mb-1">Keine Produkte gefunden</p>
                  <button onClick={openAdd} className="mt-2 text-sm font-semibold" style={{ color: '#E05C00' }}>
                    Erstes Produkt hinzufügen
                  </button>
                </div>
              ) : (
                filtered.map((p, i) => (
                  <div key={p.id} className={`flex items-center gap-3 px-4 py-3 ${i < filtered.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] bg-gray-100 text-gray-500 font-medium px-1.5 py-0.5 rounded-full">{p.category}</span>
                        {p.onSale && p.salePrice != null ? (
                          <>
                            <span className="text-xs font-bold" style={{ color: '#E05C00' }}>{p.salePrice.toFixed(2).replace('.', ',')} €</span>
                            <span className="text-xs text-gray-400 line-through">{p.price.toFixed(2).replace('.', ',')} €</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#FFF0E6', color: '#E05C00' }}>Angebot</span>
                          </>
                        ) : (
                          <span className="text-xs font-semibold text-gray-700">{p.price.toFixed(2).replace('.', ',')} €</span>
                        )}
                        <span className={`text-xs font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock <= 3 ? 'text-amber-600' : 'text-green-600'}`}>
                          {p.stock}× Bestand
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm(p.id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── TAB: Bestand ── */}
        {activeTab === 'stock' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Bestand anpassen — Änderungen werden sofort übernommen und der Zeitstempel aktualisiert.</p>
            {lowStock > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  <strong>{lowStock} {lowStock === 1 ? 'Produkt' : 'Produkte'}</strong> mit niedrigem Bestand (≤ 3 Stück).
                </p>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {products.map((p, i) => (
                <div key={p.id} className={`flex items-center gap-3 px-4 py-3.5 ${i < products.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Stand: {formatStockAge(p.stockUpdatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button onClick={() => handleStockChange(p.id, -1)}
                      className="w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 font-bold text-lg flex items-center justify-center transition-colors leading-none">
                      −
                    </button>
                    <span className={`w-8 text-center text-sm font-bold ${p.stock === 0 ? 'text-red-500' : p.stock <= 3 ? 'text-amber-600' : 'text-gray-900'}`}>
                      {p.stock}
                    </span>
                    <button onClick={() => handleStockChange(p.id, 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 font-bold text-lg flex items-center justify-center transition-colors leading-none">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: Reservierungen ── */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Aktiv',      value: reservations.filter(r => r.status === 'active').length,   color: 'text-green-600' },
                { label: 'Eingelöst', value: reservations.filter(r => r.status === 'redeemed').length, color: 'text-blue-600' },
                { label: 'Abgelaufen', value: reservations.filter(r => r.status === 'expired').length,  color: 'text-gray-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 text-center">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Scan result feedback */}
            {scanResult && (
              <div className={`rounded-2xl px-4 py-3 flex items-center gap-3 ${
                scanResult.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <span className="text-lg">{scanResult.type === 'success' ? '✓' : '✗'}</span>
                <p className={`text-sm font-semibold ${scanResult.type === 'success' ? 'text-green-800' : 'text-red-700'}`}>
                  {scanResult.message}
                </p>
                <button onClick={() => setScanResult(null)} className="ml-auto text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* QR Scanner */}
            {!qrScanning ? (
              <button
                onClick={startQrScanner}
                className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors shadow"
                style={{ background: '#E05C00' }}
              >
                <QrCode className="w-4 h-4" />
                QR-Code scannen
              </button>
            ) : (
              <div className="bg-black rounded-2xl overflow-hidden relative">
                <video ref={qrVideoRef} className="w-full aspect-video object-cover" playsInline muted />
                <canvas ref={qrCanvasRef} className="hidden" />
                {/* Scan overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-52 h-52 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#E05C00] rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#E05C00] rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#E05C00] rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#E05C00] rounded-br-lg" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-3 px-4 flex items-center justify-between">
                  <span className="text-white text-xs flex items-center gap-1.5">
                    <Camera className="w-3 h-3" /> QR-Code ins Feld halten
                  </span>
                  <div className="flex gap-2">
                    <button onClick={simulateQrScan} className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-lg font-semibold">
                      Demo
                    </button>
                    <button onClick={stopQrScanner} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1">
                      <X className="w-3 h-3" /> Stopp
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reservation list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {reservations.map((r, i) => {
                const s = STATUS_COLORS[r.status]
                return (
                  <div key={r.id} className={`px-4 py-3.5 ${i < reservations.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">{r.code}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{r.productName}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {r.createdAt}
                          </span>
                          <span className="text-xs text-gray-600 font-medium">{r.customerName}</span>
                        </div>
                      </div>
                      {r.status === 'active' && (
                        <button
                          onClick={() => {
                            setReservations((prev) =>
                              prev.map((x) => x.id === r.id ? { ...x, status: 'redeemed' } : x)
                            )
                            setScanResult({ type: 'success', message: `✓ ${r.productName} für ${r.customerName} eingelöst!` })
                          }}
                          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-white"
                          style={{ background: '#E05C00' }}
                        >
                          <Scan className="w-3 h-3" /> Einlösen
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900 mb-2">Produkt löschen?</h3>
            <p className="text-sm text-gray-500 mb-5">
              „{products.find((p) => p.id === deleteConfirm)?.name}" wird dauerhaft entfernt.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Abbrechen</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">Löschen</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900">{modal === 'add' ? 'Produkt hinzufügen' : 'Produkt bearbeiten'}</h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Produktname *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="z.B. Roggenbrot 500g"
                  className={`w-full px-3 py-2.5 text-sm rounded-xl border ${formErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-400'} focus:outline-none transition-colors`} />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Beschreibung</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Kurze Beschreibung..." rows={2}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-400 focus:outline-none resize-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Preis (€) *</label>
                  <input type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} placeholder="0,00" min="0" step="0.01"
                    className={`w-full px-3 py-2.5 text-sm rounded-xl border ${formErrors.price ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-400'} focus:outline-none transition-colors`} />
                  {formErrors.price && <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Bestand *</label>
                  <input type="number" value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} placeholder="0" min="0"
                    className={`w-full px-3 py-2.5 text-sm rounded-xl border ${formErrors.stock ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-400'} focus:outline-none transition-colors`} />
                  {formErrors.stock && <p className="text-xs text-red-500 mt-1">{formErrors.stock}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Kategorie</label>
                <div className="relative">
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full appearance-none px-3 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-400 focus:outline-none bg-white transition-colors cursor-pointer">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Barcode (EAN)</label>
                <div className="flex gap-2">
                  <input type="text" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} placeholder="4012345678901"
                    className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-400 focus:outline-none font-mono transition-colors" />
                  <button type="button" onClick={barcodeScanning ? stopBarcodeScanner : startBarcodeScanner}
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${barcodeScanning ? 'bg-red-50 border-red-200 text-red-600' : 'bg-brand-50 border-brand-200 text-brand-700'}`}>
                    {barcodeScanning ? <X className="w-4 h-4" /> : <Scan className="w-4 h-4" />}
                  </button>
                </div>
                {barcodeScanning && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-brand-200 bg-black relative">
                    <video ref={barcodeVideoRef} className="w-full aspect-video object-cover" playsInline muted />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-2 px-3 flex items-center justify-between">
                      <span className="text-white text-xs flex items-center gap-1.5"><Camera className="w-3 h-3" /> Kamera aktiv</span>
                      <button onClick={simulateBarcodeScan} className="text-xs bg-brand-500 text-white px-3 py-1 rounded-lg font-semibold">Demo</button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Bild-URL (optional)</label>
                <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-400 focus:outline-none transition-colors" />
                {form.imageUrl && <img src={form.imageUrl} alt="Vorschau" className="mt-2 w-16 h-16 rounded-xl object-cover border border-gray-200" />}
              </div>
              {/* Im Angebot / Restposten */}
              <div className="rounded-2xl border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Im Angebot / Restposten</p>
                    <p className="text-xs text-gray-400 mt-0.5">Sonderpreis für Kunden sichtbar machen</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, onSale: !f.onSale, salePrice: f.onSale ? undefined : f.salePrice }))}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form.onSale ? 'bg-[#E05C00]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.onSale ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                {form.onSale && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Aktionspreis (€)</label>
                    <input
                      type="number"
                      value={form.salePrice ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, salePrice: parseFloat(e.target.value) || undefined }))}
                      placeholder="z.B. 2,50"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#E05C00] focus:border-[#E05C00] focus:outline-none transition-colors"
                      style={{ color: '#E05C00', fontWeight: 600 }}
                    />
                    {form.price > 0 && form.salePrice != null && form.salePrice < form.price && (
                      <p className="text-xs text-green-600 mt-1">
                        −{Math.round((1 - form.salePrice / form.price) * 100)} % Rabatt gegenüber {form.price.toFixed(2).replace('.', ',')} €
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 sticky bottom-0 bg-white flex gap-3">
              <button onClick={closeModal} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Abbrechen</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                {modal === 'add' ? 'Hinzufügen' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
