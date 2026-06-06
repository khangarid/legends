import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import ItemDetailPage from './pages/ItemDetailPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="item/:id" element={<ItemDetailPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
