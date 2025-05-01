"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { userAtom, addToCartAtom } from "@/lib/state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import type { Product } from "@/lib/types";
import { Loader2, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [user] = useAtom(userAtom);
  const [_, addToCart] = useAtom(addToCartAtom);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart({
        userId: user ? user.id : 101,
        productId: product.id,
      });

      toast({
        title: "Success",
        description: "Product added to cart or queued for reservation",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add product to cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-[400px] flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md bg-white">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
          <CardTitle className="text-lg line-clamp-2">
            ID: {product.id}
          </CardTitle>
          <Badge
            variant={product.available > 0 ? "default" : "destructive"}
            className={
              product.available > 0 ? "bg-rose-600 hover:bg-rose-700" : ""
            }
          >
            {product.available > 0
              ? `${product.available} available`
              : "Out of stock"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="relative h-48 w-full mb-4 bg-gray-100 rounded-md overflow-hidden">
          <Image
            src={`/generic-product-display.png?height=200&width=300&query=product ${product.id}`}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < 4
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-2">4.0 (24 reviews)</span>
        </div>
        <div className="text-xl font-bold text-rose-600 mt-auto">
          ${(product.id * 49.99).toFixed(2)}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-rose-600 hover:bg-rose-700"
          onClick={handleAddToCart}
          disabled={loading || product.available <= 0}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
