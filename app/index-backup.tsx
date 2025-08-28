import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Modal,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowUp, ArrowDown, Plus, Import, FileUp, FileDown, MoreVertical, Check, Trash2, Pencil, ChevronDown } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { Tabs } from "expo-router";
import { Portal } from "@gorhom/portal";
import { PortalProvider } from "@gorhom/portal";

interface Item {
  id: string;
  title: string;
  count: number;
  completed: boolean;
  category: "movie" | "tv" | "book";
}

const categoryDisplayNames = {
  movie: "Movie",
  tv: "TV",
  book: "Book",
};

const STORAGE_KEY = "@recommendations";

type Category = "movie" | "book" | "tv";

const ItemMenu = ({ item, onClose, onToggleComplete, onEdit, onDelete }) => {
  return (
    <Portal>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <View style={[
          styles.itemMenu,
          {
            position: 'absolute',
            top: item.position.y + 30,
            left: item.position.x - 120,
          }
        ]}>
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

export default function Recommendations() {
  const [items, setItems] = useState<Item[]>([]);
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
  const [showItemMenu, setShowItemMenu] = useState<{id: string, position: {x: number, y: number}} | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState(0);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    loadItems();

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

  const loadItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error("Error loading items:", error);
    }
  };

  const saveItems = async (updatedItems: Item[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Error saving items:", error);
    }
  };

  const addItem = (itemTitle: string) => {
    if (!itemTitle.trim()) return;

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (m) =>
          m.title.toLowerCase() === itemTitle.toLowerCase() &&
          m.category === selectedCategory
      );

      let updatedItems;
      if (existingItem) {
        updatedItems = currentItems.map((m) =>
          m.id === existingItem.id ? { ...m, count: m.count + 1 } : m
        );
      } else {
        updatedItems = [
          ...currentItems,
          {
            id: Date.now().toString(),
            title: itemTitle.trim(),
            count: 1,
            completed: false,
            category: selectedCategory,
          },
        ];
      }

      saveItems(updatedItems);
      return updatedItems;
    });
  };

  const handleBulkImport = () => {
    const itemTitles = bulkImport
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    itemTitles.forEach((title) => addItem(title));
    setBulkImport("");
    setShowBulkImport(false);
  };

  const exportToCSV = () => {
    const csv = items
      .map(
        (item) =>
          `"${item.title}",${item.count},${item.completed},${item.category}`
      )
      .join("\n");
    setExportData(csv);
  };

  const importFromCSV = () => {
    const lines = importCSV
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const newItems = lines.map((line) => {
      const [title, count, completed, category] = line
        .split(",")
        .map((item) => item.trim());
      return {
        id: Date.now().toString() + Math.random(),
        title: title.replace(/^"|"$/g, ""),
        count: parseInt(count, 10) || 1,
        completed: completed === "true",
        category: category as Category,
      };
    });

    setItems(newItems);
    saveItems(newItems);
    setImportCSV("");
    setShowImport(false);
  };

  const updateCount = (id: string, increment: boolean) => {
    setItems((currentItems) => {
      const updatedItems = currentItems
        .map((item) => {
          if (item.id === id) {
            const newCount = increment ? item.count + 1 : item.count - 1;
            return newCount > 0 ? { ...item, count: newCount } : null;
          }
          return item;
        })
        .filter((item): item is Item => item !== null);

      saveItems(updatedItems);
      return updatedItems;
    });
  };

  const deleteItem = (id: string) => {
    setItems((currentItems) => {
      const updatedItems = currentItems.filter((item) => item.id !== id);
      saveItems(updatedItems);
      return updatedItems;
    });
  };

  const toggleCompleted = (id: string) => {
    setItems((currentItems) => {
      const updatedItems = currentItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      saveItems(updatedItems);
      return updatedItems;
    });
  };

  const startEditing = (item: Item) => {
    setEditingItem(item);
    setNewItem(item.title);
    setShowAddItem(true);
    setShowItemMenu(null);
  };

  const handleAddItem = () => {
    if (editingItem) {
      setItems((currentItems) => {
        const updatedItems = currentItems.map((item) =>
          item.id === editingItem.id ? { ...item, title: newItem.trim() } : item
        );
        saveItems(updatedItems);
        return updatedItems;
      });
      setEditingItem(null);
    } else {
      addItem(newItem);
    }
    setNewItem("");
    setShowAddItem(false);
  };

  const getTabLabels = () => {
    switch (selectedCategory) {
      case "book":
        return { incomplete: "Unread", completed: "Read" };
      case "movie":
        return { incomplete: "Unwatched", completed: "Watched" };
      case "tv":
        return { incomplete: "Unwatched", completed: "Watched" };
    }
  };

  const tabLabels = getTabLabels();

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
    <View style={styles.itemContainer}>
      <View style={styles.countContainer}>
        <Text style={styles.count}>{item.count}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => updateCount(item.id, false)}
        >
          <ArrowDown size={16} color="#FF4444" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => updateCount(item.id, true)}
        >
          <ArrowUp size={16} color="#44BB44" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(event) => handleShowItemMenu(item.id, event)}
        >
          <MoreVertical size={16} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => setShowCategoryMenu(!showCategoryMenu)}
              >
                <Text style={styles.title}>
                  {categoryDisplayNames[selectedCategory] ?? "Movie"}
                </Text>
                <View style={styles.downButtonContainer}>
                  <ChevronDown size={20} color="#333" />
                </View>
              </TouchableOpacity>
              <Text style={styles.title}>Recs</Text>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreVertical size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {showCategoryMenu && (
            <View style={styles.categoryMenu}>
              {(["movie", "tv", "book"] as const).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.categoryMenuItem}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowCategoryMenu(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryMenuText,
                      selectedCategory === category &&
                        styles.categoryMenuTextActive,
                    ]}
                  >
                    {categoryDisplayNames[category] ?? "Movie"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {showMenu && (
            <Pressable style={styles.menu} onPress={(e) => e.stopPropagation()}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowBulkImport(true);
                  setShowMenu(false);
                  setShowImport(false);
                  setShowExport(false);
                }}
              >
                <Import size={20} color="#333" />
                <Text style={styles.menuText}>Paste List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowImport(true);
                  setShowMenu(false);
                  setShowBulkImport(false);
                  setShowExport(false);
                }}
              >
                <FileUp size={20} color="#333" />
                <Text style={styles.menuText}>Import from CSV</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowExport(true);
                  setShowMenu(false);
                  setShowBulkImport(false);
                  setShowImport(false);
                  exportToCSV();
                }}
              >
                <FileDown size={20} color="#333" />
                <Text style={styles.menuText}>Export to CSV</Text>
              </TouchableOpacity>
            </Pressable>
          )}

          {showImport && (
            <View style={styles.importContainer}>
              <TextInput
                style={styles.importInput}
                multiline
                placeholder="Paste CSV data here (title,count,completed,category)"
                value={importCSV}
                onChangeText={setImportCSV}
                autoFocus={true}
              />
              <TouchableOpacity
                style={styles.importButton}
                onPress={importFromCSV}
              >
                <Text style={styles.buttonText}>Import CSV</Text>
              </TouchableOpacity>
            </View>
          )}

          {showExport && (
            <View style={styles.exportContainer}>
              <ScrollView style={styles.exportScroll}>
                <Text selectable style={styles.exportText}>
                  {exportData}
                </Text>
              </ScrollView>
            </View>
          )}

          {showBulkImport && (
            <View style={styles.importContainer}>
              <TextInput
                style={styles.importInput}
                multiline
                placeholder={`Paste ${selectedCategory} titles (one per line)`}
                value={bulkImport}
                onChangeText={setBulkImport}
                autoFocus={true}
              />
              <TouchableOpacity
                style={styles.importButton}
                onPress={handleBulkImport}
              >
                <Text style={styles.buttonText}>Add Items</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "incomplete" && styles.activeTab]}
              onPress={() => setActiveTab("incomplete")}
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
              onPress={() => setActiveTab("completed")}
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
                ...items.find(item => item.id === showItemMenu.id)!,
                position: showItemMenu.position
              }}
              onClose={() => setShowItemMenu(null)}
              onToggleComplete={() => toggleCompleted(showItemMenu.id)}
              onEdit={() => startEditing(items.find(item => item.id === showItemMenu.id)!)}
              onDelete={() => deleteItem(showItemMenu.id)}
            />
          )}

          <View style={styles.addButtonContainer}>
            <TouchableOpacity
              style={styles.floatingAddButton}
              onPress={() => setShowAddItem(true)}
            >
              <Plus size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Modal
            visible={showAddItem}
            transparent
            animationType="fade"
            onRequestClose={() => {
              setShowAddItem(false);
              setEditingItem(null);
              setNewItem("");
            }}
          >
            <Pressable
              style={[styles.modalOverlay, { paddingBottom: modalPosition }]}
              onPress={() => {
                setShowAddItem(false);
                setEditingItem(null);
                setNewItem("");
              }}
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
                    onChangeText={setNewItem}
                    placeholder={
                      editingItem
                        ? `Edit ${selectedCategory} title`
                        : `Enter a ${selectedCategory} title`
                    }
                    placeholderTextColor="#666"
                    onSubmitEditing={handleAddItem}
                    returnKeyType="done"
                    autoFocus={true}
                  />
                  <TouchableOpacity
                    style={styles.modalAddButton}
                    onPress={handleAddItem}
                  >
                    <Check size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Pressable>
          </Modal>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  downButtonContainer: {
    paddingTop: 5,
  },
  categoryButton: {
    display: "flex",
    flexDirection: "row",
    padding: 8,
  },
  categoryMenu: {
    position: "absolute",
    top: 20,
    left: 16,
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
  categoryMenuItem: {
    padding: 12,
    borderRadius: 8,
  },
  categoryMenuText: {
    fontSize: 16,
    color: "#333",
  },
  categoryMenuTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  menuButton: {
    padding: 8,
  },
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
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
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
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
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
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
  exportContainer: {
    padding: 16,
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  exportScroll: {
    maxHeight: 180,
  },
  exportText: {
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
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
    backgroundColor: "#f5f5f5",
    borderRadius: 24,
    paddingHorizontal: 20,
    marginRight: 12,
    fontSize: 16,
    color: "#333",
  },
  modalAddButton: {
    width: 48,
    height: 48,
    backgroundColor: "#007AFF",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});