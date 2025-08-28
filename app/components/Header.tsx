import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MoreVertical, ChevronDown } from "lucide-react-native";
import { Category } from "../types";
import { categoryDisplayNames } from "../constants";
import { darkTheme } from "../constants/colors";

interface HeaderProps {
  selectedCategory: Category;
  onCategoryPress: () => void;
  onMenuPress: (e: any) => void;
  showCategoryMenu: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCategory,
  onCategoryPress,
  onMenuPress,
  showCategoryMenu,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={onCategoryPress}
        >
          <Text style={styles.title}>
            {categoryDisplayNames[selectedCategory] ?? "Movie"}
          </Text>
          <View style={styles.downButtonContainer}>
            <ChevronDown size={20} color={darkTheme.text} />
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>Recs</Text>
      </View>
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <MoreVertical size={24} color={darkTheme.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  downButtonContainer: {
    paddingTop: 5,
  },
  categoryButton: {
    display: "flex",
    flexDirection: "row",
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: darkTheme.text,
  },
  menuButton: {
    padding: 8,
  },
});