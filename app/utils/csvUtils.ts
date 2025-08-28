import { Item, Category } from "../types";

export const exportToCSV = (items: Item[]): string => {
  return items
    .map(
      (item) =>
        `"${item.title}",${item.count},${item.completed},${item.category}`
    )
    .join("\n");
};

export const parseCSV = (csvString: string): Item[] => {
  const lines = csvString
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return lines.map((line) => {
    const [title, count, completed, category] = line
      .split(",")
      .map((item) => item.trim());
    return {
      id: Date.now().toString() + Math.random(),
      title: title.replace(/^"|"$/g, ""),
      count: parseInt(count, 10) || 1,
      completed: completed === "true",
      category: category as Category,
    };
  });
};