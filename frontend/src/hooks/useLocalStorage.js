import { useState } from "react";

/**
 * Custom hook for synced localStorage state
 * Works like useState but persists value in localStorage
 * Automatically handles JSON serialization/deserialization
 * @param {string} key - localStorage key
 * @param {any} initialValue - Default value if key doesn't exist
 * @returns {[any, Function, Function]} - [value, setValue, removeValue]
 */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error("useLocalStorage read error:", err);
      return initialValue;
    }
  });

  /**
   * Update both state and localStorage
   * @param {any} value - New value to store
   */
  const setValue = (value) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("useLocalStorage write error:", err);
    }
  };

  /**
   * Remove value from localStorage and reset to initial
   */
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      localStorage.removeItem(key);
    } catch (err) {
      console.error("useLocalStorage remove error:", err);
    }
  };

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
