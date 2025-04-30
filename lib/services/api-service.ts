import axios from "axios";
import type {
  AddToCartDto,
  Product,
  QueuePositionDto,
  ReservationDto,
} from "@/lib/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

const mockProducts: Product[] = [
  { id: 1, name: "Limited Edition Headphones", available: 5 },
  {
    id: 2,
    name: "Exclusive Gaming Console ",
    available: 2,
  },
  { id: 3, name: "Premium Smartwatch ", available: 10 },
  { id: 4, name: "Collector's Edition Figurine ", available: 1 },
  { id: 5, name: "Special Release Designer Sneakers", available: 3 },
  { id: 6, name: "Rare Vintage Vinyl Record", available: 0 },
  { id: 7, name: "Ultra HD Smart Camera with ", available: 7 },
  { id: 8, name: "Limited Run Art Book ", available: 4 },
  { id: 9, name: "Mechanical Keyboard", available: 8 },
];

const mockInventory: Record<number, number> = {
  1: 5,
  2: 2,
  3: 10,
  4: 1,
  5: 3,
  6: 0,
  7: 7,
  8: 4,
  9: 8,
};

const mockReservations: Record<number, number[]> = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
};

const mockQueues: Record<number, number[]> = {
  1: [102, 103, 104],
  2: [105, 106],
  3: [],
  4: [107, 108, 109, 110],
  5: [111],
  6: [112, 113, 114, 115, 116],
  7: [],
  8: [117],
  9: [],
};

const mockUserReservations: Record<string, number> = {
  "101-1": 1001,
  "101-3": 1002,
};

const USE_MOCK_DATA = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchProducts(): Promise<Product[]> {
  if (USE_MOCK_DATA) {
    await delay(800);
    return [...mockProducts];
  }

  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function addToCart(data: AddToCartDto): Promise<void> {
  if (USE_MOCK_DATA) {
    await delay(1000);

    const { userId, productId } = data;

    if (!mockInventory[productId] || mockInventory[productId] <= 0) {
      throw new Error("Product out of stock");
    }

    if (mockReservations[productId].includes(userId)) {
      throw new Error("Product already reserved by this user");
    }

    mockReservations[productId].push(userId);
    mockInventory[productId] -= 1;

    return;
  }

  try {
    await api.post("/cart/add", data);
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function checkQueuePosition(
  userId: number,
  productId: number
): Promise<QueuePositionDto | ReservationDto> {
  if (USE_MOCK_DATA) {
    await delay(600);

    const reservationKey = `${userId}-${productId}`;
    if (mockUserReservations[reservationKey]) {
      return {
        reservationId: mockUserReservations[reservationKey],
      };
    }

    const queue = mockQueues[productId] || [];
    const position = queue.indexOf(userId);

    if (position === -1) {
      const random = Math.random();

      if (random < 0.3) {
        const reservationId = Math.floor(1000 + Math.random() * 9000);
        mockUserReservations[reservationKey] = reservationId;

        return {
          reservationId,
        };
      } else {
        queue.push(userId);
        return {
          queuePosition: queue.length,
        };
      }
    }

    return {
      queuePosition: position + 1,
    };
  }

  try {
    const response = await api.get(
      `/queue/position?userId=${userId}&productId=${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error checking queue position:", error);
    throw error;
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 409:
          return Promise.reject(
            new Error("Product is out of stock or already reserved")
          );
        case 500:
          return Promise.reject(
            new Error("Server error. Please try again later.")
          );
      }
    }
    return Promise.reject(error);
  }
);

export { api, mockProducts };
