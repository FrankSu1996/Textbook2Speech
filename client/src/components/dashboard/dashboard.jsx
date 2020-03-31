import React, {Component} from 'react';
import Textbook from '../../textbook/textbook';
import Tutorial from '../Tutorial';

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
      chapterNumber: this.props.chapterStart - 1,
      subChapterNumber: this.props.subChapterStart - 1,
      paragraphNumber: 0,
      stopPlay: false,
      currentTextToRead:
        'This unit introduces the idea of thinking scientifically about language by making empirical observations rather than judgments of correctness.',
      showTutorial: false,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
    //const { start } = this.props.location.state;
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  toggleTutorial() {
    this.setState({
      showTutorial: !this.state.showTutorial,
    });
  }
  //handler for keypress events
  handleKeyPress = event => {
    switch (event.keyCode) {
      //'s' key to start speech api
      case 83:
        this.startSpeechHandler(this.state.audioConfig);
        break;
      //'esc' key to stop speech api
      case 27:
        this.cancel();
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
        break;
      case 84:
        this.toggleTutorial();
        break;
      // enter key prints out chapter/subchapter/paragraph numbers
      case 13:
        console.log('Current chapter number: ' + this.state.chapterNumber);
        console.log(
          'Current subchapter number: ' + this.state.subChapterNumber
        );
        console.log('Current paragraph number: ' + this.state.paragraphNumber);
        break;
      default:
        break;
    }
  };

  //handler to start speech api on current text to read. Will continuously read through paragraphs
  //until another functionality key is pressed
  startSpeechHandler = config => {
    speechSynthesis.cancel();
    // let currentSubChap = this.state.subChapterNumber;
    // //loop through all subchapters in current chapter
    // for (
    //   let i = currentSubChap;
    //   i < this.getCurrentChapter().subchapters.length;
    //   i++
    // ) {
    //   this.readAllParagraphsInSubchapter(i, config);
    // }
    //this.readAllParagraphsInSubchapter(0, config);
    this.readAllParagraphsInSubchapter(0, config);
  };

  //function to read all paragraphs in given subchapter
  readAllParagraphsInSubchapter = (subChapterNum, config) => {
    this.setState({subChapterNumber: subChapterNum, stopPlay: false});
    if (this.state.stopPlay === true) {
      setTimeout(
        this.readAllParagraphsInSubchapter,
        100,
        subChapterNum,
        config
      );
    } else {
      console.log('why? ' + this.state.stopPlay);
      let paragraphs = this.getCurrentChapter().subchapters[subChapterNum]
        .paragraphs;
      let paragraphText = [];
      for (let i = 0; i < paragraphs.length; i++) {
        paragraphText.push(paragraphs[i].text);
      }
      let index = this.state.paragraphNumber;
      this.continuousRead(paragraphText, index, config);
    }
  };

  // function that continously reads all string elements in a list
  // while iterating through, it will also set the currentTextToRead state
  // so that it will re-render on the browser
  continuousRead = (list, index, config) => {
    if (speechSynthesis.speaking === true && this.state.stopPlay !== true) {
      setTimeout(
        this.continuousRead,
        100,
        list,
        this.state.paragraphNumber + 1,
        config
      );
    } else if (this.state.stopPlay === true) {
      return;
    } else {
      if (index < list.length) {
        this.setState({currentTextToRead: list[index]});
        this.speech(list[index], config);
        //check if end of subchapter
        if (index === list.length - 1) {
          this.speech('End of subchapter', config);
          return;
        }
        let newIndex = index;
        this.setState({paragraphNumber: newIndex});
        this.continuousRead(list, newIndex, config);
      }
    }
  };

  //handler for up arrow key events
  upArrowHandler = () => {
    //increments the navigation state
    if (this.state.navigation < NAVIGATION.MAX - 1) {
      let navigation = this.state.navigation;
      navigation += 1;
      this.setState({navigation: navigation});
      if (navigation === NAVIGATION.SUBCHAP) {
        speechSynthesis.cancel();
        this.speech('Subchapter navigation', this.state.audioConfig);
      } else if (navigation === NAVIGATION.CHAP) {
        speechSynthesis.cancel();
        this.speech('Chapter navigation', this.state.audioConfig);
      }
    }
  };

  //handler for down arrow key events
  downArrowHandler = () => {
    //decrements the navigation state
    if (this.state.navigation > 0) {
      let navigation = this.state.navigation;
      navigation -= 1;
      this.setState({navigation: navigation});
      if (navigation === NAVIGATION.SUBCHAP) {
        speechSynthesis.cancel();
        this.speech('Subchapter navigation', this.state.audioConfig);
      } else if (navigation === NAVIGATION.PARAGRAPH) {
        speechSynthesis.cancel();
        this.speech('Paragraph navigation', this.state.audioConfig);
      }
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
        //increment paragraph counter in state
        let newParagraphNumber = this.state.paragraphNumber + 2;
        this.handleParagraphNavigation(newParagraphNumber);
      }
      //reached end of subchapter: navigates to first paragraph of next subchapter
      else if (
        this.state.paragraphNumber ===
          this.getCurrentSubchapter().paragraphs.length - 1 &&
        this.state.subChapterNumber <
          this.getCurrentChapter().subchapters.length - 1
      ) {
        const newSubChapterNumber = this.state.subChapterNumber + 2;
        this.handleSubchapterNavigation(newSubChapterNumber);
      }
      //reached end of chapter: navigate to first paragraph of first subchapter of next chapter
      else if (
        this.state.chapterNumber <
        this.state.textbookSelected.chapters.length - 1
      ) {
        if (
          this.state.chapterNumber <
          this.state.textbookSelected.chapters.length - 1
        ) {
          const newChapterNumber = this.state.chapterNumber + 1;
          this.handleChapterNavigation(newChapterNumber);
        }
      }
      //reached end of all chapters
      else {
        alert('Reached end of chapters!');
      }
    } else if (this.state.navigation === NAVIGATION.SUBCHAP) {
      //handling navigation for subchapters
      if (
        this.state.subChapterNumber <
        this.getCurrentChapter().subchapters.length - 1
      ) {
        //increment subchapter counter and set paragraph counter to 0
        const newSubChapterNumber = this.state.subChapterNumber + 2;
        this.handleSubchapterNavigation(newSubChapterNumber);
      }
      //reached end of current chapter: Navigate to first subchapter of next chapter
      else if (
        this.state.subChapterNumber ===
          this.getCurrentChapter().subchapters.length - 1 &&
        this.state.chapterNumber <
          this.state.textbookSelected.chapters.length - 1
      ) {
        const newChapterNumber = this.state.chapterNumber + 1;
        this.handleChapterNavigation(newChapterNumber);
      } else {
        alert('Reached end of chapters!');
      }
    } else {
      //handling navigation for chapters
      if (
        this.state.chapterNumber <
        this.state.textbookSelected.chapters.length - 1
      ) {
        //increment chapter counter and set both subchapter and paragraph counter to 0
        const newChapterNumber = this.state.chapterNumber + 1;
        this.handleChapterNavigation(newChapterNumber);
      } else {
        alert('Reached end of chapters');
      }
    }
  };

  //handler for right arrow key events
  leftArrowHandler = () => {
    if (this.state.navigation === NAVIGATION.PARAGRAPH) {
      //check if incrementing paragraph counter will go out of bounds
      if (this.state.paragraphNumber > 0) {
        //increment paragraph counter in state
        let newParagraphNumber = this.state.paragraphNumber;
        this.handleParagraphNavigation(newParagraphNumber);
      }
      //reached beginning of subchapter: navigates to last paragraph of last subchapter
      else if (
        this.state.paragraphNumber === 0 &&
        this.state.subChapterNumber > 0
      ) {
        const newSubChapterNumber = this.state.subChapterNumber;
        this.handleSubchapterNavigation(newSubChapterNumber);
        const newParagraphNumber = this.getCurrentSubchapter().paragraphs
          .length;
        this.handleParagraphNavigation(newParagraphNumber);
        this.speech(
          'subchapter ' + this.getCurrentSubchapter().name,
          this.state.audioConfig
        );
      }
      //reached beginning of subchapter: navigates to last paragraph of last subchapter of last chapter
      else if (
        this.state.chapterNumber > 0 &&
        this.state.paragraphNumber === 0 &&
        this.state.subChapterNumber === 0
      ) {
        const newChapterNumber = this.state.chapterNumber - 1;
        this.handleChapterNavigation(newChapterNumber);
        const newSubChapterNumber = this.getCurrentChapter().subchapters.length;
        this.handleSubchapterNavigation(newSubChapterNumber);
        const newParagraphNumber = this.getCurrentSubchapter().paragraphs
          .length;
        this.handleParagraphNavigation(newParagraphNumber);
        this.speech(
          'subchapter ' + this.getCurrentSubchapter().name,
          this.state.audioConfig
        );
      }
      //reached beginning of chapters
      else {
        alert('Reached beggining of Chapter 1');
      }
    } else if (this.state.navigation === NAVIGATION.SUBCHAP) {
      //handling navigation for subchapters
      if (this.state.subChapterNumber > 0) {
        //increment subchapter counter and set paragraph counter to 0
        const newSubChapterNumber = this.state.subChapterNumber;
        this.handleSubchapterNavigation(newSubChapterNumber);
      }
      //reached beginning of current chapter: Navigate to last subchapter of previous chapter
      else if (
        this.state.subChapterNumber === 0 &&
        this.state.chapterNumber > 0
      ) {
        const newChapterNumber = this.state.chapterNumber - 1;
        this.handleChapterNavigation(newChapterNumber);
        const newSubChapterNumber = this.getCurrentChapter().subchapters.length;
        this.handleSubchapterNavigation(newSubChapterNumber);
      } else {
        alert('Reaached the beginning of Chapter1');
      }
    } else {
      //handling navigation for chapters
      if (this.state.chapterNumber > 0) {
        //increment chapter counter and set both subchapter and paragraph counter to 0
        const newChapterNumber = this.state.chapterNumber - 1;
        this.handleChapterNavigation(newChapterNumber);
      } else {
        alert('Reached the beginning of the the first chapter!');
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
  setAudioSpeed = config => {
    speechSynthesis.cancel();
    config.rate = this.state.audioSpeed;
    this.speech('Audio speed set to:' + config.rate, config);
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
  getParagraph = paragraphNumber => {
    const currentSubChapter = this.getCurrentSubchapter();
    return currentSubChapter.paragraphs[paragraphNumber];
  };

  //function to navigate to certain chapter/subchapter/paragraph in the book
  //i.e. navigate(1, 1, 1) will navigate to first paragraph of first subchapter of first chapter
  navigate = (chapNumber, subChapNumber, pNumber) => {
    this.setState({
      chapterNumber: chapNumber - 1,
      subChapterNumber: subChapNumber - 1,
      paragraphNumber: pNumber - 1,
    });
    //retrieve paragraph to read
    //retrieve next paragraph to read and change state
    let newParagraph = this.getParagraph(this.state.paragraphNumber).text;
    this.setState({currentTextToRead: newParagraph});
  };

  //handles navigating to a certain subChapter, starts at the first paragraph
  handleSubchapterNavigation = subchapterNumber => {
    //cancel speech api
    speechSynthesis.cancel();
    this.setState({
      subChapterNumber: subchapterNumber - 1,
      paragraphNumber: 0,
    });
    let text = this.getParagraph(this.state.paragraphNumber).text;
    this.setState({currentTextToRead: text});
    this.speech(
      'subchapter ' + this.getCurrentSubchapter().name,
      this.state.audioConfig
    );
  };

  //handles navigating to a certain paragraph
  handleParagraphNavigation = paragraphNumber => {
    //cancel speech api
    speechSynthesis.cancel();
    this.setState({paragraphNumber: paragraphNumber - 1});
    let text = this.getParagraph(this.state.paragraphNumber).text;
    this.setState({currentTextToRead: text});
  };

  handleChapterNavigation = chapterNumber => {
    speechSynthesis.cancel();
    this.setState({
      chapterNumber: chapterNumber,
      subChapterNumber: 0,
      paragraphNumber: 0,
    });
    //retrieve next paragraph to read and change state
    let newParagraph = this.getParagraph(this.state.paragraphNumber).text;
    this.setState({currentTextToRead: newParagraph});
    this.speech(this.getCurrentChapter().name, this.state.audioConfig);
    this.speech(
      'subchapter ' + this.getCurrentSubchapter().name,
      this.state.audioConfig
    );
  };

  cancel = () => {
    console.log('something2');
    var newPNumber = this.state.paragraphNumber;
    //if (this.state.paragraphNumber > 0) {
    //newPNumber = this.state.paragraphNumber - 1;
    //}
    const textToRead = this.getParagraph(newPNumber).text;
    console.log(textToRead, newPNumber);
    this.setState({
      stopPlay: true,
      paragraphNumber: newPNumber,
      currentTextToRead: textToRead,
    });
    speechSynthesis.cancel();
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
          //onClick={() =>
          //  this.speech(this.state.currentTextToRead, this.state.audioConfig)
          //}
          onClick={() =>
            this.readAllParagraphsInSubchapter(
              this.state.subChapterNumber,
              this.state.audioConfig
            )
          }
        >
          Speech
        </button>
        <button onClick={() => speechSynthesis.pause()}>pause</button>
        <button onClick={() => speechSynthesis.resume()}>resume</button>
        <button onClick={() => this.cancel()}>cancel</button>
        <p>Current audio speed: {this.state.audioSpeed}</p>
        <p>Set speed to:</p>
        <input
          value={this.state.audioSpeed}
          type="number"
          onChange={e => this.setState({audioSpeed: e.target.value})}
        />
        <button onClick={e => this.setAudioSpeed(this.state.audioConfig)}>
          Set
        </button>
        <div>
          <h1>{chapterName}</h1>
          <h2>{subChapterName}</h2>
          <p>{text}</p>
          <h3>Current navigation : {navigation}</h3>
          {this.state.showTutorial ? (
            <Tutorial closePopup={this.toggleTutorial.bind(this)} />
          ) : null}
          <h3>Start: {this.props.start} </h3>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
