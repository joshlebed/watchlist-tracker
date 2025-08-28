import React from "react";
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { Import, FileUp, FileDown } from "lucide-react-native";

interface MainMenuProps {
  visible: boolean;
  onPasteList: () => void;
  onImportCSV: () => void;
  onExportCSV: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  visible,
  onPasteList,
  onImportCSV,
  onExportCSV,
}) => {
  if (!visible) return null;

  return (
    <Pressable style={styles.menu} onPress={(e) => e.stopPropagation()}>
      <TouchableOpacity style={styles.menuItem} onPress={onPasteList}>
        <Import size={20} color="#333" />
        <Text style={styles.menuText}>Paste List</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={onImportCSV}>
        <FileUp size={20} color="#333" />
        <Text style={styles.menuText}>Import from CSV</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={onExportCSV}>
        <FileDown size={20} color="#333" />
        <Text style={styles.menuText}>Export to CSV</Text>
      </TouchableOpacity>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    top: 60,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
});