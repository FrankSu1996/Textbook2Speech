import React, {Component} from 'react';

class Dashboard extends Component {
  state = {
    audioSpeed: 1,
    audioConfig: new SpeechSynthesisUtterance(),
    currentTextToRead:
      'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset',
  };

  speech = (text, config) => {
    console.log('Speech currently playing...');
    config.text = text;
    speechSynthesis.speak(config);
  };

  //function to set the text that is to be read. Will cancel the speech api to do so
  setTextToRead = text => {
    this.cancel();
    this.setState({currentTextToRead: text});
  };

  //function to set the rate of speech. Will cancel the current speech api to do so
  setAudioSpeed = (speed, config) => {
    console.log('Setting audio speed to ' + speed);
    this.cancel();
    config.rate = this.state.audioSpeed;
    console.log(this.state.audioSpeed);
  };

  //function to pause the speech api. DOES NOT clear text buffer/config settings
  pause = () => {
    speechSynthesis.pause();
  };

  //function to step the speech api. Clears the speech buffer, allows changing of speech api config
  cancel = () => {
    speechSynthesis.cancel();
  };

  //function to resume speech api
  resume = () => {
    speechSynthesis.resume();
  };

  render() {
    return (
      <React.Fragment>
        <button
          onClick={() =>
            this.speech(this.state.currentTextToRead, this.state.audioConfig)
          }
        >
          Speech
        </button>
        <button onClick={() => this.pause()}>pause</button>
        <button onClick={() => this.resume()}>resume</button>
        <button onClick={() => this.cancel()}>cancel</button>
        <p>Current audio speed: {this.state.audioSpeed}</p>
        <p>Set speed to:</p>
        <input
          value={this.state.audioSpeed}
          type="number"
          onChange={e => this.setState({audioSpeed: e.target.value})}
        />
        <button
          onClick={e =>
            this.setAudioSpeed(e.target.value, this.state.audioConfig)
          }
        >
          Set
        </button>
        <div>
          <h1>Text To Be Read:</h1>
          <p>{this.state.currentTextToRead}</p>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
