import MainNav from '@/components/MainNav'
import ProductDetail from '@/components/ProductDetail'
import RelatedProducts from '@/components/RelatedProducts'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { use } from 'react'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params)
  
  return (
    <div>
      <MainNav />
      <ProductDetail slug={slug} />
      <RelatedProducts currentProductSlug={slug} />
      <Footer />
      <BackToTop />
    </div>
  )
}

