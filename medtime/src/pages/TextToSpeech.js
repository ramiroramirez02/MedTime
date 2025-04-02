import { useState } from "react";
import "../style/TextToSpeech.css";

const ReadPageAloud = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleReadAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel(); 
      setIsSpeaking(false);
      return;
    }

    const synth = window.speechSynthesis;
    const allText = document.body.innerText; 
    const utterance = new SpeechSynthesisUtterance(allText);

    utterance.onend = () => setIsSpeaking(false); 
    synth.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <button
      className="read-aloud-button"
      onClick={handleReadAloud}
    >
      {isSpeaking ? "Stop Reading" : "Read Aloud"}
    </button>
  );
};

export default ReadPageAloud;
