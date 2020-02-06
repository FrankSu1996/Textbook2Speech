import React, {Component} from 'react';
import Textbook from '../../textbook/textbook';

class Dashboard extends Component {
  state = {
    textbookSelected: Textbook,
    textbookInitialized: false,
    audioSpeed: 1,
    audioConfig: new SpeechSynthesisUtterance(),
    chapterNumber: 1,
    subChapterNumber: 1,
    paragraphNumber: 1,
    currentTextToRead:
      'This unit introduces the idea of thinking scientifically about language by making empirical observations rather than judgments of correctness.',
  };

  speech = (text, config) => {
    console.log('Speech currently playing...');
    config.text = text;
    speechSynthesis.speak(config);
  };

  //function to set the text that is to be read. Will cancel the speech api to do so
  setTextToRead = text => {
    speechSynthesis.cancel();
    this.setState({currentTextToRead: text});
  };

  //function to set the rate of speech. Will cancel the current speech api to do so
  setAudioSpeed = (speed, config) => {
    console.log('Setting audio speed to ' + speed);
    speechSynthesis.cancel();
    config.rate = this.state.audioSpeed;
    console.log(this.state.audioSpeed);
  };

  //function to retrieve the current chapter from textbook
  getCurrentChapter = () => {
    return this.state.textbookSelected.chapters[this.state.chapterNumber - 1];
  };

  //function to retrieve the current subchapter from textbook
  getCurrentSubchapter = () => {
    const currentChapter = this.getCurrentChapter();
    return currentChapter.subchapters[this.state.subChapterNumber - 1];
  };

  //function to retrieve the current paragraph to be read
  getCurrentParagraph = () => {
    const currentSubChapter = this.getCurrentSubchapter();
    console.log(currentSubChapter.paragraphs[this.state.paragraphNumber - 1]);
    return currentSubChapter.paragraphs[this.state.paragraphNumber - 1];
  };

  render() {
    //retrieve textbook information to display
    const chapterName = this.getCurrentChapter().name;
    const subChapterName = this.getCurrentSubchapter().name;
    const text = this.getCurrentParagraph().text;

    return (
      <React.Fragment>
        <button
          onClick={() =>
            this.speech(this.state.currentTextToRead, this.state.audioConfig)
          }
        >
          Speech
        </button>
        <button onClick={() => speechSynthesis.pause()}>pause</button>
        <button onClick={() => speechSynthesis.resume()}>resume</button>
        <button onClick={() => speechSynthesis.cancel()}>cancel</button>
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
          <h1>{chapterName}</h1>
          <h2>{subChapterName}</h2>
          <p>{text}</p>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
