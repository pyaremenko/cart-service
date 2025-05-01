import { atom } from "jotai"
import type { Product } from "@/lib/types"

export const productsAtom = atom<Product[]>([])
export const loadingProductsAtom = atom<boolean>(false)
