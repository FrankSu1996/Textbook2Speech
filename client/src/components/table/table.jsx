import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
  Route,
  Link,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';
import Textbook from '../../textbook/textbook';
import Tutorial from '../Tutorial';
import {Container, Row, Col} from 'react-bootstrap';
import TC from './tableComponents';

const NAV = {
  SUBCHAP: 0,
  CHAP: 1,
  MAX: 2,
};
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textbook: Textbook,
      nav: NAV.CHAP,
      chapterNumber: 0,
      subChapterNumber: 0,
      audioSpeed: 1,
      audioConfig: new SpeechSynthesisUtterance(),
      stopPlay: false,
      done: false,
      starting: true,
      showTutorial: false,
      colours: [0,1,1,1,1,1,1,1,1]
    };
  }
  handleKeyPress = event => {
    switch (event.keyCode) {
      //'s' to start speech
      case 83:
        this.start();
        break;
      //'esc' key to stop speech api
      case 27:
        this.cancel();
        break;
      case 13:
        this.selectSection();
        break;
      case 37:
        this.leftArrowHandle();
        break;
      case 39:
        this.rightArrowHandle();
        break;
      case 38:
        this.upArrowHandle();
        break;
      case 40:
        this.downArrowHandle();
        break;
      case 84:
        this.toggleTutorial();
        break;
      default:
        break;
    }
  };
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  toggleTutorial = () => {
    this.cancel();
    this.setState({
      showTutorial: !this.state.showTutorial,
    });
  };
  //changes colour of one badge from blue to black or vice versa
  flipColour = () => {
    let elem;
    if (this.state.nav === 0) {
      elem = this.state.subChapterNumber;
    } else {
      elem = this.state.chapterNumber;
    }
    //this.setState({colours[elem]:})
  };
  //inverts all colours in array
  invertColours = () => {
    let tempList;
    if (this.state.nav === 0){
      tempList = this.state.colours.map((val) => val + 1);
    } 
    else {
      tempList = this.state.colours.map((val) => val - 1);
    }
    this.setState({colours: tempList});
  }
  //reads welcome message if user just beginning, otherwise reads current state to remind user where they are
  start = () => {
    this.cancel();
    if (this.state.starting === true) {
      this.read('welcome to Textbook to Speech. To hear the tutorial, press t. Otherwise, navigate the table of contents to pick your chapter', this.state.audioConfig);
      let firstChapName = this.getCurrentChap.name;
      this.read(firstChapName, this.state.audioConfig);
      this.setState({starting: false});
    }
    else {
      let text = this.getCurrentChap().name + ". " + this.getCurrentSubchap().name + ". ";
      if (this.state.nav === 0) {
        text += "navigation: Subchapter";
      } else {
        text += "navigation: Chapter";
      }
      this.read(text, this.state.audioConfig);
    }

  };
  //"selects section" aka changes the state and calls dashboard with the new state passed as props
  selectSection = () => {
    window.$chStart = this.state.chapterNumber;
    window.$subStart = this.state.subChapterNumber;
    this.cancel();
    this.setState({done: true});
  };
  cancel = () => {
    speechSynthesis.cancel();
    this.setState({stopPlay: true});
  };
  //function to start the speech api
  read = (text, config) => {
    console.log('Speech currently playing...');
    config.text = text;
    speechSynthesis.speak(config);
  };
  //handler for up arrow key events
  upArrowHandle = () => {
    //increments the navigation state
    if (this.state.nav < NAV.MAX - 1) {
      this.invertColours();
      let navigation = this.state.nav;
      navigation += 1;
      this.setState({nav: navigation});
      speechSynthesis.cancel();
      this.read('Chapter navigation', this.state.audioConfig);
      this.read(this.getCurrentChap().name, this.state.audioConfig);
    }
  };

  //handler for down arrow key events
  downArrowHandle = () => {
    //decrements the navigation state
    if (this.state.nav > 0) {
      let navigation = this.state.nav;
      navigation -= 1;
      this.setState({nav: navigation});
      this.invertColours();
      speechSynthesis.cancel();
      this.read('Subchapter navigation', this.state.audioConfig);
      this.read(this.getCurrentSubchap().name, this.state.audioConfig);
    }
  };

  //handler for right arrow key events
  rightArrowHandle = () => {
    //handling navigation for subchapters
    if (this.state.nav === NAV.SUBCHAP) {
      if (
        this.state.subChapterNumber <
        this.getCurrentChap().subchapters.length - 1
      ) {
        //increment subchapter counter
        const newSubChapterNumber = this.state.subChapterNumber + 2;
        this.handleSubchapterNavigation(newSubChapterNumber);
        this.readSubChap();
      } else {
        const newChapterNumber = this.state.chapterNumber + 1;
        this.handleChapterNavigation(newChapterNumber);
        this.read(this.getCurrentChap().name, this.state.audioConfig);
        this.read(this.getCurrentSubchap().name, this.state.audioConfig);
      }
    } else {
      //handling navigation for chapters
      if (this.state.chapterNumber < this.state.textbook.chapters.length - 1) {
        //increment chapter counter and set subchapter counter to 0
        const newChapterNumber = this.state.chapterNumber + 1;
        this.handleChapterNavigation(newChapterNumber);
        this.readChap();
      } else {
        this.read('You have reached the end of the textbook', this.state.audioConfig);
      }
    }
  };
  //handler for left arrow key events
  leftArrowHandle = () => {
    if (this.state.nav === NAV.SUBCHAP) {
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
          this.read(this.getCurrentChap().name, this.state.audioConfig);
          this.read(this.getCurrentSubchap().name, this.state.audioConfig);
        } else {
          this.read('You have reached the beginning of the textbook', this.state.audioConfig);
        }
      }
    } else {
      //handling navigation for chapters
      if (this.state.chapterNumber > 0) {
        //increment chapter counter and set subchapter counter to 0
        const newChapterNumber = this.state.chapterNumber - 1;
        this.handleChapterNavigation(newChapterNumber);
        this.read('saturday', this.state.audioConfig);
        this.readChap();
      } else {
        this.read('You have reached the beginning of the textbook', this.state.audioConfig);
      }
    }
  };
  //function to read the current chapter name
  readChap = () => {
    speechSynthesis.cancel();
    let chapName = this.getCurrentChap().name;
    this.read(chapName, this.state.audioConfig);
  };
  readSubChap = () => {
    speechSynthesis.cancel();
    let subChapName = this.getCurrentSubchap().name;
    this.read(subChapName, this.state.audioConfig);
  };
  //function to retrieve the current chapter from textbook
  getCurrentChap = () => {
    return this.state.textbook.chapters[this.state.chapterNumber];
  };

  //function to retrieve the current subchapter from textbook
  getCurrentSubchap = () => {
    const currentChapter = this.getCurrentChap();
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
    });
  };
  render() {
    if (this.state.done) {
      return <Redirect to="/dashboard" />;
    }
    let navigation;
    let chapter = this.getCurrentChap().name;
    let subChapter = this.getCurrentSubchap().name;
    let curNum;
    if (this.state.nav === 0) {
      navigation = 'Subchapter';
      curNum = this.state.subChapterNumber;
    } else {
      navigation = 'Chapter';
      curNum = this.state.chapterNumber;
    }
    return (
      <div>
      <h1>{chapter} </h1>
      <h2>{subChapter} </h2>
      <h2>Current navigation: {navigation} </h2>
      <div style={{ display: 'flex '}}>
        <TC num={1} colour={this.state.colours[0]}/>
        <TC num={2} colour={this.state.colours[1]}/> 
        <TC num={3} colour={this.state.colours[2]}/>
      </div>
      <div style={{ display: 'flex '}}>
        <TC num={4} colour={this.state.colours[3]}/>
        <TC num={5} colour={this.state.colours[4]}/> 
        <TC num={6} colour={this.state.colours[5]}/>
      </div><div style={{ display: 'flex '}}>
        <TC num={7} colour={this.state.colours[6]}/>
        <TC num={8} colour={this.state.colours[7]}/> 
        <TC num={9} colour={this.state.colours[8]}/>
      </div>
      {this.state.showTutorial ? (
        <Tutorial closePopup={this.toggleTutorial.bind(this)} />
      ) : null}
    </div>
      
    );
  }
}

export default Table;
