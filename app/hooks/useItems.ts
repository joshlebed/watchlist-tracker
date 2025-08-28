import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Item, Category } from "../types";
import { STORAGE_KEY } from "../constants";

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error("Error loading items:", error);
    }
  };

  const saveItems = async (updatedItems: Item[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Error saving items:", error);
    }
  };

  const addItem = (itemTitle: string, selectedCategory: Category) => {
    if (!itemTitle.trim()) return;

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (m) =>
          m.title.toLowerCase() === itemTitle.toLowerCase() &&
          m.category === selectedCategory
      );

      let updatedItems;
      if (existingItem) {
        updatedItems = currentItems.map((m) =>
          m.id === existingItem.id ? { ...m, count: m.count + 1 } : m
        );
      } else {
        updatedItems = [
          ...currentItems,
          {
            id: Date.now().toString(),
            title: itemTitle.trim(),
            count: 1,
            completed: false,
            category: selectedCategory,
          },
        ];
      }

      saveItems(updatedItems);
      return updatedItems;
    });
  };

  const updateCount = (id: string, increment: boolean) => {
    setItems((currentItems) => {
      const updatedItems = currentItems
        .map((item) => {
          if (item.id === id) {
            const newCount = increment ? item.count + 1 : item.count - 1;
            return newCount > 0 ? { ...item, count: newCount } : null;
          }
          return item;
        })
        .filter((item): item is Item => item !== null);

      saveItems(updatedItems);
      return updatedItems;
    });
  };

  const deleteItem = (id: string) => {
    setItems((currentItems) => {
      const updatedItems = currentItems.filter((item) => item.id !== id);
      saveItems(updatedItems);
      return updatedItems;
    });
  };

  const toggleCompleted = (id: string) => {
    setItems((currentItems) => {
      const updatedItems = currentItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      saveItems(updatedItems);
      return updatedItems;
    });
  };

  const updateItem = (id: string, newTitle: string) => {
    setItems((currentItems) => {
      const updatedItems = currentItems.map((item) =>
        item.id === id ? { ...item, title: newTitle.trim() } : item
      );
      saveItems(updatedItems);
      return updatedItems;
    });
  };

  const bulkAddItems = (itemTitles: string[], selectedCategory: Category) => {
    itemTitles.forEach((title) => addItem(title, selectedCategory));
  };

  const replaceAllItems = (newItems: Item[]) => {
    setItems(newItems);
    saveItems(newItems);
  };

  return {
    items,
    addItem,
    updateCount,
    deleteItem,
    toggleCompleted,
    updateItem,
    bulkAddItems,
    replaceAllItems,
  };
};