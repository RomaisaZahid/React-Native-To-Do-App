import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainer,
  useFocusEffect,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
const STORAGE_KEY = "@todo_tasks";
const screenWidth = Dimensions.get("window").width;

/* ================= HOME / LIST SCREEN ================= */
function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) setTasks(JSON.parse(data));
  };

  // 🔥 AUTO REFRESH WHEN SCREEN FOCUSES
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const deleteTask = async (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6A1B9A" barStyle="light-content" />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks added yet</Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.taskCard}>
            <View style={styles.taskLeft}>
              <Text style={styles.taskNumber}>{index + 1}.</Text>
              <Text style={styles.taskText}>{item.title}</Text>
            </View>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteTask(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Add Task")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= ADD TASK SCREEN ================= */
function AddTaskScreen({ navigation }) {
  const [task, setTask] = useState("");

  const saveTask = async () => {
    if (!task.trim()) return;

    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const tasks = existing ? JSON.parse(existing) : [];

    const newTask = { id: Date.now(), title: task };
    const updated = [...tasks, newTask];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Title</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your task"
        value={task}
        onChangeText={setTask}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveTask}>
        <Text style={styles.saveText}>Save Task</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= SEARCH SCREEN ================= */
function SearchScreen() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) setTasks(JSON.parse(data));
  };

  // 🔥 AUTO REFRESH SEARCH DATA
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="🔍 Search task"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>No matching task found</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskText}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

/* ================= MAIN APP ================= */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#6A1B9A" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "To-Do App",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Search")}
                style={{ marginRight: 15 }}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>Search</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Add Task" component={AddTaskScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 15,
  },

  search: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },

  taskCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },

  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: screenWidth * 0.65,
  },

  taskNumber: {
    fontWeight: "bold",
    marginRight: 8,
    color: "#6A1B9A",
  },

  taskText: {
    fontSize: 15,
    color: "#333",
  },

  deleteBtn: {
    backgroundColor: "#008080",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  deleteText: {
    color: "#fff",
    fontSize: 13,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 80,
    backgroundColor: "#6A1B9A",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  fabText: {
    color: "#fff",
    fontSize: 28,
  },

  label: {
    fontSize: 16,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },

  saveBtn: {
    backgroundColor: "#008080",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#777",
  },
});
