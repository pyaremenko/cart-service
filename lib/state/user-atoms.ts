import { atom } from "jotai";
import type { User } from "@/lib/types";

const mockUser: User = {
  id: 101,
  name: "Demo User",
};

export const userAtom = atom<User | null>(mockUser);
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);

export const loginUserAtom = atom(null, (_, set, user: User) => {
  set(userAtom, user);
});

export const logoutUserAtom = atom(null, (_, set) => {
  set(userAtom, null);
});

export const updateUserAtom = atom(null, (get, set, updates: Partial<User>) => {
  const currentUser = get(userAtom);
  if (currentUser) {
    set(userAtom, { ...currentUser, ...updates });
  }
});
