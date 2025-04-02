import react from "react";
import { Link } from "react-router-dom";
import '../style/Home.css';
import TextToSpeech from "./TextToSpeech";

function Home(){
    return (
    <div>
        <h1>Home</h1>
        <TextToSpeech/>
    </div>
    );
}

export default Home;