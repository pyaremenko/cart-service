import { atom } from "jotai";
import type { CartItem, QueuePositions, Reservations } from "@/lib/types";
import { addToCart, checkQueuePosition } from "@/lib/services/api-service";

export const cartItemsAtom = atom<CartItem[]>([]);
export const queuePositionsAtom = atom<QueuePositions>({});
export const reservationsAtom = atom<Reservations>({});
export const loadingCartAtom = atom<boolean>(false);
export const errorCartAtom = atom<string | null>(null);

export const cartCountAtom = atom((get) => get(cartItemsAtom).length);

export const hasReservationsAtom = atom(
  (get) => Object.keys(get(reservationsAtom)).length > 0
);

export const cartSubtotalAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((total, item) => {
    return total + item.productId * 49.99;
  }, 0);
});

export const cartTotalAtom = atom((get) => {
  const subtotal = get(cartSubtotalAtom);
  const shipping = subtotal > 0 ? 9.99 : 0;
  return subtotal + shipping;
});

export const addToCartAtom = atom(
  null,
  async (
    get,
    set,
    { userId, productId }: { userId: number; productId: number }
  ) => {
    set(loadingCartAtom, true);
    set(errorCartAtom, null);

    try {
      await addToCart({ userId, productId });

      const currentItems = get(cartItemsAtom);
      if (!currentItems.some((item) => item.productId === productId)) {
        set(cartItemsAtom, [...currentItems, { productId }]);
      }
    } catch (error) {
      set(
        errorCartAtom,
        error instanceof Error ? error.message : "Failed to add to cart"
      );
      throw error;
    } finally {
      set(loadingCartAtom, false);
    }
  }
);

export const removeFromCartAtom = atom(null, (get, set, productId: number) => {
  const currentItems = get(cartItemsAtom);
  set(
    cartItemsAtom,
    currentItems.filter((item) => item.productId !== productId)
  );

  const currentQueuePositions = get(queuePositionsAtom);
  const currentReservations = get(reservationsAtom);

  const newQueuePositions = { ...currentQueuePositions };
  const newReservations = { ...currentReservations };

  delete newQueuePositions[productId];
  delete newReservations[productId];

  set(queuePositionsAtom, newQueuePositions);
  set(reservationsAtom, newReservations);
});

export const checkQueueStatusAtom = atom(
  null,
  async (
    get,
    set,
    { userId, productId }: { userId: number; productId: number }
  ) => {
    try {
      const result = await checkQueuePosition(userId, productId);

      if ("queuePosition" in result) {
        set(queuePositionsAtom, (prev) => ({
          ...prev,
          [productId]: result.queuePosition,
        }));
      } else if ("reservationId" in result) {
        set(reservationsAtom, (prev) => ({
          ...prev,
          [productId]: { reservationId: result.reservationId },
        }));

        set(queuePositionsAtom, (prev) => {
          const newPositions = { ...prev };
          delete newPositions[productId];
          return newPositions;
        });
      }

      return result;
    } catch (error) {
      console.error("Error checking queue status:", error);
      throw error;
    }
  }
);

export const updateQueuePositionAtom = atom(
  null,
  (
    get,
    set,
    { productId, position }: { productId: number; position: number }
  ) => {
    const currentPositions = get(queuePositionsAtom);
    set(queuePositionsAtom, {
      ...currentPositions,
      [productId]: position,
    });
  }
);

export const addReservationAtom = atom(
  null,
  (
    get,
    set,
    { productId, reservationId }: { productId: number; reservationId: number }
  ) => {
    const currentReservations = get(reservationsAtom);
    set(reservationsAtom, {
      ...currentReservations,
      [productId]: { reservationId },
    });

    const currentQueuePositions = get(queuePositionsAtom);
    const newQueuePositions = { ...currentQueuePositions };
    delete newQueuePositions[productId];
    set(queuePositionsAtom, newQueuePositions);
  }
);

export const clearCartAtom = atom(null, (_, set) => {
  set(cartItemsAtom, []);
  set(queuePositionsAtom, {});
  set(reservationsAtom, {});
});
