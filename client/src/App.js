import React from "react";
import Speech from "react-speech";
import Customers from "./components/customers/customers";

function App() {
  speech = text => {
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  return (
    <div className="App">
      <Customers> </Customers>
      <button text="Hello World" onClick={() => this.speech("Hello world")} />
    </div>
  );
}

export default App;
