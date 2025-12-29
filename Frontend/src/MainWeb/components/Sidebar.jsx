"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import {
  X,
  ChevronRight,
  User,
  Heart,
  ShoppingBag,
  HelpCircle
} from "lucide-react"

const menuItems = [
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Sneakers", href: "/sneakers" },
  { label: "Collections", href: "/collections" },
]

const Sidebar = ({ isOpen, onClose }) => {

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => (document.body.style.overflow = "")
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[88%] max-w-sm
          bg-[#fbf7f2] rounded-r-2xl shadow-2xl border-r border-[#e6ddd2]
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-[#e6ddd2] bg-[#fbf7f2]">
          <h2 className="text-xl font-serif font-medium tracking-[3px] text-[#9c7c3a]">ANITA DONGRE</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-[#3b3b3b] hover:text-[#9c7c3a]" />
          </button>
        </div>

        {/* Main Menu */}
        <div className="px-5 py-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={onClose}
              className="flex items-center justify-between py-4 px-3 rounded-xl
                hover:bg-[#e6ddd2] transition-colors"
            >
              <span className="text-base font-sans font-medium text-[#3b3b3b] hover:text-[#9c7c3a]">
                {item.label}
              </span>
              <ChevronRight className="w-5 h-5 text-[#9c7c3a]" />
            </Link>
          ))}

          <Link
            to="/sale"
            onClick={onClose}
            className="flex items-center justify-between py-4 px-3 rounded-xl
              bg-[#9c7c3a] text-[#fbf7f2] font-serif font-medium"
          >
            Sale
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-[#e6ddd2]" />

        {/* Account Section */}
        <div className="px-5 py-4 space-y-3">
          <Link
            to="/user-login"
            onClick={onClose}
            className="flex items-center gap-3 py-3 hover:text-[#9c7c3a] transition-colors"
          >
            <User className="w-5 h-5 text-[#9c7c3a]" />
            <span className="font-sans text-[#3b3b3b]">Sign In</span>
          </Link>

          <Link
            to="/wishlist"
            onClick={onClose}
            className="flex items-center gap-3 py-3 hover:text-[#9c7c3a] transition-colors"
          >
            <Heart className="w-5 h-5 text-[#9c7c3a]" />
            <span className="font-sans text-[#3b3b3b]">Wishlist</span>
          </Link>

          <Link
            to="/shopping-cart"
            onClick={onClose}
            className="flex items-center gap-3 py-3 hover:text-[#9c7c3a] transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-[#9c7c3a]" />
            <span className="font-sans text-[#3b3b3b]">My Cart</span>
          </Link>
        </div>

        {/* Bottom Support */}
        <div className="absolute bottom-0 left-0 w-full border-t border-[#e6ddd2] px-5 py-4 bg-[#fbf7f2]">
          <Link
            to="/help"
            onClick={onClose}
            className="flex items-center gap-3 text-[#3b3b3b] hover:text-[#9c7c3a] transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-[#9c7c3a]" />
            <span className="font-sans">Help & Support</span>
          </Link>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
