"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  userAtom,
  cartItemsAtom,
  queuePositionsAtom,
  reservationsAtom,
  cartSubtotalAtom,
  cartTotalAtom,
  checkQueueStatusAtom,
  removeFromCartAtom,
} from "@/lib/state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShoppingBag, Clock, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CartStatus() {
  const [user] = useAtom(userAtom);
  const [cartItems] = useAtom(cartItemsAtom);
  const [queuePositions] = useAtom(queuePositionsAtom);
  const [reservations] = useAtom(reservationsAtom);
  const [subtotal] = useAtom(cartSubtotalAtom);
  const [total] = useAtom(cartTotalAtom);
  const [_, checkQueueStatus] = useAtom(checkQueueStatusAtom);
  const [__, removeFromCart] = useAtom(removeFromCartAtom);

  const userId = user ? user.id : 101;

  useEffect(() => {
    if (cartItems.length === 0) return;

    const checkQueuePositions = async () => {
      for (const item of cartItems) {
        try {
          await checkQueueStatus({
            userId,
            productId: item.productId,
          });
        } catch (error) {
          console.error("Failed to check queue position:", error);
        }
      }
    };

    const intervalId = setInterval(checkQueuePositions, 5000);
    checkQueuePositions();

    return () => clearInterval(intervalId);
  }, [cartItems, checkQueueStatus, userId]);

  if (cartItems.length === 0) {
    return (
      <Card className="h-full bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-rose-600" />
            Your Cart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Button
              variant="outline"
              className="text-rose-600 border-rose-600 hover:bg-rose-50"
            >
              Browse Products
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5 text-rose-600" />
          Your Cart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4 divide-y">
          {cartItems.map((item) => {
            const queuePosition = queuePositions[item.productId];
            const reservation = reservations[item.productId];

            return (
              <li key={item.productId} className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-md mr-3 relative overflow-hidden">
                      <Image
                        src={`/generic-product-display.png?height=50&width=50&query=product ${item.productId}`}
                        alt={`Product ${item.productId}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Product #{item.productId}</p>
                      <p className="text-sm text-gray-500">
                        ${(item.productId * 49.99).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>

                <div className="mt-2">
                  {reservation ? (
                    <div className="flex items-center bg-green-50 p-2 rounded-md">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-green-700">
                        Reserved (ID: {reservation.reservationId})
                      </span>
                    </div>
                  ) : queuePosition !== undefined ? (
                    <div className="flex items-center bg-amber-50 p-2 rounded-md">
                      <Clock className="h-4 w-4 text-amber-600 mr-2" />
                      <span className="text-sm text-amber-700">
                        Queue Position: {queuePosition}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center bg-gray-50 p-2 rounded-md">
                      <Loader2 className="h-4 w-4 text-gray-600 mr-2 animate-spin" />
                      <span className="text-sm text-gray-700">
                        Checking status...
                      </span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              ${(total - subtotal).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Button className="w-full mt-4 bg-rose-600 hover:bg-rose-700">
            Proceed to Checkout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
