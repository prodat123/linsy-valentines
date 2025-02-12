import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Letter() {
  const paragraphs = [
    {
      text: `Dear Winsy,`,
      delay: 1000, // Delay before the next paragraph loads
    },
    {
      text: `As I always say, I am glad that I am still here with you and celebrating valentine's day in 2025. We might be a whole world apart but every day it feels as if we are right next to each other. You make me happy. Whenever I see a message from you, I put everything aside to reply. Whenever you compliment me or say I'm cute, it makes me smile. I get jealous when you talk to guys as nicely and I wish I could meet you every day. I never want you to forget your dreams and ambitions. The film industry and any creative field is tough, especially in Indonesia. You will experience more pressure than any you have experienced in high school or university. Can you stay strong? I'm scared that your anxiety will cause you to give up. I'm scared that you will be influenced to become someone you're not. I'm scared that I will lose you.`,
      delay: 2000, // Longer delay for the next paragraph
    },
    {
      text: `As your pookie, I'm telling you to get stronger both mentally and physically. There is no such thing as an easy route when you're looking for success. You're free. Free to do whatever you want. What you do with that freedom will define you. I can only hope that you will not be hurt by your environment. So for this valentine's day, I made a space to remind you who you are with your favorite items, hobbies, and memories in case you ever feel lost.`,
      delay: 15000, // Medium delay for this paragraph
    },
    {
      text: `XOXO,`,
      delay: 18000, // Short delay before the end
    },
    {
        text: `Maxwell`,
        delay: 18000
    }
  ];

  const [visibleParagraphs, setVisibleParagraphs] = useState([]);

  const addParagraphsWithDelay = async () => {
    for (let i = 0; i < paragraphs.length; i++) {
      const { text, delay } = paragraphs[i];
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait for the specified delay before adding the next paragraph
      setVisibleParagraphs((prevParagraphs) => [...prevParagraphs, text]);
    }
  };

  useEffect(() => {
    addParagraphsWithDelay();
  }, []);

  const romanticWords = ["Winsy", "valentine's", "cute", "pookie", "success", "compliment"]; // Words to color-code
  const emphasisWords = ["define"]
  const artWords = ["creative", "film"]

  const colorCodeWord = (word) => {
    // Remove punctuation and check if the word is in the importantWords array
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();
    
    if (romanticWords.some((romanticWord) => romanticWord.toLowerCase() === cleanWord)) {
      return <span className="text-pink-700">{word}</span>; // Apply red color
    }
    if (emphasisWords.some((emphasisWord) => emphasisWord.toLowerCase() === cleanWord)) {
        return <span className="text-red-500 font-bold">{word}</span>; // Apply red color
    }
    if (artWords.some((artWord) => artWord.toLowerCase() === cleanWord)) {
        return <span className="italic">{word}</span>; // Apply red color
    }
    return word; // Return the word as is if no color-coding is needed
  };

  return (
    <div className="text-2xl font-bold text-center p-4">
      {visibleParagraphs.map((paragraph, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-4"
        >
          {paragraph.split(" ").map((word, wordIndex) => (
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: wordIndex * 0.1, // Animation delay per word
              }}
              className="inline-block mr-2"
            >
              {colorCodeWord(word)}{" "}
            </motion.span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

export default Letter;
