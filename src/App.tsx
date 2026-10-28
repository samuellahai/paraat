import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Results from './pages/Results'
import Reserve from './pages/Reserve'
import Confirmation from './pages/Confirmation'
import Dashboard from './pages/Dashboard'
import ProductDetail from './pages/ProductDetail'
import Account from './pages/Account'
import StoreProfile from './pages/StoreProfile'
import Meins from './pages/Meins'

function AppLayout() {
  const location = useLocation()
  const hideNav =
    location.pathname.startsWith('/reserve') ||
    location.pathname.startsWith('/confirmation')

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/reserve/:productId" element={<Reserve />} />
        <Route path="/confirmation/:productId" element={<Confirmation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/store/:storeId" element={<StoreProfile />} />
        <Route path="/meins" element={<Meins />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
