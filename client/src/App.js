import React from "react";
import Customers from "./components/customers/customers";

function App() {
    let audio = new Audio("../server/output.mp3");

    const start = () => {
        audio.play()
    }

  return (


    <div className="App">
        <button onClick={start}>Play</button>
      <Customers></Customers>
    </div>
  );
}

export default App;
