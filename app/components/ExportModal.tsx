import React from "react";
import { View, ScrollView, Text, StyleSheet, Platform } from "react-native";
import { darkTheme } from "../constants/colors";

interface ExportModalProps {
  visible: boolean;
  data: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({ visible, data }) => {
  if (!visible) return null;

  return (
    <View style={styles.exportContainer}>
      <ScrollView style={styles.exportScroll}>
        <Text selectable style={styles.exportText}>
          {data}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  exportContainer: {
    padding: 16,
    backgroundColor: darkTheme.surface,
    margin: 16,
    borderRadius: 12,
    maxHeight: 200,
    shadowColor: darkTheme.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  exportScroll: {
    maxHeight: 180,
  },
  exportText: {
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
    fontSize: 14,
    color: darkTheme.text,
  },
});