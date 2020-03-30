
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Route, Link, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';

const NAVIGATION = {
    SUBCHAP: 0,
    CHAP: 1,
    MAX: 2
  };
class Table extends Component {
    constructor(props) {
      super(props);
      this.state = {
        navigation: NAVIGATION.CHAP,
        chapterNumber: 0,
        subChapterNumber: 0,
        text: 'hello',
        choice: 0,
        done: false
      }
    };
    //all of this is just copy pasted from dashboard.jsx, so when I actually implement this I feel like I should just import dashboard?
    handleKeyPress = event => {
      switch (event.keyCode) {
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
    let choice = this.state.chapterNumber;
    this.state.choice = choice;
    this.state.done = true; 
    
  }
    //handler for up arrow key events
  upArrowHandler = () => {
    //increments the navigation state
    if (this.state.navigation < NAVIGATION.MAX - 1) {
      let navigation = this.state.navigation;
      navigation += 1;
      this.setState({navigation: navigation});
      //if (navigation === NAVIGATION.SUBCHAP) {
        //speechSynthesis.cancel();
        //this.speech('Subchapter navigation', this.state.audioConfig);
      //} else {
        //speechSynthesis.cancel();
        //this.speech('Chapter navigation', this.state.audioConfig);
      //}
    }
  };

  //handler for down arrow key events
  downArrowHandler = () => {
    //decrements the navigation state
    if (this.state.navigation > 0) {
      let navigation = this.state.navigation;
      navigation -= 1;
      this.setState({navigation: navigation});
      //if (navigation === NAVIGATION.SUBCHAP) {
        //speechSynthesis.cancel();
        //this.speech('Subchapter navigation', this.state.audioConfig);
      //} else {
        //speechSynthesis.cancel();
        //this.speech('Chapter navigation', this.state.audioConfig);
      //}
    }
  };

  //handler for left arrow key events
  rightArrowHandler = () => {
      //handling navigation for subchapters
    if (this.state.navigation === NAVIGATION.SUBCHAP) {
      if (
        this.state.subChapterNumber <
        5//this.getCurrentChapter().subchapters.length - 1
      ) {
        //increment subchapter counter 
        const newSubChapterNumber = this.state.subChapterNumber + 2;
        this.handleSubchapterNavigation(newSubChapterNumber);
      } else {
        alert('Reached end of chapter!');
      }
    } else {
      //handling navigation for chapters
      if (
        this.state.chapterNumber <
        4//this.state.textbookSelected.chapters.length - 1
      ) {
        //increment chapter counter and set subchapter counter to 0
        const newChapterNumber = this.state.chapterNumber + 1;
        this.handleChapterNavigation(newChapterNumber);
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
      } else {
        alert('Reached beginning of chapter!');
      }
    } else {
      //handling navigation for chapters
      if (this.state.chapterNumber > 0) {
        //increment chapter counter and set both subchapter and paragraph counter to 0
        const newChapterNumber = this.state.chapterNumber - 1;
        this.handleChapterNavigation(newChapterNumber);
      } else {
        alert('Reached end of chapters');
      }
    }
  };
  //function to retrieve the current chapter from textbook
  /*getCurrentChapter = () => {
    return this.state.textbookSelected.chapters[this.state.chapterNumber];
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
*/
  handleChapterNavigation = chapterNumber => {
    //speechSynthesis.cancel();
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
    if (this.done == true) {
      return (
        <Redirect to="/dashboard"/>
      )
    }
    return(
      <div>
        <h1>Chapter: {this.state.chapterNumber}</h1>
        <h2>Subchapter: {this.state.subChapterNumber}</h2>
        <h2>Choice: {this.state.choice}</h2>
      </div>
    )
  }
}

  export default Table;