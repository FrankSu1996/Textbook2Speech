import React, { Component } from "react";

class Customers extends Component {
  constructor() {
    super();
    this.state = {
      speechConfig: new SpeechSynthesisUtterance(),
    }
  }

  speech = (text, u) => {
    console.log("FUCK YOUFUDLISAFU");
    u.text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
    u.lang = 'en-US';
    u.rate = 1;
    speechSynthesis.speak(u);
    u.text = "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
    speechSynthesis.speak(u);
    u.text = "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.";
    speechSynthesis.speak(u);
    u.text = "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
    speechSynthesis.speak(u);
  }

  pause = u => {
    speechSynthesis.pause();
  }

  cancel = u =>{
    speechSynthesis.cancel();
  }

  resume = u =>{
    u.rate = 1;
    speechSynthesis.resume();
  }

  render() {
    var u = new SpeechSynthesisUtterance();
    return (
      <React.Fragment>
        <button onClick={() => this.speech("", u)}>Something</button>
        <button onClick={() => this.pause(u)}>pause</button>
        <button onClick={() => this.resume(u)}>resume</button>
        <button onClick={() => this.cancel(u)}>cancel</button>
      </React.Fragment>
      
    );
  }
}

export default Customers;
