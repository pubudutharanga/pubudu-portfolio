// resizable-navbar.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiCode } from 'react-icons/fi'

/**
 * Aceternity UI Resizable Navbar component suite.
 * Automatically condenses from full-width to a centered floating rounded capsule when scrolling down
 * on desktop and tablet screens (>=768px), while maintaining standard full-width behavior on mobile (<768px).
 */

export function Navbar({ children, className = "" }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none transition-all duration-500 ${className}`}>
      <div
        className={`pointer-events-auto transition-all duration-500 w-full flex flex-col md:flex-row items-center justify-between ${
          scrolled
            ? "md:w-[92%] md:max-w-6xl md:mt-3 md:rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md md:border md:border-gray-200/80 md:dark:border-gray-700/80 shadow-xl shadow-black/5 md:px-8 py-3 px-4 sm:px-6 border-b border-gray-200/50 dark:border-gray-800/50 md:border-b"
            : "max-w-7xl mt-0 rounded-none bg-transparent border-transparent py-4 px-4 sm:px-6 lg:px-8"
        }`}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { scrolled })
          }
          return child
        })}
      </div>
    </div>
  )
}

export function NavBody({ children, scrolled, className = "" }) {
  return (
    <div className={`hidden md:flex w-full items-center justify-between transition-all duration-500 ${className}`}>
      {children}
    </div>
  )
}

export function NavItems({ items = [], className = "" }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleAction = (item) => {
    if (item.action) {
      item.action()
    } else if (item.link) {
      if (item.link.startsWith('#')) {
        const id = item.link.substring(1)
        if (location.pathname !== '/') {
          navigate('/')
          setTimeout(() => {
            const el = document.getElementById(id)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 100)
        } else {
          const el = document.getElementById(id)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      } else {
        navigate(item.link)
      }
    }
  }

  return (
    <div className={`flex items-center gap-6 lg:gap-8 ${className}`}>
      {items.map((item, idx) => (
        <button
          key={`nav-item-${idx}`}
          type="button"
          onClick={() => handleAction(item)}
          className="relative text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 py-1 cursor-pointer group"
        >
          <span>{item.name || item.label}</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:w-full transition-all duration-300" />
        </button>
      ))}
    </div>
  )
}

export function NavbarLogo({ siteName = "Pubudu Tharanga", siteTitle = "Full Stack Developer", onClick, className = "" }) {
  const navigate = useNavigate()
  const handleClick = () => {
    if (onClick) onClick()
    else navigate('/')
  }

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 cursor-pointer group select-none ${className}`}
    >
      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 shadow-md group-hover:rotate-6">
        <FiCode className="text-white text-lg sm:text-xl" />
      </div>
      <div>
        <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:scale-[1.02] transition-transform duration-300">
          {siteName}
        </div>
        {siteTitle && (
          <div className="hidden sm:block text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
            {siteTitle}
          </div>
        )}
      </div>
    </div>
  )
}

export function NavbarButton({ children, variant = "primary", onClick, className = "" }) {
  const isPrimary = variant === "primary"
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${
        isPrimary
          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-blue-500/20 shadow-md"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function MobileNav({ children, className = "" }) {
  return (
    <div className={`flex md:hidden w-full flex-col ${className}`}>
      {children}
    </div>
  )
}

export function MobileNavHeader({ children, className = "" }) {
  return (
    <div className={`flex w-full items-center justify-between ${className}`}>
      {children}
    </div>
  )
}

export function MobileNavToggle({ isOpen, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle mobile navigation"
      className={`p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
    >
      {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
    </button>
  )
}

export function MobileNavMenu({ isOpen, onClose, children, className = "" }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`overflow-hidden pt-4 pb-3 flex flex-col gap-3 border-t border-gray-200/50 dark:border-gray-800/50 mt-3 ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
