import { atom } from "jotai";
import type { Product } from "@/lib/types";
import { fetchProducts } from "@/lib/services/api-service";

export const productsAtom = atom<Product[]>([]);
export const loadingProductsAtom = atom<boolean>(false);
export const errorProductsAtom = atom<string | null>(null);
export const selectedProductIdAtom = atom<number | null>(null);

export const selectedProductAtom = atom((get) => {
  const products = get(productsAtom);
  const selectedId = get(selectedProductIdAtom);

  if (selectedId === null) return null;
  return products.find((product) => product.id === selectedId) || null;
});

export const filteredProductsAtom = atom((get) => get(productsAtom));

export const fetchProductsAtom = atom(null, async (_, set) => {
  set(loadingProductsAtom, true);
  set(errorProductsAtom, null);

  try {
    const products = await fetchProducts();
    set(productsAtom, products);
  } catch (error) {
    set(
      errorProductsAtom,
      error instanceof Error ? error.message : "Failed to fetch products"
    );
    console.error("Error fetching products:", error);
  } finally {
    set(loadingProductsAtom, false);
  }
});

export const setProductsAtom = atom(null, (_, set, products: Product[]) => {
  set(productsAtom, products);
});

export const setLoadingProductsAtom = atom(null, (_, set, loading: boolean) => {
  set(loadingProductsAtom, loading);
});

export const selectProductAtom = atom(
  null,
  (_, set, productId: number | null) => {
    set(selectedProductIdAtom, productId);
  }
);
