import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";
import { darkTheme } from "../constants/colors";

interface FloatingAddButtonProps {
  onPress: () => void;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
  onPress,
}) => {
  return (
    <View style={styles.addButtonContainer}>
      <TouchableOpacity style={styles.floatingAddButton} onPress={onPress}>
        <Plus size={24} color={darkTheme.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  floatingAddButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: darkTheme.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: darkTheme.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
});