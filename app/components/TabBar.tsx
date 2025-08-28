import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TabLabels } from "../types";
import { darkTheme } from "../constants/colors";

interface TabBarProps {
  activeTab: "incomplete" | "completed";
  onTabPress: (tab: "incomplete" | "completed") => void;
  tabLabels: TabLabels;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabPress,
  tabLabels,
}) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "incomplete" && styles.activeTab]}
        onPress={() => onTabPress("incomplete")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "incomplete" && styles.activeTabText,
          ]}
        >
          {tabLabels.incomplete}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "completed" && styles.activeTab]}
        onPress={() => onTabPress("completed")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "completed" && styles.activeTabText,
          ]}
        >
          {tabLabels.completed}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: darkTheme.tabActive,
  },
  tabText: {
    fontSize: 16,
    color: darkTheme.tabInactive,
  },
  activeTabText: {
    color: darkTheme.text,
    fontWeight: "600",
  },
});