import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

interface ImportCSVModalProps {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onImport: () => void;
}

export const ImportCSVModal: React.FC<ImportCSVModalProps> = ({
  visible,
  value,
  onChangeText,
  onImport,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.importContainer}>
      <TextInput
        style={styles.importInput}
        multiline
        placeholder="Paste CSV data here (title,count,completed,category)"
        value={value}
        onChangeText={onChangeText}
        autoFocus={true}
      />
      <TouchableOpacity style={styles.importButton} onPress={onImport}>
        <Text style={styles.buttonText}>Import CSV</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  importContainer: {
    padding: 16,
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  importInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  importButton: {
    backgroundColor: "#007AFF",
    borderRadius: 24,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});