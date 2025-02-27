import { SafeAreaView, View, Text, StyleSheet, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
import { React, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem('todos', JSON.stringify(todos));
        console.log("todos saved");
      } catch (e) {
        console.error("Failed to save todos", e);
      }
    };
    saveTodos();
  }, [todos]);

  useEffect(() => {
    const loadTodos = async () => {
      if (todos.length > 0) {
        try {
          const jsonValue = await AsyncStorage.getItem('todos');
          if (jsonValue !== null) {
            setTodos(JSON.parse(jsonValue));
            console.log("todos loaded");
          }
        } catch (e) {
          console.error("Failed to load todos", e);
        }
      }
    };
    loadTodos();
  }, []);

  const handleDeleteTodo = (id) => {
    console.log(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleSubmit = () => {
    // check if newTodo is empty before we make it?
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo("");
  };

  const handleToggleCompleted = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        } else {
          return todo;
        }
      })
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          {todos.map((todo) => (
            <View style={styles.todoContainer} key={todo.id} >
              <TouchableOpacity key={todo.id} onPress={() => handleToggleCompleted(todo.id)}>
                <Text style={[styles.todoText, todo.completed && styles.completedText]}>
                  {todo.text}
                </Text>
              </TouchableOpacity>
              <Button
                onPress={() => handleDeleteTodo(todo.id)}
                title="Delete"
                color="#841584"
                accessibilityLabel="Delete todo item"
              />
            </View>
          ))}
        </View>
        <View>
          <TextInput
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder="useless placeholder"
          />
          <Button
            onPress={handleSubmit}
            title="Add Todo"
            color="#841584"
            accessibilityLabel="Submit a new Todo List item"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  todoText: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
});
