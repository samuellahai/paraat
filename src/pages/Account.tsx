import { useState } from 'react'
import { User, Bell, Globe, Shield, LogOut, ChevronRight, Check } from 'lucide-react'

const LANGUAGES = ['Deutsch', 'English', 'Français', 'Español']

export default function Account() {
  const [notifications, setNotifications] = useState({
    reservations: true,
    deals: false,
    news: false,
  })
  const [language, setLanguage] = useState('Deutsch')
  const [showLangPicker, setShowLangPicker] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 pb-[54px]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-6 pb-5">
        <h1 className="text-xl font-extrabold text-gray-900 mb-4">Account</h1>
        {/* Profile */}
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ background: '#E05C00' }}
          >
            M
          </div>
          <div>
            <p className="font-bold text-gray-900">Max Mustermann</p>
            <p className="text-sm text-gray-500">max@beispiel.de</p>
          </div>
          <button className="ml-auto p-2 rounded-xl hover:bg-gray-50 text-gray-400">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* Profile section */}
        <Section title="Profil" icon={<User className="w-4 h-4" />}>
          <SettingsRow label="Name" value="Max Mustermann" />
          <SettingsRow label="E-Mail" value="max@beispiel.de" />
          <SettingsRow label="Telefon" value="Nicht angegeben" isLast />
        </Section>

        {/* Notifications */}
        <Section title="Benachrichtigungen" icon={<Bell className="w-4 h-4" />}>
          <ToggleRow
            label="Reservierungen"
            description="Status-Updates zu deinen Reservierungen"
            value={notifications.reservations}
            onChange={(v) => setNotifications({ ...notifications, reservations: v })}
          />
          <ToggleRow
            label="Angebote & Deals"
            description="Benachrichtigungen über Rabatte in deiner Nähe"
            value={notifications.deals}
            onChange={(v) => setNotifications({ ...notifications, deals: v })}
          />
          <ToggleRow
            label="Neuigkeiten"
            description="Updates zur Paraat-App"
            value={notifications.news}
            onChange={(v) => setNotifications({ ...notifications, news: v })}
            isLast
          />
        </Section>

        {/* Language */}
        <Section title="Sprache" icon={<Globe className="w-4 h-4" />}>
          <button
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm"
          >
            <span className="text-gray-700">Anzeigesprache</span>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="font-medium text-gray-800">{language}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showLangPicker ? 'rotate-90' : ''}`} />
            </div>
          </button>
          {showLangPicker && (
            <div className="border-t border-gray-50">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setShowLangPicker(false) }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                >
                  <span className={lang === language ? 'font-semibold text-gray-900' : 'text-gray-600'}>{lang}</span>
                  {lang === language && <Check className="w-4 h-4" style={{ color: '#E05C00' }} />}
                </button>
              ))}
            </div>
          )}
        </Section>

        {/* Privacy */}
        <Section title="Datenschutz" icon={<Shield className="w-4 h-4" />}>
          <SettingsRow label="Datenschutzerklärung" chevron />
          <SettingsRow label="Nutzungsbedingungen" chevron />
          <SettingsRow label="Cookie-Einstellungen" chevron />
          <SettingsRow label="Konto löschen" chevron danger isLast />
        </Section>

        {/* Logout */}
        {logoutConfirm ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-800 mb-1">Wirklich abmelden?</p>
            <p className="text-xs text-gray-500 mb-4">Deine Daten bleiben gespeichert.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
              >
                Abmelden
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-100 shadow-sm rounded-2xl py-3.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Abmelden
          </button>
        )}

        <p className="text-center text-xs text-gray-300 pb-2">Paraat v1.0 · Made with ♥ in Berlin</p>
      </div>
    </div>
  )
}

/* ── Helpers ────────────────────────────────────────────────── */

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50">
        <span className="text-gray-400">{icon}</span>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</span>
      </div>
      {children}
    </div>
  )
}

function SettingsRow({
  label, value, chevron, danger, isLast,
}: {
  label: string; value?: string; chevron?: boolean; danger?: boolean; isLast?: boolean
}) {
  return (
    <button className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${isLast ? '' : 'border-b border-gray-50'}`}>
      <span className={danger ? 'text-red-500 font-medium' : 'text-gray-700'}>{label}</span>
      <div className="flex items-center gap-1 text-gray-400">
        {value && <span className="text-xs text-gray-500">{value}</span>}
        {chevron && <ChevronRight className="w-4 h-4" />}
      </div>
    </button>
  )
}

function ToggleRow({
  label, description, value, onChange, isLast,
}: {
  label: string; description: string; value: boolean; onChange: (v: boolean) => void; isLast?: boolean
}) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${isLast ? '' : 'border-b border-gray-50'}`}>
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm text-gray-800 font-medium">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="w-11 h-6 rounded-full transition-colors flex-shrink-0 relative"
        style={{ background: value ? '#E05C00' : '#D1D5DB' }}
        role="switch"
        aria-checked={value}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
          style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  )
}
