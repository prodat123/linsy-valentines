import './App.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import PuzzleBoard from './PuzzleBoard';
import BeachLevel from './BeachLevel';
import DatingSimulator from './DatingSimulator';
import Garden from './Garden';
import CatSimulator from './CatSimulator';
import { usePoints } from './PointsProvider';
import Letter from './Letter';
import { useState } from 'react';
import PopupModal from './PopupModal';

function App() {
  const { points } = usePoints();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({title:"", message:""})
  const navigate = useNavigate();

  const openLetter = () => {
    console.log(points);
    if(points < 5){
      setModalContent({ title: "Not Enough Points!", message: "In order to see your letter, you need at least 5 points by doing the mini experiences." });
      setIsModalOpen(true);
      return;
    }else{
      navigate('/letter');
    }
  }

  return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
          <button onClick={openLetter} className='text-2xl px-4 py-2 mb-2 bg-pink-500 rounded-full text-white hover:bg-pink-600'>Open your letter</button>
          <div>Points: {points}</div>
          <nav className="mb-5">
            <ul className="flex gap-5 text-pink-800 text-lg">
              <li><Link to="/puzzle">Puzzle</Link></li>
              <li><Link to="/beach">Beach</Link></li>
              <li><Link to="/dating">Hotpot</Link></li>
              <li><Link to="/garden">Garden</Link></li>
              <li><Link to="/cat">Cat</Link></li>
            </ul>
          </nav>
          
          <Routes>
            <Route path="/" element={<Navigate to="/puzzle" />} />
            <Route path="/puzzle" element={<PuzzleBoard />} />
            <Route path="/beach" element={<BeachLevel />} />
            <Route path="/dating" element={<DatingSimulator />} />
            <Route path="/garden" element={<Garden />} />
            <Route path="/cat" element={<CatSimulator />} />
            <Route path='/letter' element={<Letter />} />
          </Routes>

          <PopupModal 
            isOpen={isModalOpen} 
            currentPoints={points}
            onClose={() => setIsModalOpen(false)}
            title={modalContent.title}
            message={modalContent.message}
          />
        </div>
      </DndProvider>
  );
}

export default App;
