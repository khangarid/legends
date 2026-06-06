import { Link, NavLink, Outlet } from 'react-router-dom'
import { siteConfig } from '../lib/catalog'
import { mn } from '../lib/mn'
import Footer from './Footer'
import './Layout.css'

export default function Layout() {
  const title = siteConfig.site_title || mn.site.defaultTitle

  return (
    <div className="layout">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            {siteConfig.logo ? (
              <img src={siteConfig.logo} alt={title} className="brand-logo" />
            ) : (
              <span className="brand-text">{title}</span>
            )}
          </Link>
          <nav className="site-nav">
            <NavLink to="/" end>
              {mn.nav.catalog}
            </NavLink>
            <NavLink to="/about">{mn.nav.about}</NavLink>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
