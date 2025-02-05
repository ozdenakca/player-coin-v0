import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth } from "@/lib/firebase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkAuth = () => {
  if (typeof window === "undefined") return false;

  // Check Firebase auth
  if (!auth.currentUser) return false;

  const sessionStart = sessionStorage.getItem("sessionStart");
  if (!sessionStart) return false;

  const sessionStartTime = parseInt(sessionStart, 10);
  const currentTime = Date.now();
  const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  return currentTime - sessionStartTime < twoHours;
};
