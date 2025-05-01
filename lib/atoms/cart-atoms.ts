import { atom } from "jotai"
import type { CartItem, QueuePositions, Reservations } from "@/lib/types"

export const cartItemsAtom = atom<CartItem[]>([])
export const queuePositionsAtom = atom<QueuePositions>({})
export const reservationsAtom = atom<Reservations>({})
export const loadingCartAtom = atom<boolean>(false)
