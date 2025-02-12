import { createContext, useContext, useState } from "react";

// Create the Context
const PointsContext = createContext();

// Create a Provider component
export const PointsProvider = ({ children }) => {
  const localPoints = parseInt(localStorage.getItem("points"))
  const [points, setPoints] = useState(localPoints || 0);

  // Function to add points
  const addPoints = (amount) => {
    let point = points + amount;
    setPoints((prev) => prev + amount);
    localStorage.setItem("points", point);
  };

  // Function to reset points
  const resetPoints = () => {
    setPoints(0);
  };

  return (
    <PointsContext.Provider value={{ points, addPoints, resetPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

// Custom hook for easy access
export const usePoints = () => useContext(PointsContext);
