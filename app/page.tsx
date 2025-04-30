import ProductList from "@/components/product-list"
import { CartProvider } from "@/lib/providers/cart-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">Product Catalog</h1>
          <p className="text-gray-500 mb-8 text-center max-w-2xl mx-auto">
            Browse our exclusive collection of limited-stock items. Add products to your cart to reserve them before
            they sell out.
          </p>
          <CartProvider>
            <ProductList />
          </CartProvider>
        </div>
      </main>
      <Footer />
    </div>
  )
}
