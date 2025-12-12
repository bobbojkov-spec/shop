import MainNav from '@/components/MainNav'
import ShopHeader from '@/components/ShopHeader'
import ProductListing from '@/components/ProductListing'
import SearchSection from '@/components/SearchSection'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'

export default function ShopPage() {
  return (
    <div>
      <MainNav />
      <ShopHeader />
      <ProductListing />
      <SearchSection />
      <Footer />
      <BackToTop />
    </div>
  )
}

