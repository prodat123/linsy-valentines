import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useLocation } from "react-router-dom";
import PopupModal from './PopupModal';
import { PointsProvider, usePoints } from './PointsProvider';

const CatSimulator = () => {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [catMood, setCatMood] = useState('happy');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.6);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [gameStatus, setGameStatus] = useState(null); // "win" or "lose"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({title: "", message:""})

  const rhythmKeys = ['a', 's', 'd', 'f'];
  const [currentKey, setCurrentKey] = useState(null);
  const beatRef = useRef(null);

  const happyCatImage = "/images/happy-cat.png";
  const sadCatImage = "/images/sad-cat.png";

  const musicPlayer = useRef(null);
  const successSound = useRef(null);
  const failSound = useRef(null);

  const { points, addPoint } = usePoints();

  useEffect(() => {
    musicPlayer.current = new Tone.Player("/audio/music.mp3").toDestination();
    successSound.current = new Tone.Player("/audio/success.mp3").toDestination();
    failSound.current = new Tone.Player("/audio/fail.mp3").toDestination();

    musicPlayer.current.volume.value = -10;  
    successSound.current.volume.value = -20; 
    failSound.current.volume.value = -5;    

    musicPlayer.current.onload = () => console.log('Music loaded');
    successSound.current.onload = () => console.log('Success sound loaded');
    failSound.current.onload = () => console.log('Fail sound loaded');
  }, []);
  
  useEffect(() => {
    if (isPlaying) {
      startMusic();
      startRhythm();
    } else {
      stopMusic();
      stopRhythm();
    }
  }, [isPlaying]);

  const location = useLocation();

  useEffect(() => {
    return () => {
      if (musicPlayer.current) {
        musicPlayer.current.stop(); // Stop the music
      }
    };
  }, [location.pathname]);

  const startMusic = () => {
    if (musicPlayer.current.loaded) {
      musicPlayer.current.start();
    }
  };

  const stopMusic = () => {
    if (musicPlayer.current) {
      musicPlayer.current.stop();
    }
  };

  const startRhythm = () => {
    const interval = 60000 / (120 * speed);
    beatRef.current = setInterval(() => {
      const randomKey = rhythmKeys[Math.floor(Math.random() * rhythmKeys.length)];
      setCurrentKey(randomKey);
    }, interval);
  };

  const stopRhythm = () => {
    clearInterval(beatRef.current);
  };

  const handleKeyPress = (event) => {
    if (!rhythmKeys.includes(event.key) || gameStatus) return;

    if (event.key === currentKey) {
      setScore((prev) => prev + 10);
      setCombo((prev) => prev + 1);
      setCatMood('happy');
      if (successSound.current.loaded) {
        successSound.current.start();
      }
    } else {
      setMisses((prev) => prev + 1);
      setCombo(0);
      setCatMood('sad');
      if (failSound.current.loaded) {
        failSound.current.start();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentKey, gameStatus]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 3000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameStatus) {
      setIsPlaying(true);
    }
  }, [timeLeft]);

  // **Win/Lose Condition**
  useEffect(() => {
    if (score >= 1000) {
      addPoint(1);
      setGameStatus("win");
      setIsPlaying(false);
      setModalContent({ title: "You Win! 🎉", message: "Yayy you won with the power of cats!" });
      setIsModalOpen(true);
    } else if (misses >= 10) {
      setGameStatus("lose");
      setIsPlaying(false);
      setModalContent({ title: "You Lose! 😢", message: "Aww better luck next time!" });
      setIsModalOpen(true);
    }
  }, [score, misses]);
  

  const handleRestart = () => {
    setScore(0);
    setCombo(0);
    setCatMood('happy');
    setMisses(0);
    setTimeLeft(3);
    setIsPlaying(false);
    setGameStatus(null);
  };

  return (
    <div className="game-container text-center p-5">
      <div className="cat-container mb-5">
        <img src={catMood === 'happy' ? happyCatImage : sadCatImage} alt="Cat" className="cat-image w-32 h-auto mx-auto" />
      </div>

      <div className="game-info mb-5">
        <h2 className="text-xl font-bold">Score: {score}</h2>
        <h3 className="text-lg">Combo: {combo}</h3>
        <h3 className="text-lg">Misses: {misses}</h3>
        {timeLeft > 0 && <h3 className="text-lg">Starting in {timeLeft}...</h3>}
        {isPlaying && !gameStatus && <h3 className="text-2xl font-semibold">Press '{currentKey}'!</h3>}
      </div>

      {gameStatus && (

        

        <div className="game-result mt-5">
          <h2 className={`text-3xl font-bold ${gameStatus === "win" ? "text-green-700" : "text-red-500"}`}>
            {gameStatus === "win" ? "You Win! 🎉" : "You Lose! 😢"}
          </h2>
          <button onClick={handleRestart} className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600">
            Restart Game
          </button>

          <PopupModal 
            isOpen={isModalOpen} 
            currentPoints={points}
            onClose={() => setIsModalOpen(false)}
            title={modalContent.title}
            message={modalContent.message}
          />
        </div>
      )}

      {!gameStatus && (
        <div className="instructions mt-5">
          <h3 className="text-lg font-medium">Press the correct key ('a', 's', 'd', 'f') in sync with the rhythm!</h3>
        </div>
      )}

      <div className="key-buttons mt-5">
        {rhythmKeys.map((key) => (
          <button
            key={key}
            className={`text-5xl mx-3 p-3 rounded-full ${
              key === currentKey ? 'bg-green-400 text-white' : 'bg-gray-300'
            } hover:bg-blue-300`}
            onClick={() => handleKeyPress({ key })}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CatSimulator;
