"use client"

import type { ReactNode } from "react"
import { StateProvider } from "@/lib/providers/state-provider"
import CartStatus from "@/components/cart-status"

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  return (
    <StateProvider>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">{children}</div>
        <div className="lg:col-span-1">
          <CartStatus />
        </div>
      </div>
    </StateProvider>
  )
}
