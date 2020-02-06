import React, {Component} from 'react';
import Textbook from '../../textbook/textbook';

const NAVIGATION = {
  PARAGRAPH: 0,
  SUBCHAP: 1,
  CHAP: 2,
  MAX: 3,
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textbookSelected: Textbook,
      navigation: NAVIGATION.PARAGRAPH,
      audioSpeed: 1,
      audioConfig: new SpeechSynthesisUtterance(),
      chapterNumber: 0,
      subChapterNumber: 0,
      paragraphNumber: 0,
      currentTextToRead:
        'This unit introduces the idea of thinking scientifically about language by making empirical observations rather than judgments of correctness.',
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  //handler for keypress events
  handleKeyPress = event => {
    switch (event.keyCode) {
      //'s' key to start speech api
      case 83:
        this.speech(this.state.currentTextToRead, this.state.audioConfig);
        break;
      //'esc' key to stop speech api
      case 27:
        speechSynthesis.cancel();
        break;
      case 37:
        this.leftArrowHandler();
        break;
      case 39:
        this.rightArrowHandler();
        break;
      case 38:
        this.upArrowHandler();
        break;
      case 40:
        this.downArrowHandler();
      default:
        break;
    }
  };

  //handler for up arrow key events
  upArrowHandler = () => {
    //increments the navigation state
    if (this.state.navigation < NAVIGATION.MAX - 1) {
      let navigation = this.state.navigation;
      navigation += 1;
      this.setState({navigation: navigation});
    }
  };

  //handler for down arrow key events
  downArrowHandler = () => {
    //decrements the navigation state
    if (this.state.navigation > 0) {
      let navigation = this.state.navigation;
      navigation -= 1;
      this.setState({navigation: navigation});
    }
  };

  //handler for left arrow key events
  rightArrowHandler = () => {
    //handling navigation for paragraphs
    if (this.state.navigation === NAVIGATION.PARAGRAPH) {
      //check if incrementing paragraph counter will go out of bounds
      if (
        this.state.paragraphNumber <
        this.getCurrentSubchapter().paragraphs.length - 1
      ) {
        //cancel speech api
        speechSynthesis.cancel();
        //increment paragraph counter in state
        let newParagraphNumber = this.state.paragraphNumber + 1;
        this.setState({paragraphNumber: newParagraphNumber});
        //retrieve next paragraph to read and change state
        let newParagraph = this.getCurrentParagraph().text;
        this.setState({currentTextToRead: newParagraph});
        console.log(newParagraph);
      } else {
        alert('Reached end of subchapter!');
      }
    }
    //handling navigation for subchapters
    else if (this.state.navigation === NAVIGATION.SUBCHAP) {
      if (
        this.state.subChapterNumber <
        this.getCurrentChapter().subchapters.length - 1
      ) {
        //cancel speech api
        speechSynthesis.cancel();
        //increment subchapter counter and set paragraph counter to 0
        const newSubChapterNumber = this.state.subChapterNumber + 1;
        const newParagraphNumber = 0;
        this.setState({
          paragraphNumber: newParagraphNumber,
          subChapterNumber: newSubChapterNumber,
        });
        //retrieve next paragraph to read and change state
        let newParagraph = this.getCurrentParagraph().text;
        this.setState({currentTextToRead: newParagraph});
      } else {
        alert('Reached end of chapter!');
      }
    }
  };

  //handler for right arrow key events
  leftArrowHandler = () => {
    if (this.state.navigation === NAVIGATION.PARAGRAPH) {
      //check if incrementing paragraph counter will go out of bounds
      if (this.state.paragraphNumber > 0) {
        //cancel speech api
        speechSynthesis.cancel();
        //increment paragraph counter in state
        let newParagraphNumber = this.state.paragraphNumber - 1;
        this.setState({paragraphNumber: newParagraphNumber});
        //retrieve next paragraph to read
        let newParagraph = this.getCurrentParagraph().text;
        this.setState({currentTextToRead: newParagraph});
        console.log(newParagraph);
      } else {
        alert('Reached end of subchapter!');
      }
    }
    //handling navigation for subchapters
    else if (this.state.navigation === NAVIGATION.SUBCHAP) {
      if (this.state.subChapterNumber > 0) {
        //cancel speech api
        speechSynthesis.cancel();
        //increment subchapter counter and set paragraph counter to 0
        const newSubChapterNumber = this.state.subChapterNumber - 1;
        const newParagraphNumber = 0;
        this.setState({
          paragraphNumber: newParagraphNumber,
          subChapterNumber: newSubChapterNumber,
        });
        //retrieve next paragraph to read and change state
        let newParagraph = this.getCurrentParagraph().text;
        this.setState({currentTextToRead: newParagraph});
      } else {
        alert('Reached beginning of chapter!');
      }
    }
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
    return this.state.textbookSelected.chapters[this.state.chapterNumber];
  };

  //function to retrieve the current subchapter from textbook
  getCurrentSubchapter = () => {
    const currentChapter = this.getCurrentChapter();
    return currentChapter.subchapters[this.state.subChapterNumber];
  };

  //function to retrieve the current paragraph to be read
  getCurrentParagraph = () => {
    const currentSubChapter = this.getCurrentSubchapter();
    return currentSubChapter.paragraphs[this.state.paragraphNumber];
  };

  render() {
    //retrieve textbook information to display
    const chapterName = this.getCurrentChapter().name;
    const subChapterName = this.getCurrentSubchapter().name;
    const text = this.state.currentTextToRead;
    let navigation;

    if (this.state.navigation === NAVIGATION.PARAGRAPH) {
      navigation = 'Paragraph';
    } else if (this.state.navigation === NAVIGATION.CHAP) {
      navigation = 'Chapter';
    } else {
      navigation = 'Subchapter';
    }

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
          <h3>Current navigation : {navigation}</h3>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
