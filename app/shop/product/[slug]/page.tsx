import MainNav from '@/components/MainNav'
import ProductDetail from '@/components/ProductDetail'
import RelatedProducts from '@/components/RelatedProducts'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div>
      <MainNav />
      <ProductDetail slug={params.slug} />
      <RelatedProducts currentProductSlug={params.slug} />
      <Footer />
      <BackToTop />
    </div>
  )
}

