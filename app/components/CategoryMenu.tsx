import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Category } from "../types";
import { CATEGORIES, categoryDisplayNames } from "../constants";
import { darkTheme } from "../constants/colors";

interface CategoryMenuProps {
  visible: boolean;
  selectedCategory: Category;
  onCategorySelect: (category: Category) => void;
}

export const CategoryMenu: React.FC<CategoryMenuProps> = ({
  visible,
  selectedCategory,
  onCategorySelect,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.categoryMenu}>
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category}
          style={styles.categoryMenuItem}
          onPress={() => onCategorySelect(category)}
        >
          <Text
            style={[
              styles.categoryMenuText,
              selectedCategory === category && styles.categoryMenuTextActive,
            ]}
          >
            {categoryDisplayNames[category] ?? "Movie"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryMenu: {
    position: "absolute",
    top: 20,
    left: 16,
    backgroundColor: darkTheme.menuBackground,
    borderRadius: 12,
    padding: 8,
    shadowColor: darkTheme.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 1000,
  },
  categoryMenuItem: {
    padding: 12,
    borderRadius: 8,
  },
  categoryMenuText: {
    fontSize: 16,
    color: darkTheme.text,
  },
  categoryMenuTextActive: {
    color: darkTheme.primary,
    fontWeight: "600",
  },
});