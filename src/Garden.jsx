import React, { useState } from "react";
import { usePoints } from "./PointsProvider";

// Flower and butterfly images
const flowerTypes = [
  "/images/tulip.png", // Tomato Red
  "/images/rose.png", // Gold
  "/images/sakura.png", // Hot Pink
  "/images/hydrangea.png", // Pale Green
];

const butterflyImage = "/images/butterfly.png"; // Placeholder Butterfly

const Garden = () => {
    const [image, setImage] = useState(null);
    const [flowers, setFlowers] = useState([]);
    const { addPoints } = usePoints();
    
    // Handle image upload
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result); // Set the uploaded image
          addPoints(1);
        };
        reader.readAsDataURL(file);
      }
    };

    // const generateRandomFlowers = (count) => {
    //   const flowers = [];
    //   for (let i = 0; i < count; i++) {
    //     const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
    //     const rotation = Math.random() * 90; // Random rotation
    
    //     let x, y;
    //     if (side === 0) {
    //       // Top side (x should be within 0 to 100%, y is fixed at 0)
    //       x = Math.random() * 90 - 2; // Random x position (keep margin on both sides)
    //       y = -2; // Fixed at the top
    //     } else if (side === 1) {
    //       // Right side (x is fixed at 100%, y should be within 0 to 100%)
    //       x = 90; // Fixed at the right side
    //       y = Math.random() * 90; // Random y position (keep margin on both sides)
    //     } else if (side === 2) {
    //       // Bottom side (x should be within 0 to 100%, y is fixed at 100%)
    //       x = Math.random() * 90 - 4; // Random x position (keep margin on both sides)
    //       y = 92;// Fixed at the bottom
    //     } else {
    //       // Left side (x is fixed at 0, y should be within 0 to 100%)
    //       x = -6; // Fixed at the left side
    //       y = Math.random() * 90; // Random y position (keep margin on both sides)
    //     }
    
    //     flowers.push({
    //       x,
    //       y,
    //       rotation,
    //       type: flowerTypes[Math.floor(Math.random() * flowerTypes.length)],
    //     });
    //   }
    //   setFlowers(flowers);
    // };
    
    const generateRandomFlowers = (count) => {
      const flowers = [];
      const step = 100 / Math.ceil(count / 4); // Divide space for even distribution
    
      for (let i = 0; i < count; i++) {
        const side = i % 4; // Distribute equally among 4 sides
        const rotation = Math.random() * 90; // Random rotation
        let x, y;
    
        if (side === 0) {
          // Top side: spread flowers along X-axis
          x = (i % (count / 4)) * step + Math.random() * 5 - 10; // Spread evenly
          y = -2; // Slightly outside frame
        } else if (side === 1) {
          // Right side: spread flowers along Y-axis
          x = 88; // Fixed at the right side
          y = (i % (count / 4)) * step + Math.random() * 5;
        } else if (side === 2) {
          // Bottom side: spread flowers along X-axis
          x = (i % (count / 4)) * step + Math.random() * 5;
          y = 92;
        } else {
          // Left side: spread flowers along Y-axis
          x = -2;
          y = (i % (count / 4)) * step + Math.random() * 3/4;
        }
    
        flowers.push({
          x,
          y,
          rotation,
          type: flowerTypes[Math.floor(Math.random() * flowerTypes.length)],
        });
      }
    
      setFlowers(flowers);
    };
    
  

  // Generate flower items
  // const flowers = generateRandomFlowers(300);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Design your Own Garden Frame</h1>
      <div className="flex items-center justify-center flex-col">
        <div className="relative lg:w-[500px] w-[80%]  h-[700px] bg-green-200 rounded-md overflow-hidden">
          {/* Fixed Rectangular Frame */}
          <div className="absolute inset-0">
            {/* Flowers around the frame */}
            {flowers.map((flower, index) => (
              <img
                key={index}
                src={flower.type}
                alt="Flower"
                className="absolute"
                style={{
                  left: `${flower.x}%`,
                  top: `${flower.y}%`,
                  transform: `rotate(${flower.rotation}deg)`,
                  width: '70px',
                  height: '70px',
                  zIndex: 10,
                }}
              />
            ))}

            {/* Butterflies (Can be placed inside the garden randomly if needed) */}
            <img
              src={butterflyImage}
              alt="Butterfly"
              className="absolute"
              style={{
                left: `50%`,
                top: `50%`,
                transform: `rotate(${Math.random() * 90}deg)`,
                width: '50px',
                height: '50px',
                transformOrigin: 'center',
                marginLeft: '-25px', // Center butterfly in the middle
                marginTop: '-25px',  // Center butterfly in the middle
                zIndex: 10
              }}
            />

            {/* Uploaded Image in the center */}
            {image && (
              <img
                src={image}
                alt="Uploaded"
                
                className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover rounded-lg border-4 border-white"
              />
            )}
          </div>

          {/* Upload Image Button */}
          
        </div>
        <div className="flex items-center justify-center flex-col w-full gap-2 mt-2">
          <label className="bg-pink-500 text-white p-2 rounded-full cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            Upload Image
          </label>

          <button 
            onClick={() => generateRandomFlowers(300)} 
            className="relative z-10 bg-green-300 px-4 py-2 rounded-full text-green-800"
          >
            Recreate Garden
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Garden;
