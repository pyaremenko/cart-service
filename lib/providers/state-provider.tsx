"use client"

import type { ReactNode } from "react"
import { Provider } from "jotai"

interface StateProviderProps {
  children: ReactNode
}

export function StateProvider({ children }: StateProviderProps) {
  return <Provider>{children}</Provider>
}
