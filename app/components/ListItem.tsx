import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowUp, ArrowDown, MoreVertical } from "lucide-react-native";
import { Item } from "../types";

interface ListItemProps {
  item: Item;
  onIncrease: () => void;
  onDecrease: () => void;
  onShowMenu: (event: any) => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  item,
  onIncrease,
  onDecrease,
  onShowMenu,
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.countContainer}>
        <Text style={styles.count}>{item.count}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onDecrease}>
          <ArrowDown size={16} color="#FF4444" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onIncrease}>
          <ArrowUp size={16} color="#44BB44" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onShowMenu}>
          <MoreVertical size={16} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  countContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
  },
  count: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: "#333",
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 4,
    marginLeft: 4,
  },
});