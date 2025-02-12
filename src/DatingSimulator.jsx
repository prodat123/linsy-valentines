import React, { useEffect, useState } from "react";
import { usePoints } from "./PointsProvider";
import PopupModal from "./PopupModal";

// Define the stages and dialogue structure with datePoints
const dialogues = {
  0: {
    user: "You're about to meet Max for a date at Hai Di Lao.",
    options: [
      { text: "Heyy, what's up?", next: 1, response: "Hey there...", datePoints: 5 },
      { text: "(Ignore and Wait)", next: 2, response: "Okay, just sitting in silence... awkward.", datePoints: -2 },
    ],
  },
  1: {
    user: "Your date seems a bit shy.",
    options: [
      { text: "I like your outfit :3", next: 3, response: "Aww thanks! I chose this outfit for this event specifically.", datePoints: 7 },
      { text: "What did the Valentine get arrested for? For stealing someone's heart.", next: 4, response: "Haha! Can't wait to steal your heart!", datePoints: 5 },
    ],
  },
  2: {
    user: "Your date seems a bit distant...",
    options: [
      { text: "Is everything is okay?", next: 3, response: "I’m fine, just a little nervous.", datePoints: 3 },
      { text: "Can I ask you a question?", next: 4, response: "Sure, ask me anything!", datePoints: 4 },
    ],
  },
  3: {
    user: "Your compliment brightens up the mood. What do you say?",
    options: [
      { text: "What are some of your hobbies?", next: 5, response: "I love talking about business and coding, and dogs!", datePoints: 6 },
      { text: "How about we talk about something else.", next: 5, response: "Hmm, let’s talk about food instead.", datePoints: 2 },
    ],
  },
  4: {
    user: "Your joke brings a smile to Max's face. What’s next?",
    options: [
      { text: "Do you like hotpot?", next: 5, response: "Yeah, I love it, especially if it's with you :D", datePoints: 6 },
      { text: "What do you enjoy doing?", next: 5, response: "I really like coding cause it makes me happy!", datePoints: 5 },
    ],
  },
  5: {
    user: "You’ve finished the hotpot and are stuffed. How do you end the evening?",
    options: [
      { text: "Would you go out with me again?", next: 6, response: "I’ve had a great time. Would you like to do this again?", datePoints: 10 },
      { text: "Alright, bye.", next: 6, response: "Thanks for a lovely evening! Take care!", datePoints: 2 },
    ],
  },
};

const DateSimulator = () => {
  const [stage, setStage] = useState(0);
  const [datePoints, setDatePoints] = useState(0);
  const [response, setResponse] = useState(""); // State to store the response text
  const { points, addPoints } = usePoints();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  
  useEffect(() => {
    if(stage >= 6){
      const outcome = getOutcome();
      if(outcome === "Great! You’ve secured a second date :)"){
        addPoints(1);
        setModalContent({ title: outcome, message: "That was an interesting date, maybe we should do one in real life 😉" });
      }else{
        setModalContent({ title: outcome, message: "Um.. That did not go so well so you don't get the point for that." });
      }
      setIsModalOpen(true);
    }
  }, [stage])

  const handleChoice = (nextStage, datePointsChange, responseText) => {
    setDatePoints(datePoints + datePointsChange);
    setResponse(responseText); // Set the response after the choice
    setStage(nextStage);
  };

  const getOutcome = () => {
    if (datePoints >= 25) {
      return "Great! You’ve secured a second date :)";
    } else if (datePoints >= 15) {
      return "Not bad, but you gotta try harder than that.";
    } else {
      return "Oof. You pushed him away.";
    }
  };

  const retryLevel = () => {
    setStage(0);
    setDatePoints(0);
  }
  // Ensure the game doesn't try to access dialogues when it's finished
  if (stage >= 6) {
    return (
      <div className="p-4">
        <div className="text-xl mb-4">Points: {datePoints}/28</div>
        {/* <div className="mt-4">{getOutcome()}</div> */}
        <div className="px-4 py-2 bg-pink-500 text-white text-center rounded-full cursor-pointer" onClick={retryLevel}>Retry</div>
      
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

  

  return (
    <div className="p-4">
      {response && (
        <div className="mt-4 text-xl text-black mb-4">
          <strong>Max: </strong>{response}
        </div>
      )}
      <div className="text-2xl font-bold mb-2">{dialogues[stage].user}</div>
      <div className="mb-4">
        {dialogues[stage].options.map((option, idx) => (
          <button
            key={idx}
            className="block w-full bg-pink-500 text-white p-2 rounded-full mb-2"
            onClick={() => handleChoice(option.next, option.datePoints, option.response)}
          >
            {option.text}
          </button>
        ))}
      </div>

        
    </div>


  );
};

export default DateSimulator;
