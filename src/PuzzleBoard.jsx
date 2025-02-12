import React, { useState, useEffect, useContext } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { usePoints } from "./PointsProvider";
import PopupModal from "./PopupModal";

const PUZZLE_SIZE = 3; // 3x3 grid
const pieceSize = 300 / PUZZLE_SIZE; // Adjust piece size based on grid size

// Function to create initial shuffled pieces
const createShuffledGrid = () => {
  let pieces = Array.from({ length: PUZZLE_SIZE * PUZZLE_SIZE }, (_, index) => index);
  return pieces.sort(() => Math.random() - 0.5);
};

const PuzzlePiece = ({ index, imageIndex, movePiece }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "piece",
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: "piece",
    drop: (item) => movePiece(item.index, index),
  }));

  const row = Math.floor(imageIndex / PUZZLE_SIZE); // Calculate the row position
  const col = imageIndex % PUZZLE_SIZE; // Calculate the column position

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="border border-gray-500"
      style={{
        width: pieceSize,
        height: pieceSize,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        backgroundImage: "url(/images/linsy.jpg)", // Use the backgroundImage
        backgroundPosition: `-${col * pieceSize}px -${row * pieceSize}px`, // Adjust position to show the right piece
        backgroundSize: `${PUZZLE_SIZE * 100}%`, // Resize the background image to fit the grid
      }}
    />
  );
};

const PuzzleBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [grid, setGrid] = useState(createShuffledGrid());
  const [isChecking, setIsChecking] = useState(false); // State to track if the win check is in progress
  const { points, addPoints } = usePoints();

  const movePiece = (fromIndex, toIndex) => {
    if (fromIndex !== toIndex) {
      // Swap only the two pieces involved
      setGrid((prevGrid) => {
        const updatedGrid = [...prevGrid];
        [updatedGrid[fromIndex], updatedGrid[toIndex]] = [updatedGrid[toIndex], updatedGrid[fromIndex]];
        return updatedGrid; // Return updated grid directly
      });
    }
  };

  const checkWin = () => {
    return grid.every((piece, index) => piece === index); // Check if the pieces are in the correct order
  };

  useEffect(() => {
    if (!isChecking) return; // Skip win check if it's already in progress

    const timeoutId = setTimeout(() => {
      if (checkWin()) {
        setIsModalOpen(true);
        setModalContent({ title: "Great Job Pookie! 😁", message: "You remembered a core memory in both of our minds!" });
        addPoints(1);
      }
      setIsChecking(false); // Reset checking state
    }, 1000); // Delay for 1 second (adjust as needed)

    return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount or before the next effect run
  }, [grid, isChecking]);

  const handleMove = (fromIndex, toIndex) => {
    movePiece(fromIndex, toIndex);
    setIsChecking(true); // Trigger the win check after the move
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      {/* Puzzle grid */}
      <div className="grid grid-cols-3 w-[300px] h-[300px]">
        {grid.map((imageIndex, index) => (
          <PuzzlePiece key={index} index={index} imageIndex={imageIndex} movePiece={handleMove} />
        ))}
      </div>

      <PopupModal isOpen={isModalOpen} currentPoints={points} onClose={() => setIsModalOpen(false)} title={modalContent.title} message={modalContent.message} />
    </div>
  );
};

export default PuzzleBoard;
