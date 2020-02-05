import React from "react";
import Speech from "react-speech";
import Customers from "./components/customers/customers";



function App() {
    //speechSynthesis.speak(new SpeechSynthesisUtterance('Hello World'));
    return (
        <div className = "App" >
            <Customers > </Customers> 
            <button text="Hello World" onClick={speechSynthesis.speak(new SpeechSynthesisUtterance("this text"))}/>
        </div >
    );
}

export default App;