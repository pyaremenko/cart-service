import { atom } from "jotai";
import type { User } from "@/lib/types";

const mockUser: User = {
  id: 101,
  name: "Demo User",
};

export const userAtom = atom<User | null>(mockUser);
