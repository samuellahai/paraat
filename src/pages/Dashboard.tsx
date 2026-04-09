import { useState, useRef, useEffect } from 'react'
import {
  Plus, Edit2, Trash2, Package, BarChart2, Camera, X, Check,
  TrendingUp, AlertCircle, Search, ChevronDown, Scan
} from 'lucide-react'
import type { DashboardProduct } from '../types'

const CATEGORIES = ['Lebensmittel', 'Elektronik', 'Mode', 'Backwaren', 'Sport', 'Sonstiges']

const INITIAL_PRODUCTS: DashboardProduct[] = [
  {
    id: 'd1', name: 'Bio-Apfelsaft 1L', description: 'Frisch gepresst, ungefiltert',
    price: 3.49, category: 'Lebensmittel', stock: 12, barcode: '4012345678901',
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&q=80',
  },
  {
    id: 'd2', name: 'Bio-Granola Beeren', description: 'Glutenfrei, 400g',
    price: 5.99, category: 'Lebensmittel', stock: 0, barcode: '4006381333931',
    imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=200&q=80',
  },
]

const EMPTY_FORM: Omit<DashboardProduct, 'id'> = {
  name: '', description: '', price: 0, category: 'Lebensmittel',
  stock: 0, barcode: '', imageUrl: '',
}

type ModalMode = 'add' | 'edit' | null

