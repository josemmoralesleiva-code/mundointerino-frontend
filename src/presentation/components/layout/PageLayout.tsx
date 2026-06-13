import { type ReactNode } from 'react'
import Footer from './Footer'
import CTABanner from './CTABanner'

interface PageLayoutProps {
  children: ReactNode
  showCTA?: boolean
  showFooter?: boolean
}

export default function PageLayout({ children, showCTA = true, showFooter = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      {children}
      {showCTA && <CTABanner />}
      {showFooter && <Footer />}
    </div>
  )
}
