import { Category } from "../types";

export const STORAGE_KEY = "@recommendations";

export const categoryDisplayNames: Record<Category, string> = {
  movie: "Movie",
  tv: "TV",
  book: "Book",
};

export const CATEGORIES: readonly Category[] = ["movie", "tv", "book"] as const;