"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function ProductCarousel() {
  const [api, setApi] = React.useState()
  const [items, setItems] = React.useState([])
  const [activeIndex, setActiveIndex] = React.useState(0)

  // Fetch pokemones
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=11")
      const data = await res.json()

      const detailed = await Promise.all(
        data.results.map(async (p) => {
          const res2 = await fetch(p.url)
          return res2.json()
        })
      )

      setItems(detailed)
    }

    fetchData()
  }, [])

  // Detectar centro activo
  React.useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    onSelect()

    return () => api.off("select", onSelect)
  }, [api])

  return (
    <div className="w-full max-w-5xl mx-auto py-16 text-center">

      {/* Nombre dinámico */}
      {items[activeIndex] && (
        <h2 className="text-3xl font-bold mb-6 capitalize">
          {items[activeIndex].name}
        </h2>
      )}

      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {items.map((item, index) => {
            const isActive = index === activeIndex

            return (
              <CarouselItem
                key={item.id}
                className="basis-1/3 flex justify-center"
              >
                <div
                  className={`transition-all duration-500 ${
                    isActive
                      ? "scale-110 opacity-100"
                      : "scale-75 opacity-50"
                  }`}
                >
                  <img
                    src={item.sprites.front_default}
                    alt={item.name}
                    className="w-40 h-40 object-contain"
                  />
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