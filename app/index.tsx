import { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { PortalProvider } from "@gorhom/portal";

import { Item, Category, ItemMenuPosition } from "./types";
import { useItems } from "./hooks/useItems";
import { getTabLabels } from "./utils/tabLabels";
import { exportToCSV, parseCSV } from "./utils/csvUtils";

import { Header } from "./components/Header";
import { CategoryMenu } from "./components/CategoryMenu";
import { MainMenu } from "./components/MainMenu";
import { TabBar } from "./components/TabBar";
import { ListItem } from "./components/ListItem";
import { ItemMenu } from "./components/ItemMenu";
import { FloatingAddButton } from "./components/FloatingAddButton";
import { AddItemModal } from "./components/AddItemModal";
import { BulkImportModal } from "./components/BulkImportModal";
import { ImportCSVModal } from "./components/ImportCSVModal";
import { ExportModal } from "./components/ExportModal";

export default function Recommendations() {
  const {
    items,
    addItem,
    updateCount,
    deleteItem,
    toggleCompleted,
    updateItem,
    bulkAddItems,
    replaceAllItems,
  } = useItems();

  const [newItem, setNewItem] = useState("");
  const [bulkImport, setBulkImport] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [exportData, setExportData] = useState("");
  const [importCSV, setImportCSV] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [activeTab, setActiveTab] = useState<"incomplete" | "completed">("incomplete");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>("movie");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showItemMenu, setShowItemMenu] = useState<{
    id: string;
    position: ItemMenuPosition;
  } | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState(0);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardVisible(true);
        setModalPosition(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setModalPosition(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (showAddItem) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showAddItem]);

  const handleBulkImport = () => {
    const itemTitles = bulkImport
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    bulkAddItems(itemTitles, selectedCategory);
    setBulkImport("");
    setShowBulkImport(false);
  };

  const handleExportToCSV = () => {
    const csv = exportToCSV(items);
    setExportData(csv);
  };

  const importFromCSVData = () => {
    const newItems = parseCSV(importCSV);
    replaceAllItems(newItems);
    setImportCSV("");
    setShowImport(false);
  };

  const startEditing = (item: Item) => {
    setEditingItem(item);
    setNewItem(item.title);
    setShowAddItem(true);
    setShowItemMenu(null);
  };

  const handleAddItem = () => {
    if (editingItem) {
      updateItem(editingItem.id, newItem);
      setEditingItem(null);
    } else {
      addItem(newItem, selectedCategory);
    }
    setNewItem("");
    setShowAddItem(false);
  };

  const tabLabels = getTabLabels(selectedCategory);

  const filteredItems = items.filter(
    (item) =>
      item.category === selectedCategory &&
      (activeTab === "completed" ? item.completed : !item.completed)
  );

  const handleShowItemMenu = (id: string, event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setShowItemMenu({ id, position: { x: pageX, y: pageY } });
  };

  const renderItem = ({ item }: { item: Item }) => (
    <ListItem
      item={item}
      onIncrease={() => updateCount(item.id, true)}
      onDecrease={() => updateCount(item.id, false)}
      onShowMenu={(event) => handleShowItemMenu(item.id, event)}
    />
  );

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryMenu(false);
  };

  const handleMainMenuAction = (action: "paste" | "import" | "export") => {
    setShowMenu(false);
    setShowBulkImport(action === "paste");
    setShowImport(action === "import");
    setShowExport(action === "export");
    if (action === "export") {
      handleExportToCSV();
    }
  };

  return (
    <PortalProvider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        <StatusBar style="auto" />
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            setShowMenu(false);
            setShowCategoryMenu(false);
            setShowItemMenu(null);
          }}
        >
          <Header
            selectedCategory={selectedCategory}
            onCategoryPress={() => setShowCategoryMenu(!showCategoryMenu)}
            onMenuPress={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            showCategoryMenu={showCategoryMenu}
          />

          <CategoryMenu
            visible={showCategoryMenu}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          <MainMenu
            visible={showMenu}
            onPasteList={() => handleMainMenuAction("paste")}
            onImportCSV={() => handleMainMenuAction("import")}
            onExportCSV={() => handleMainMenuAction("export")}
          />

          <ImportCSVModal
            visible={showImport}
            value={importCSV}
            onChangeText={setImportCSV}
            onImport={importFromCSVData}
          />

          <ExportModal visible={showExport} data={exportData} />

          <BulkImportModal
            visible={showBulkImport}
            value={bulkImport}
            onChangeText={setBulkImport}
            onImport={handleBulkImport}
            selectedCategory={selectedCategory}
          />

          <TabBar
            activeTab={activeTab}
            onTabPress={setActiveTab}
            tabLabels={tabLabels}
          />

          <FlatList
            data={filteredItems.sort((a, b) => b.count - a.count)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />

          {showItemMenu && (
            <ItemMenu
              item={{
                ...items.find((item) => item.id === showItemMenu.id)!,
                position: showItemMenu.position,
              }}
              onClose={() => setShowItemMenu(null)}
              onToggleComplete={() => toggleCompleted(showItemMenu.id)}
              onEdit={() =>
                startEditing(items.find((item) => item.id === showItemMenu.id)!)
              }
              onDelete={() => deleteItem(showItemMenu.id)}
            />
          )}

          <FloatingAddButton onPress={() => setShowAddItem(true)} />

          <AddItemModal
            visible={showAddItem}
            newItem={newItem}
            onChangeText={setNewItem}
            onSubmit={handleAddItem}
            onClose={() => {
              setShowAddItem(false);
              setEditingItem(null);
              setNewItem("");
            }}
            editingItem={!!editingItem}
            selectedCategory={selectedCategory}
            modalPosition={modalPosition}
            inputRef={inputRef}
          />
        </Pressable>
      </KeyboardAvoidingView>
    </PortalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
});