export default function Dashboard() {
  const [products, setProducts] = useState<DashboardProduct[]>(INITIAL_PRODUCTS)
  const [modal, setModal] = useState<ModalMode>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({})
  const [searchQ, setSearchQ] = useState('')
  const [scanning, setScanning] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [savedToast, setSavedToast] = useState(false)
  const scannerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Stop camera on unmount
  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()) }
  }, [])

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setFormErrors({})
    setEditingId(null)
    setModal('add')
  }

  const openEdit = (p: DashboardProduct) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, barcode: p.barcode, imageUrl: p.imageUrl })
    setFormErrors({})
    setEditingId(p.id)
    setModal('edit')
  }

  const closeModal = () => {
    setModal(null)
    stopScanner()
  }

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
      setProducts((prev) => [...prev, { ...form, id: `d${Date.now()}` }])
    } else if (modal === 'edit' && editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form } : p)))
    }
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 2500)
    closeModal()
  }

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setDeleteConfirm(null)
  }

  const handleStockChange = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    )
  }

  // Barcode scanner (uses camera + BarcodeDetector API where available)
  const startScanner = async () => {
    setScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Use BarcodeDetector if available
      if ('BarcodeDetector' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detector = new (window as any).BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128', 'qr_code'] })
        const scan = async () => {
          if (!videoRef.current || !scanning) return
          try {
            const codes = await detector.detect(videoRef.current)
            if (codes.length > 0) {
              const code = codes[0].rawValue as string
              setForm((f) => ({ ...f, barcode: code }))
              stopScanner()
              return
            }
          } catch { /* ignore */ }
          requestAnimationFrame(scan)
        }
        requestAnimationFrame(scan)
      }
    } catch {
      setScanning(false)
      alert('Kamera nicht verfügbar. Bitte Barcode manuell eingeben.')
    }
  }

  const stopScanner = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setScanning(false)
  }

  // Simulate barcode scan for demo
  const simulateScan = () => {
    const barcodes = ['4012345678901', '4901660196498', '3614273325820', '2012345000015', '5060289070015']
    const code = barcodes[Math.floor(Math.random() * barcodes.length)]!
    setForm((f) => ({ ...f, barcode: code }))
    stopScanner()
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQ.toLowerCase()) ||
    p.barcode.includes(searchQ)
  )

  const totalProducts = products.length
  const outOfStock = products.filter((p) => p.stock === 0).length
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 3).length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      {/* Toast */}
      {savedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> Gespeichert!
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Händler-Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Bio-Markt Grünzeug</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-brand-200"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Produkt hinzufügen</span>
            <span className="sm:hidden">Neu</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Produkte', value: totalProducts, icon: Package, color: 'text-blue-600 bg-blue-50' },
            { label: 'Lagerwert', value: `${totalValue.toFixed(0)} €`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
            { label: 'Ausverkauft', value: outOfStock, icon: AlertCircle, color: outOfStock > 0 ? 'text-red-600 bg-red-50' : 'text-gray-400 bg-gray-50' },
            { label: 'Niedriger Bestand', value: lowStock, icon: BarChart2, color: lowStock > 0 ? 'text-amber-600 bg-amber-50' : 'text-gray-400 bg-gray-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className={`inline-flex p-2 rounded-xl mb-2 ${stat.color.split(' ')[1]}`}>
                <stat.icon className={`w-4 h-4 ${stat.color.split(' ')[0]}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Produkt, Kategorie oder Barcode suchen..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-400 focus:outline-none bg-white"
          />
        </div>

        {/* Alerts */}
        {outOfStock > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">
              <strong>{outOfStock} {outOfStock === 1 ? 'Produkt ist' : 'Produkte sind'}</strong> ausverkauft und für Kunden nicht sichtbar.
            </p>
          </div>
        )}

        {/* Product table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3">📦</p>
              <p className="font-semibold text-gray-700">Keine Produkte gefunden</p>
              <button onClick={openAdd} className="mt-3 text-sm text-brand-600 hover:underline">
                Erstes Produkt hinzufügen
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Produkt</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Preis</th>
                    <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Bestand</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Barcode</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                            <span className="text-[10px] bg-gray-100 text-gray-500 font-medium px-1.5 py-0.5 rounded-full">{p.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="text-sm font-semibold text-gray-900">{p.price.toFixed(2).replace('.', ',')} €</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStockChange(p.id, -1)}
                            className="w-7 h-7 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 font-bold text-lg flex items-center justify-center transition-colors leading-none"
                          >−</button>
                          <span className={`w-8 text-center text-sm font-bold ${p.stock === 0 ? 'text-red-500' : p.stock <= 3 ? 'text-amber-600' : 'text-gray-900'}`}>
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleStockChange(p.id, 1)}
                            className="w-7 h-7 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 font-bold text-lg flex items-center justify-center transition-colors leading-none"
                          >+</button>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                          {p.barcode || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(p.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900">{modal === 'add' ? 'Produkt hinzufügen' : 'Produkt bearbeiten'}</h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Produktname *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="z.B. Bio-Apfelsaft 1L"
                  className={`w-full px-3 py-2.5 text-sm rounded-xl border ${formErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-400'} focus:outline-none transition-colors`}
                />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Beschreibung</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Kurze Beschreibung des Produkts..."
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-400 focus:outline-none resize-none transition-colors"
                />
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Preis (€) *</label>
                  <input
                    type="number"
                    value={form.price || ''}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2.5 text-sm rounded-xl border ${formErrors.price ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-400'} focus:outline-none transition-colors`}
                  />
                  {formErrors.price && <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Bestand *</label>
                  <input
                    type="number"
                    value={form.stock || ''}
                    onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    className={`w-full px-3 py-2.5 text-sm rounded-xl border ${formErrors.stock ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-400'} focus:outline-none transition-colors`}
                  />
                  {formErrors.stock && <p className="text-xs text-red-500 mt-1">{formErrors.stock}</p>}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Kategorie</label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full appearance-none px-3 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-400 focus:outline-none bg-white transition-colors cursor-pointer"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Barcode */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Barcode (EAN/QR)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.barcode}
                    onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                    placeholder="4012345678901"
                    className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-400 focus:outline-none font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={scanning ? stopScanner : startScanner}
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                      scanning
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        : 'bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100'
                    }`}
                  >
                    {scanning ? <X className="w-4 h-4" /> : <Scan className="w-4 h-4" />}
                    <span className="hidden sm:inline">{scanning ? 'Stopp' : 'Scannen'}</span>
                  </button>
                </div>

                {/* Scanner view */}
                {scanning && (
                  <div ref={scannerRef} className="mt-3 rounded-xl overflow-hidden border border-brand-200 bg-black relative">
                    <video
                      ref={videoRef}
                      className="w-full aspect-video object-cover"
                      playsInline
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-2 border-brand-400 rounded-lg w-48 h-24 opacity-80" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-2 px-3 flex items-center justify-between">
                      <span className="text-white text-xs flex items-center gap-1.5">
                        <Camera className="w-3 h-3" /> Kamera aktiv – Barcode einscannen
                      </span>
                      <button
                        onClick={simulateScan}
                        className="text-xs bg-brand-500 text-white px-3 py-1 rounded-lg font-semibold"
                      >
                        Demo-Scan
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Bild-URL (optional)</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-400 focus:outline-none transition-colors"
                />
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="Vorschau" className="mt-2 w-16 h-16 rounded-xl object-cover border border-gray-200" />
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-5 py-4 border-t border-gray-100 sticky bottom-0 bg-white flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
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
