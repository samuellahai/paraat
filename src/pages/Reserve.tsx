import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Tag, MapPin, Clock, Phone, User } from 'lucide-react'
import { products } from '../data/mockData'

export default function Reserve() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const product = products.find((p) => p.id === productId)

  const [form, setForm] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [submitting, setSubmitting] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="font-semibold text-gray-700 mb-2">Produkt nicht gefunden</p>
          <Link to="/results" className="text-brand-600 hover:underline text-sm">
            Zurück zur Suche
          </Link>
        </div>
      </div>
    )
  }

  const displayPrice = product.onSale && product.salePrice != null
    ? product.salePrice
    : product.price

  const validate = (): boolean => {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'Pflichtfeld'
    if (form.phone.replace(/\D/g, '').length < 6) e.phone = 'Ungültige Telefonnummer'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleReserve = () => {
    if (!validate()) return
    setSubmitting(true)
    setTimeout(() => {
      navigate(`/confirmation/${product.id}`, {
        state: { customerName: form.name, customerPhone: form.phone },
      })
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </button>

        <h1 className="text-lg font-bold text-gray-900 mb-4">Reservieren</h1>

        {/* Product summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex gap-3 items-start">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-100"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</p>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span>{product.store.name} · {product.store.address}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>{product.store.openingHours}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-gray-900">
                {displayPrice.toFixed(2).replace('.', ',')} €
              </p>
              {product.onSale && product.salePrice != null && (
                <p className="text-xs text-gray-400 line-through">
                  {product.price.toFixed(2).replace('.', ',')} €
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-5 text-sm text-orange-800">
          <p className="font-semibold mb-0.5">Kostenlos reservieren</p>
          <p className="text-xs text-orange-700">
            Reservierung gilt 24 Stunden. Bezahlung erfolgt direkt im Laden.
            Bringe deinen QR-Code mit.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Deine Daten</h2>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> Name *</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Max Mustermann"
              className={`w-full px-3 py-2.5 text-sm rounded-xl border transition-colors focus:outline-none ${
                errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-400'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Telefonnummer *</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+49 511 123456"
              className={`w-full px-3 py-2.5 text-sm rounded-xl border transition-colors focus:outline-none ${
                errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-400'
              }`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-5">
          {submitting ? (
            <div className="w-full bg-brand-500 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Reservierung wird erstellt…
            </div>
          ) : (
            <button
              onClick={handleReserve}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-200"
            >
              <Tag className="w-4 h-4" />
              Jetzt reservieren
            </button>
          )}
          <p className="text-[11px] text-gray-400 text-center mt-2">
            Mit der Reservierung akzeptierst du unsere Nutzungsbedingungen
          </p>
        </div>
      </div>
    </div>
  )
}
