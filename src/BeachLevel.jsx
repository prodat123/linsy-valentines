import React, { useState, useEffect } from 'react';
import { usePoints } from './PointsProvider';
import PopupModal from './PopupModal';

function BeachLevel() {
  const { points, addPoints } = usePoints();
  const [remainingItems, setRemainingItems] = useState([
    { name: 'Camera', image: '/images/camera.png', x: 40, y: 80, found: false },
    { name: 'Shell', image: '/images/shell.png', x: 20, y: 70, found: false },
    { name: 'Sate', image: '/images/sate.png', x: 70, y: 60, found: false },
    // Add more items
  ]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer
  const [gameOver, setGameOver] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);

  // Handle when the user clicks on the beach scene
  const handleItemClick = (position) => {
    console.log("Item found" + position);
    setRemainingItems((prevItems) => {
      return prevItems.map((item) => {
        if (
          position.x >= item.x - 8 &&
          position.x <= item.x + 8 &&
          position.y >= item.y - 8 &&
          position.y <= item.y + 8 &&
          !item.found
        ) {
          return { ...item, found: true };
        }
        return item;
      });
    });
  };

  // Timer logic
  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Check if all items are found and alert
  useEffect(() => {
    if (remainingItems.every(item => item.found)) {
      setGameOver(true); // End the game when all items are found
      addPoints(1);
      setModalContent({ title: "Wow you have keen eyes! 👁️👁️", message: "Must be why you were able to find me 😏" });
      setIsModalOpen(true);
    }
  }, [remainingItems]);

  // Restart the game
  const restartGame = () => {
    setRemainingItems([
      { name: 'Camera', image: '/images/camera.png', x: 40, y: 60, found: false },
      { name: 'Shell', image: '/images/shell.png', x: 20, y: 80, found: false },
      { name: 'Sate', image: '/images/sate.png', x: 70, y: 50, found: false },
      // Add more items
    ]);
    setTimeLeft(60);
    setGameOver(false);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-2xl font-bold mb-2">Find 3 of Winsy's Favorite Items</h1>
      <h1 className="text-center text-xl font-bold mb-2">(Sate, Shell, Camera)</h1>

      {/* Timer */}
      {!gameOver ? (
        <div className="text-center mb-2">
          <p>Time Left: {timeLeft}s</p>
        </div>
      ) : (
        <div className="text-center mb-6">
          <p>Yayy! You found {remainingItems.filter(item => item.found).length} out of {remainingItems.length} items.</p>
          <button
            onClick={restartGame}
            className="bg-pink-500 text-white px-4 py-2 rounded-full"
          >
            Restart Game
          </button>
        </div>
      )}

      {/* Beach Scene */}
      <div
        className="relative w-full h-[800px] bg-cover bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.pexels.com/photos/1998439/pexels-photo-1998439.jpeg")' }} // Placeholder beach image
        onClick={(e) => {
          const clickedPosition = {
            x: (e.nativeEvent.offsetX / e.target.offsetWidth) * 100,
            y: (e.nativeEvent.offsetY / e.target.offsetHeight) * 100,
          };
          handleItemClick(clickedPosition);
        }}
      >
        {/* Items that the user has to find */}
        {remainingItems.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.found ? 'opacity-0' : ''}`}
            style={{
              top: `${item.y}%`,
              left: `${item.x}%`,
              width: '60px',
              height: '60px',
              backgroundColor: 'transparent',
              borderRadius: '50%',
              pointerEvents: 'none', // to make sure it doesn't block clicks
            }}
          >
            {!item.found && (
              <img
                key={index}
                src={item.image}
                alt={item.name}
                className="absolute cursor-pointer"
                style={{
                  width: '60px',
                  height: '60px',
                  zIndex: 100,
                }}
                onClick={() => handleItemClick(item.x, item.y)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Items Found List */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Items Found:</h2>
        <ul>
          {remainingItems.filter((item) => item.found).map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul>
      </div>

      <PopupModal 
        isOpen={isModalOpen} 
        currentPoints={points}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
      />
    </div>
  );
}

export default BeachLevel