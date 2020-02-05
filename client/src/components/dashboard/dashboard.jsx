import React, {Component} from 'react';

class Dashboard extends Component {
  state = {
    audioSpeed: 1,
    audioConfig: new SpeechSynthesisUtterance(),
    currentTextToRead:
      'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset',
  };

  speech = (text, config) => {
    console.log('FUCK YOUFUDLISAFU');
    config.text = text;
    speechSynthesis.speak(config);
  };

  setAudioSpeed = (speed, config) => {
    console.log('Setting audio speed to ' + speed);
    this.cancel();
    config.rate = this.state.audioSpeed;
    console.log(this.state.audioSpeed);
  };

  pause = () => {
    speechSynthesis.pause();
  };

  cancel = () => {
    speechSynthesis.cancel();
  };

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
      </React.Fragment>
    );
  }
}

export default Dashboard;
