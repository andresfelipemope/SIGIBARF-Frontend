"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useRouter } from "next/navigation"

export function ProductCarousel() {
  const router = useRouter()
  const [api, setApi] = React.useState()
  const [products, setProducts] = React.useState([])
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/inventario/public/productos/`
        )

        if (!response.ok) {
          throw new Error("Error cargando productos")
        }

        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchProducts()
  }, [])

  React.useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    onSelect()

    return () => api.off("select", onSelect)
  }, [api])

  if (!products.length) return null

  return (
    <div className="w-full max-w-6xl mx-auto py-16 text-center">
      {products[activeIndex] && (
        <>
          <h2 className="text-3xl font-bold mb-2">
            {products[activeIndex].nombre}
          </h2>

          <p className="text-xl font-semibold text-orange-500 mb-8">
            ${Number(products[activeIndex].precio).toLocaleString("es-CO")}
          </p>
        </>
      )}

      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {products.map((product, index) => {
            const isActive = index === activeIndex

            return (
              <CarouselItem
                key={product.id}
                className="basis-1/3 flex justify-center"
              >
                <div
                  onClick={() => router.push(`/catalogo/${product.id}`)}
                  className={`cursor-pointer transition-all duration-500 ${
                    isActive
                      ? "scale-105 opacity-100"
                      : "scale-90 opacity-50"
                  }`}
                >
                  <div className="w-52 h-52 rounded-3xl overflow-hidden bg-white shadow-lg border border-gray-200">
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}