export interface Product {
  id: number;
  name: string;
  available: number;
}

export interface User {
  id: number;
  name: string;
}

export interface CartItem {
  productId: number;
}

export interface QueuePositions {
  [productId: number]: number;
}

export interface Reservations {
  [productId: number]: {
    reservationId: number;
  };
}

export interface AddToCartDto {
  userId: number;
  productId: number;
}

export interface QueuePositionDto {
  queuePosition: number;
}

export interface ReservationDto {
  reservationId: number;
}
