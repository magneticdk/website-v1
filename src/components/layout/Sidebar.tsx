'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  PenTool,
  Target,
  Database,
  Heart,
  Map,
  FileText,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const toolNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Tekstforfatter', href: '/tool/copywriter', icon: PenTool },
  { label: 'Strategi Arkitekt', href: '/tool/strategy', icon: Target },
  { label: 'Datarensning', href: '/tool/data-cleansing', icon: Database },
  { label: 'Stewardship', href: '/tool/stewardship', icon: Heart },
  { label: 'Støtterejse', href: '/tool/journey', icon: Map },
  { label: 'Case Builder', href: '/tool/case-builder', icon: FileText },
]

const bottomNavItems: NavItem[] = [
  { label: 'Bibliotek', href: '/library', icon: BookOpen },
  { label: 'Profil', href: '/profile', icon: User },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  const NavLinks = () => (
    <>
      {/* Logo/Brand */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#1B4F72]">Magnetic</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        {toolNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                active
                  ? 'bg-blue-50 text-[#1B4F72] font-medium'
                  : 'text-[#718096] hover:bg-gray-50 hover:text-[#333333]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* Separator */}
        <div className="py-3">
          <div className="border-t border-gray-200" />
        </div>

        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                active
                  ? 'bg-blue-50 text-[#1B4F72] font-medium'
                  : 'text-[#718096] hover:bg-gray-50 hover:text-[#333333]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="p-3">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full text-[#718096] hover:bg-gray-50 hover:text-[#E74C3C] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Log ud</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-[#1B4F72]"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <NavLinks />
      </aside>

      {/* Spacer for desktop layout */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  )
}
