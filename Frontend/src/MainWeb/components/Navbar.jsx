"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
} from "lucide-react"
import SearchModal from "./SearchModal"
import Logo from "../../components/Logo"
import { getNavigations } from "../../services/api"
import { getAuthToken, clearAuthToken } from "../../services/api"

const Navbar = () => {
  const navigate = useNavigate()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [navigations, setNavigations] = useState([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const fetchNavigations = async () => {
      try {
        const data = await getNavigations()
        setNavigations(data)
      } catch (err) {
        console.error('Failed to fetch navigations:', err)
        // Fallback to hardcoded if API fails
        setNavigations([
          { name: "Women", slug: "women" },
          { name: "Men", slug: "men" },
          { name: "Wedding", slug: "wedding" },
          { name: "Jewelry", slug: "jewelry" },
          { name: "Accessories", slug: "accessories" },
          { name: "Gifting", slug: "gifting" },
          { name: "Grassroot by kalaqx", slug: "grassroot-by-kalaqx" },
          { name: "Discover", slug: "discover" },
          { name: "Celebrity Closet", slug: "celebrity-closet" },
          { name: "Sale", slug: "sale" },
          { name: "Rewild", slug: "rewild" },
        ])
      }
    }
    fetchNavigations()
  }, [])

  useEffect(() => {
    const token = getAuthToken()
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleLogout = () => {
    clearAuthToken()
    setIsLoggedIn(false)
    setIsProfileDropdownOpen(false)
    navigate('/')
  }

  return (
    <>
    <header className="fixed top-0 w-full z-50 bg-[#fbf7f2] border-b border-[#e6ddd2]">

      {/* ================= DESKTOP TOP BAR ================= */}
      <div className="hidden lg:flex h-[48px] items-center">
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center text-[12px] font-sans text-[#3b3b3b]">

          {/* Left */}
          <div className="flex items-center gap-2">
            <span>Ship to:</span>
            <button className="flex items-center gap-1">
              India <span className="text-[10px]">▼</span>
            </button>
          </div>

          {/* Center Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-serif text-[22px] tracking-[3px] text-[#9c7c3a]">
              kalaqx
            </span>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            <Search
              className="w-[18px] h-[18px] cursor-pointer"
              onClick={() => setIsSearchOpen(true)}
            />
            <div className="relative profile-dropdown">
              <User 
                className="w-[18px] h-[18px] cursor-pointer" 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              />
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e6ddd2] rounded-md shadow-lg z-50">
                  <div className="py-1">
                    {!isLoggedIn ? (
                      <Link 
                        to="/login" 
                        className="block px-4 py-2 text-sm text-[#3b3b3b] hover:bg-[#fbf7f2] transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Login
                      </Link>
                    ) : (
                      <>
                        <Link 
                          to="/orders" 
                          className="block px-4 py-2 text-sm text-[#3b3b3b] hover:bg-[#fbf7f2] transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Order History
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-[#3b3b3b] hover:bg-[#fbf7f2] transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link to="/wishlist" className="hover:opacity-70 transition-opacity">
              <Heart className="w-[18px] h-[18px]" />
            </Link>
            <Link to="/shopping-cart" className="hover:opacity-70 transition-opacity">
              <ShoppingBag className="w-[18px] h-[18px]" />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP MENU ================= */}
      <nav className="hidden lg:block border-t border-[#e6ddd2]">
        <ul className="max-w-7xl mx-auto h-[44px] flex items-center justify-center gap-8 font-sans text-[12px] tracking-[0.12em] uppercase text-[#3b3b3b]">
          {navigations.map((item) => (
            <li key={item.slug}>
              <Link
                to={`/${item.slug}`}
                className="hover:text-black transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ================= MOBILE HEADER ================= */}
      <div className="lg:hidden h-[56px] px-2 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-[10px]">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-[20px] h-[20px] text-[#3b3b3b]" />
          </button>

          {/* WhatsApp */}
          {/* <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noreferrer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#0b7a5a">
              <path d="M20.52 3.48A11.91 11.91 0 0012.01 0C5.38 0 .02 5.35.02 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.94 11.94 0 005.7 1.45h.01c6.62 0 11.98-5.35 11.98-11.94 0-3.19-1.25-6.19-3.47-8.38z" />
            </svg>
          </a> */}
        </div>

        {/* Center Logo */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center gap-1"
        >
          <Logo size="sm" />
          <span className="font-serif text-[14px] tracking-[1px] text-[#9c7c3a]">
            kalaqx
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-[10px]">
          <Search
            className="w-[18px] h-[18px] text-[#3b3b3b]"
            onClick={() => setIsSearchOpen(true)}
          />
          <div className="relative profile-dropdown">
            <User 
              className="w-[18px] h-[18px] text-[#3b3b3b] cursor-pointer" 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            />
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e6ddd2] rounded-md shadow-lg z-50">
                <div className="py-1">
                  {!isLoggedIn ? (
                    <Link 
                      to="/login" 
                      className="block px-4 py-2 text-sm text-[#3b3b3b] hover:bg-[#fbf7f2] transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Login
                    </Link>
                  ) : (
                    <>
                      <Link 
                        to="/orders" 
                        className="block px-4 py-2 text-sm text-[#3b3b3b] hover:bg-[#fbf7f2] transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Order History
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-[#3b3b3b] hover:bg-[#fbf7f2] transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <Link to="/wishlist" className="hover:opacity-70 transition-opacity">
            <Heart className="w-[18px] h-[18px] text-[#3b3b3b]" />
          </Link>
          <Link to="/shopping-cart" className="hover:opacity-70 transition-opacity">
            <ShoppingBag className="w-[18px] h-[18px] text-[#3b3b3b]" />
          </Link>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#e6ddd2]">
          <ul className="py-4 px-4 space-y-3">
            {navigations.map((item) => (
              <li key={item.slug}>
                <Link
                  to={`/${item.slug}`}
                  className="block py-2 text-[14px] font-sans tracking-[0.12em] uppercase text-[#3b3b3b] hover:text-black transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>

    <SearchModal
      isOpen={isSearchOpen}
      onClose={() => setIsSearchOpen(false)}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSubmit={handleSearch}
    />
    </>
  )
}

export default Navbar
