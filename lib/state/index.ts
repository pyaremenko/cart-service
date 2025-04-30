export * from "./product-atoms";
export * from "./cart-atoms";
export * from "./user-atoms";

export { Provider as StateProvider } from "jotai";

export function getInitialState() {
  return {
    products: [],
    cart: {
      items: [],
      queuePositions: {},
      reservations: {},
    },
    user: {
      id: 101,
      name: "Demo User",
    },
  };
}
