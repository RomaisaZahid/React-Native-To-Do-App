# React-Native-To-Do-App

A cross-platform React Native To-Do application featuring persistent storage, dynamic search, and stack navigation.

A simple and user-friendly To-Do mobile application built using **React Native** and **JavaScript**. The app helps users add, manage, search, and delete tasks easily with local data storage support.

## Features

* Add and delete tasks easily.
* Tasks are saved locally using `AsyncStorage`.
* Automatic screen refresh when returning to the app screens.
* Search tasks instantly with real-time filtering.
* Responsive design for different mobile screen sizes.

---

#  Application Screens

## 1. Home Screen

* Displays all tasks using `FlatList`.
* Allows users to remove tasks quickly.

## 2. Add Task Screen

* Users can create new tasks.
* Empty spaces are removed using `.trim()`.
* Unique IDs are generated using `Date.now()`.

## 3. Search Screen

* Users can search tasks instantly.
* Filters tasks without changing the original data.

---

# 🛠️ Technologies Used

* React Native
* JavaScript
* React Hooks (`useState`, `useEffect`, `useCallback`)
* React Navigation
* AsyncStorage

---
