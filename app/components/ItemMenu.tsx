import React from "react";
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { Portal } from "@gorhom/portal";
import { Check, Trash2, Pencil } from "lucide-react-native";
import { ItemMenuProps } from "../types";

export const ItemMenu: React.FC<ItemMenuProps> = ({
  item,
  onClose,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  return (
    <Portal>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <View
          style={[
            styles.itemMenu,
            {
              position: "absolute",
              top: item.position.y + 30,
              left: item.position.x - 120,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.itemMenuItem}
            onPress={() => {
              onToggleComplete();
              onClose();
            }}
          >
            <Check size={16} color={item.completed ? "#44BB44" : "#666"} />
            <Text style={styles.itemMenuText}>
              {item.completed ? "Mark Incomplete" : "Mark Complete"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemMenuItem}
            onPress={() => {
              onEdit();
              onClose();
            }}
          >
            <Pencil size={16} color="#666" />
            <Text style={styles.itemMenuText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemMenuItem}
            onPress={() => {
              onDelete();
              onClose();
            }}
          >
            <Trash2 size={16} color="#FF4444" />
            <Text style={styles.itemMenuText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Portal>
  );
};

const styles = StyleSheet.create({
  itemMenu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minWidth: 160,
  },
  itemMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
  },
  itemMenuText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
});