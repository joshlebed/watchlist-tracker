import { Category, TabLabels } from "../types";

export const getTabLabels = (category: Category): TabLabels => {
  switch (category) {
    case "book":
      return { incomplete: "Unread", completed: "Read" };
    case "movie":
      return { incomplete: "Unwatched", completed: "Watched" };
    case "tv":
      return { incomplete: "Unwatched", completed: "Watched" };
  }
};