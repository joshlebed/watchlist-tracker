export type Category = "movie" | "book" | "tv";

export interface Item {
  id: string;
  title: string;
  count: number;
  completed: boolean;
  category: Category;
}

export interface TabLabels {
  incomplete: string;
  completed: string;
}

export interface ItemMenuPosition {
  x: number;
  y: number;
}

export interface ItemMenuProps {
  item: Item & { position: ItemMenuPosition };
  onClose: () => void;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}