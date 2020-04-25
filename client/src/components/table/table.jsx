
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Route, Link, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import Textbook from '../../textbook/textbook';

const NAVIGATION = {
    SUBCHAP: 0,
    CHAP: 1,
    MAX: 2
  };
class Table extends Component {
    constructor(props) {
      super(props);
      this.state = {
        textbook: Textbook,
        navigation: NAVIGATION.CHAP,
        chapterNumber: 0,
        subChapterNumber: 0,
        audioSpeed: 1,
        audioConfig: new SpeechSynthesisUtterance(),
        stopPlay: false,
        text: 'hello',
        done: false
      }
    };
    
    handleKeyPress = event => {
      switch (event.keyCode) {
        //'esc' key to stop speech api
        case 27:
          this.cancel();
          break;
        case 13:
          this.selectSection();
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
        default:
          break;
      }
    }; 
    componentDidMount() {
      document.addEventListener('keydown', this.handleKeyPress);
    }
    //"selects section" aka changes the state and calls dashboard with the new state passed as props 
  selectSection = () => {
    window.$chStart = this.state.chapterNumber;
    window.$subStart = this.state.subChapterNumber;
    speechSynthesis.cancel();
    this.state.stopPlay = true;
    this.state.done = true; 
  }
  //function to start the speech api
  speech = (text, config) => {
    console.log('Speech currently playing...');
    config.text = text;
    speechSynthesis.speak(config);
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
      } else {
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
      } else {
        speechSynthesis.cancel();
        this.speech('Chapter navigation', this.state.audioConfig);
      }
    }
  };

  //handler for left arrow key events
  rightArrowHandler = () => {
      //handling navigation for subchapters
    if (this.state.navigation === NAVIGATION.SUBCHAP) {
      if (
        this.state.subChapterNumber < this.getCurrentChapter().subchapters.length - 1
      ) {
        //increment subchapter counter 
        const newSubChapterNumber = this.state.subChapterNumber + 2;
        this.handleSubchapterNavigation(newSubChapterNumber);
        this.readSubChap();
      } else {
        const newChapterNumber = this.state.chapterNumber + 1;
        this.handleChapterNavigation(newChapterNumber);
        this.readChap();
      }
    } else {
      //handling navigation for chapters
      if (
        this.state.chapterNumber < this.state.textbook.chapters.length - 1
      ) {
        //increment chapter counter and set subchapter counter to 0
        const newChapterNumber = this.state.chapterNumber + 1;
        this.handleChapterNavigation(newChapterNumber);
        this.readChap();
      } else {
        alert('Reached end of chapters');
      }
    }
  };
  //handler for right arrow key events
  leftArrowHandler = () => {
    if (this.state.navigation === NAVIGATION.SUBCHAP) {
      //handling navigation for subchapters
      if (this.state.subChapterNumber > 0) {
        //increment subchapter counter
        const newSubChapterNumber = this.state.subChapterNumber;
        this.handleSubchapterNavigation(newSubChapterNumber);
        this.readSubChap();
      } else {
        if (this.state.chapterNumber > 0) {
          //increment chapter counter and set subchapter counter to 0
          const newChapterNumber = this.state.chapterNumber - 1;
          this.handleChapterNavigation(newChapterNumber);
          this.readChap();
        } else {
          alert('Reached end of chapters');
        }
      }
    } else {
      //handling navigation for chapters
      if (this.state.chapterNumber > 0) {
        //increment chapter counter and set subchapter counter to 0
        const newChapterNumber = this.state.chapterNumber - 1;
        this.handleChapterNavigation(newChapterNumber);
        this.readChap();
      } else {
        alert('Reached end of chapters');
      }
    }
  };
  //function to read the current chapter name
  readChap = () => {
    let chapName = this.getCurrentChapter().name;
    this.speech(chapName, this.state.audioConfig);
  }
  readSubChap = () => {
    let subChapName = this.getCurrentSubchapter().name;
    this.speech(subChapName, this.state.audioConfig);
  }
  //function to retrieve the current chapter from textbook
  getCurrentChapter = () => {
    return this.state.textbook.chapters[this.state.chapterNumber];
  };

  //function to retrieve the current subchapter from textbook
  getCurrentSubchapter = () => {
    const currentChapter = this.getCurrentChapter();
    return currentChapter.subchapters[this.state.subChapterNumber];
  };

  //function to navigate to certain chapter/subchapter/paragraph in the book
  //i.e. navigate(1, 1, 1) will navigate to first paragraph of first subchapter of first chapter
  navigate = (chapNumber, subChapNumber) => {
    this.setState({
      chapterNumber: chapNumber - 1,
      subChapterNumber: subChapNumber - 1,
    });
  };
  handleChapterNavigation = chapterNumber => {
    speechSynthesis.cancel();
    this.setState({
      chapterNumber: chapterNumber,
      subChapterNumber: 0,
    });
  };
  handleSubchapterNavigation = subChapterNumber => {
    this.setState({
      subChapterNumber: subChapterNumber - 1,
    })
  }
  
  render (){
    let navigation;
    let chapter = this.getCurrentChapter().name;
    let subChapter = this.getCurrentSubchapter().name;
    if (this.state.navigation === 0){
      navigation = 'Subchapter'
    }
    else {
      navigation = 'Chapter'
    }
    if (this.state.done === true) {
      return (
        <Redirect to='/dashboard'/>
      )
    }
    return(
      <div>
        <h1>{chapter} </h1>
        <h2>{subChapter} </h2>
        <h2>Current navigation: {navigation} </h2>
      </div>
    )
  }
}

  export default Table;