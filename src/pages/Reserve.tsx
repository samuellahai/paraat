import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, Lock, Tag, MapPin, Clock, Info } from 'lucide-react'
import { products } from '../data/mockData'

type Step = 'details' | 'payment' | 'confirming'

export default function Reserve() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const product = products.find((p) => p.id === productId)

  const [step, setStep] = useState<Step>('details')
  const [form, setForm] = useState({
    name: '',
    email: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-14">
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

  const validate = (): boolean => {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'Pflichtfeld'
    if (!form.email.includes('@')) e.email = 'Ungültige E-Mail'
    if (step === 'payment') {
      if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Ungültige Kartennummer'
      if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) e.cardExpiry = 'Format: MM/JJ'
      if (form.cardCvc.length < 3) e.cardCvc = 'Ungültig'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (step === 'details') {
      if (validate()) setStep('payment')
    } else if (step === 'payment') {
      if (validate()) {
        setStep('confirming')
        setTimeout(() => {
          navigate(`/confirmation/${product.id}`, {
            state: { customerName: form.name, customerEmail: form.email },
          })
        }, 1800)
      }
    }
  }

  const formatCard = (val: string) =>
    val
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim()

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4)
    if (clean.length >= 3) return clean.slice(0, 2) + '/' + clean.slice(2)
    return clean
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Back */}
        <button
          onClick={() => (step === 'payment' ? setStep('details') : navigate(-1))}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 'payment' ? 'Zurück' : 'Ergebnisse'}
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {(['details', 'payment'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  step === s
                    ? 'bg-brand-500 text-white'
                    : (step === 'payment' && s === 'details') || step === 'confirming'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {(step === 'payment' && s === 'details') || step === 'confirming' ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium ${step === s ? 'text-gray-800' : 'text-gray-400'}`}>
                {s === 'details' ? 'Kontakt' : 'Zahlung'}
              </span>
              {i === 0 && <div className={`flex-1 h-0.5 ${step === 'payment' || step === 'confirming' ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Product summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex gap-3 items-start">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{product.store.name}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{product.store.openingHours}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{product.price.toFixed(2).replace('.', ',')} €</p>
              <p className="text-xs text-gray-400">Produktpreis</p>
            </div>
          </div>
        </div>

        {/* Fee info */}
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 mb-4 flex gap-3">
          <Info className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-brand-800">Reservierungsgebühr: 2,00 €</p>
            <p className="text-xs text-brand-600 mt-0.5">
              Der Betrag wird beim Kauf im Laden vollständig angerechnet. Du zahlst nur den Restpreis von{' '}
              <strong>{(product.price - 2).toFixed(2).replace('.', ',')} €</strong> vor Ort.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          {step === 'details' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 text-base">Kontaktdaten</h2>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Vollständiger Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Max Mustermann"
                  className={`w-full px-3 py-2.5 text-sm rounded-xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-400'} focus:outline-none transition-colors`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">E-Mail-Adresse *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="max@beispiel.de"
                  className={`w-full px-3 py-2.5 text-sm rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-400'} focus:outline-none transition-colors`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 text-base">Zahlungsdaten</h2>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Lock className="w-3 h-3" />
                  SSL gesichert
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Kartennummer *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.cardNumber}
                    onChange={(e) => setForm({ ...form, cardNumber: formatCard(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border ${errors.cardNumber ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-400'} focus:outline-none transition-colors`}
                  />
                </div>
                {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ablaufdatum *</label>
                  <input
                    type="text"
                    value={form.cardExpiry}
                    onChange={(e) => setForm({ ...form, cardExpiry: formatExpiry(e.target.value) })}
                    placeholder="MM/JJ"
                    maxLength={5}
                    className={`w-full px-3 py-2.5 text-sm rounded-xl border ${errors.cardExpiry ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-400'} focus:outline-none transition-colors`}
                  />
                  {errors.cardExpiry && <p className="text-xs text-red-500 mt-1">{errors.cardExpiry}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">CVC *</label>
                  <input
                    type="text"
                    value={form.cardCvc}
                    onChange={(e) => setForm({ ...form, cardCvc: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                    placeholder="123"
                    maxLength={3}
                    className={`w-full px-3 py-2.5 text-sm rounded-xl border ${errors.cardCvc ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-400'} focus:outline-none transition-colors`}
                  />
                  {errors.cardCvc && <p className="text-xs text-red-500 mt-1">{errors.cardCvc}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 'confirming' && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-semibold text-gray-800">Reservierung wird bearbeitet...</p>
              <p className="text-sm text-gray-400 mt-1">Bitte warten</p>
            </div>
          )}
        </div>

        {/* CTA */}
        {step !== 'confirming' && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm text-gray-600">Reservierungsgebühr</span>
              <span className="font-bold text-gray-900">2,00 €</span>
            </div>
            <button
              onClick={handleContinue}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-200"
            >
              <Tag className="w-4 h-4" />
              {step === 'details' ? 'Weiter zur Zahlung' : 'Jetzt für 2,00 € reservieren'}
            </button>
            <p className="text-[11px] text-gray-400 text-center mt-2">
              Mit der Reservierung akzeptierst du unsere Nutzungsbedingungen
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
