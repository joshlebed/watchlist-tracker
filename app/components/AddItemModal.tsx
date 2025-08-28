import React, { RefObject } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { Check } from "lucide-react-native";
import { Category } from "../types";
import { darkTheme } from "../constants/colors";

interface AddItemModalProps {
  visible: boolean;
  newItem: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  editingItem: boolean;
  selectedCategory: Category;
  modalPosition: number;
  inputRef: RefObject<TextInput>;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  newItem,
  onChangeText,
  onSubmit,
  onClose,
  editingItem,
  selectedCategory,
  modalPosition,
  inputRef,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={[styles.modalOverlay, { paddingBottom: modalPosition }]}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.modalContent,
            Platform.OS === "ios" && styles.modalContentIOS,
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              style={styles.modalInput}
              value={newItem}
              onChangeText={onChangeText}
              placeholder={
                editingItem
                  ? `Edit ${selectedCategory} title`
                  : `Enter a ${selectedCategory} title`
              }
              placeholderTextColor={darkTheme.textMuted}
              onSubmitEditing={onSubmit}
              returnKeyType="done"
              autoFocus={true}
            />
            <TouchableOpacity style={styles.modalAddButton} onPress={onSubmit}>
              <Check size={24} color={darkTheme.text} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: darkTheme.modalOverlay,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: darkTheme.surface,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalContentIOS: {
    paddingBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalInput: {
    flex: 1,
    height: 48,
    backgroundColor: darkTheme.inputBackground,
    borderRadius: 24,
    paddingHorizontal: 20,
    marginRight: 12,
    fontSize: 16,
    color: darkTheme.text,
  },
  modalAddButton: {
    width: 48,
    height: 48,
    backgroundColor: darkTheme.primary,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});