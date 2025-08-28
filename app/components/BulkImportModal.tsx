import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Category } from "../types";
import { darkTheme } from "../constants/colors";

interface BulkImportModalProps {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onImport: () => void;
  selectedCategory: Category;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  visible,
  value,
  onChangeText,
  onImport,
  selectedCategory,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.importContainer}>
      <TextInput
        style={styles.importInput}
        multiline
        placeholder={`Paste ${selectedCategory} titles (one per line)`}
        placeholderTextColor={darkTheme.textMuted}
        value={value}
        onChangeText={onChangeText}
        autoFocus={true}
      />
      <TouchableOpacity style={styles.importButton} onPress={onImport}>
        <Text style={styles.buttonText}>Add Items</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  importContainer: {
    padding: 16,
    backgroundColor: darkTheme.surface,
    margin: 16,
    borderRadius: 12,
    shadowColor: darkTheme.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  importInput: {
    backgroundColor: darkTheme.inputBackground,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: darkTheme.text,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  importButton: {
    backgroundColor: darkTheme.primary,
    borderRadius: 24,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: darkTheme.text,
    fontSize: 16,
    fontWeight: "600",
  },
});