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
import escKey from "../../images/esc_key.png";
import enterKey from "../../images/enter_key.png";
import SpeechModal from "../errorModal/errorModal";
import styles from "../dashboard/dashboard.module.css";

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
      colours: [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      componentValues: ["Press 's' to start"],
      natNumList: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
      showSpeechModal: false,
      modalMessage: "",
    };
  }
  handleKeyPress = event => {
    if (this.state.showSpeechModal){
      if (event.keyCode === 27) {
        this.closeSpeechModal();
        // 1 - 9 selects the audio speed to set to
      } else if (event.keyCode === 49) {
        this.setState({ nextAudioSpeed: 1 });
      } else if (event.keyCode === 50) {
        this.setState({ nextAudioSpeed: 2 });
      } else if (event.keyCode === 51) {
        this.setState({ nextAudioSpeed: 3 });
      } else if (event.keyCode === 52) {
        this.setState({ nextAudioSpeed: 4 });
      } else if (event.keyCode === 53) {
        this.setState({ nextAudioSpeed: 5 });
      } else if (event.keyCode === 54) {
        this.setState({ nextAudioSpeed: 6 });
      } else if (event.keyCode === 55) {
        this.setState({ nextAudioSpeed: 7 });
      } else if (event.keyCode === 56) {
        this.setState({ nextAudioSpeed: 8 });
      } else if (event.keyCode === 57) {
        this.setState({ nextAudioSpeed: 9 });
      }
      //enter confirms the selection
      else if (event.keyCode === 13) {
        console.log("Enter hit");
        this.setAudioSpeed(this.state.audioConfig);
      }
    } else {
      switch (event.keyCode) {
        //'s' to start speech
        case 83:
          this.start();
          break;
        //'esc' key to stop speech api
        case 27:
          this.cancel();
          break;
        //'enter' selects current section 
        case 13:
          this.selectSection();
          break;
        //left arrow key calls method to handle navigation
        case 37:
          this.leftArrowHandle();
          break;
        //right arrow key calls method to handle navigation
        case 39:
          this.rightArrowHandle();
          break;
        //up arrow key calls method to handle navigation
        case 38:
          this.upArrowHandle();
          break;
        //up arrow key calls method to handle navigation
        case 40:
          this.downArrowHandle();
          break;
        //'t' pulls up tutorial 
        case 84:
          this.toggleTutorial();
          break;
        //p key pauses speech api
        case 80:
          speechSynthesis.pause();
          break;
        //r key resumes
        case 82:
          speechSynthesis.resume();
          break;
        //o opens speech modal
        case 79:
          if (!this.state.showTutorial) {
            this.showSpeechModal();
          }
          break;
        default:
          break;
        }
      }
  };
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  //function to open speech modal
  showSpeechModal = (e) => {
    this.cancel();
    this.read(
      "Enter a number from 1 to 9 and hit the enter key to confirm your choice! Press Escape to exit this window",
      this.state.audioConfig
    );
    this.setState({ showSpeechModal: true });
  };

  //function to close speech modal
  closeSpeechModal = (e) => {
    this.cancel();
    this.setState({ showSpeechModal: false });
  };
  //function to open or close tutorial
  toggleTutorial = () => {
    this.cancel();
    this.setState({
      showTutorial: !this.state.showTutorial,
    });
  };
  //function to set the rate of speech. Will cancel the current speech api to do so
  setAudioSpeed = (config) => {
    speechSynthesis.cancel();
    config.rate = this.state.nextAudioSpeed;
    this.setState({ audioSpeed: this.state.nextAudioSpeed });
    this.read("Audio speed set to:" + config.rate, config);
  };
  //changes colour of one badge from blue to black or vice versa
  flipColour = (index) => {
    let tempList = this.state.colours;
    if (tempList[index] === 0){
      tempList[index] = 1
    } else {
      tempList[index] = 0
    }
    this.setState({colours: tempList})
  };
  //resets array to begin chapter / subchapter navigation with first element selected
  resetColours = () => {
    //let tempList;
    if (this.state.nav === 0){
      this.setState({colours: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]})
      this.flipColour(this.state.chapterNumber);
    } 
    else {
      this.setState({colours: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]})
    }
  };
  //resets the number of components in componentValues to reflect current chapter / subchapter
  resetComponents = () => {
    let currentNum;
    if (this.state.nav === 0) {
      currentNum = this.getCurrentChap().subchapters.length;
    } else {
      currentNum = this.state.textbook.chapters.length;
    }
    let tempList = this.state.natNumList;
    this.setState({componentValues: tempList.slice(0,currentNum)});
  };
  //reads welcome message if user just beginning, otherwise reads current state to remind user where they are
  start = () => {
    this.cancel();
    if (this.state.starting === true) {
      this.resetComponents();
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
  //cancels whatever speech is currently playing 
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
      this.resetColours();
      let navigation = this.state.nav;
      navigation += 1;
      this.setState({nav: navigation});
      this.resetComponents();
      speechSynthesis.cancel();
      this.read('Chapter navigation', this.state.audioConfig);
      this.read(this.getCurrentChap().name, this.state.audioConfig);
    }
  };

  //handler for down arrow key events
  downArrowHandle = () => {
    //decrements the navigation state
    if (this.state.nav > 0) {
      this.resetColours();
      let navigation = this.state.nav;
      navigation -= 1;
      this.setState({nav: navigation});
      this.resetComponents();
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
        this.flipColour(this.state.subChapterNumber);
        const newSubChapterNumber = this.state.subChapterNumber + 2;
        this.handleSubchapterNavigation(newSubChapterNumber);
        this.flipColour(this.state.subChapterNumber);
        this.readSubChap();
        //if end of current chapter, go into first subchapter of next chapter
      } else if (this.state.chapterNumber < this.state.textbook.chapters.length - 1){
        this.flipColour(this.state.subChapterNumber);
        const newChapterNumber = this.state.chapterNumber + 1;
        this.handleChapterNavigation(newChapterNumber);
        this.flipColour(this.state.subChapterNumber);
        this.resetComponents();
        this.read(this.getCurrentChap().name, this.state.audioConfig);
        this.read(this.getCurrentSubchap().name, this.state.audioConfig);
      } else {
        //if reached end of textbook
        this.cancel();
        this.read('You have reached the end of the textbook', this.state.audioConfig);
      }
    } else {
      //handling navigation for chapters
      if (this.state.chapterNumber < this.state.textbook.chapters.length - 1) {
        //increment chapter counter and set subchapter counter to 0
        this.flipColour(this.state.chapterNumber);
        const newChapterNumber = this.state.chapterNumber + 1;
        this.handleChapterNavigation(newChapterNumber);
        this.flipColour(this.state.chapterNumber);
        this.readChap();
      } else {
        //if reached end of textbook
        this.cancel();
        this.read('You have reached the end of the textbook', this.state.audioConfig);
      }
    }
  };
  //handler for left arrow key events
  leftArrowHandle = () => {
    if (this.state.nav === NAV.SUBCHAP) {
      //handling navigation for subchapters
      if (this.state.subChapterNumber > 0) {        
        this.flipColour(this.state.subChapterNumber);
        //decrement subchapter counter
        const newSubChapterNumber = this.state.subChapterNumber;
        this.handleSubchapterNavigation(newSubChapterNumber);
        this.flipColour(this.state.subChapterNumber);
        this.readSubChap();
      } else {
        //if at the beginning of a chapter
        if (this.state.chapterNumber > 0) {
          this.flipColour(this.state.subChapterNumber);
          //decrement chapter counter and set subchapter to end of previous chapter
          const newChapterNumber = this.state.chapterNumber - 1;
          this.handleChapterNavigation(newChapterNumber);
          this.handleSubchapterNavigation(this.getCurrentChap().subchapters.length);
          this.flipColour(this.state.subChapterNumber);
          this.resetComponents();
          this.read(this.getCurrentChap().name, this.state.audioConfig);
          this.read(this.getCurrentSubchap().name, this.state.audioConfig);
        } else {
          //if at beginning of textbook
          this.cancel();
          this.read('You have reached the beginning of the textbook', this.state.audioConfig);
        }
      }
    } else {
      //handling navigation for chapters
      if (this.state.chapterNumber > 0) {
        this.flipColour(this.state.chapterNumber);
        //increment chapter counter and set subchapter counter to 0
        const newChapterNumber = this.state.chapterNumber - 1;
        this.handleChapterNavigation(newChapterNumber);
        this.flipColour(this.state.chapterNumber);
        this.readChap();
      } else {
        //if at beginning of textbook
        this.cancel();
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
  //function to read the current subchapter name
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
  //function to set new chapter 
  handleChapterNavigation = chapterNumber => {
    speechSynthesis.cancel();
    this.setState({
      chapterNumber: chapterNumber,
      subChapterNumber: 0,
    });
  };
  //function to set new subchapter
  handleSubchapterNavigation = subChapterNumber => {
    this.setState({
      subChapterNumber: subChapterNumber - 1,
    });
  };
  //function to find the number of badges per line
  nearest3Mul = num => {
    let nearest3 = num;
    while ((nearest3%3) != 0) {
      nearest3 += 1;
    }
    return nearest3;
  };
  render() {
    //if chapter and subchapter have been selected, navigate to dashboard
    if (this.state.done) {
      return <Redirect to="/dashboard" />;
    }
    //set current chapter, subchapter, and navigation level to be displayed
    let navigation;
    let chapter = this.getCurrentChap().name;
    let subChapter = this.getCurrentSubchap().name;
    if (this.state.nav === 0) {
      navigation = 'Subchapter';
    } else {
      navigation = 'Chapter';
    }
    // create 3 rows of badges to be displayed 
    let x = this.nearest3Mul(this.state.componentValues.length)/3;
    let row1 = this.state.componentValues.slice(0,x);
    let row2 = this.state.componentValues.slice(x, 2*x);
    let row3 = this.state.componentValues.slice(2*x, this.state.componentValues.length);
    return (
      <div>
      <div>
        <h1>{chapter} </h1>
        <h2>{subChapter} </h2>
        <h2>Current navigation: {navigation} </h2>
        <div style={{ display: 'flex '}}>
          {row1.map(cell => (
            <TC num={cell} colour={this.state.colours[cell - 1]} />
          ))}
        </div>
        <div style={{ display: 'flex '}}>
          {row2.map(cell => (
            <TC num={cell} colour={this.state.colours[cell - 1]} />
          ))}
        </div>
        <div style={{ display: 'flex '}}>
          {row3.map(cell => (
            <TC num={cell} colour={this.state.colours[cell - 1]} />
          ))}
        </div>
        {this.state.showTutorial ? (
          <Tutorial closePopup={this.toggleTutorial.bind(this)} />
        ) : null}
    </div>
      <React.Fragment> 
        <Container>
          <SpeechModal show={this.state.showSpeechModal}>
              <div className={styles.AudioPanel}>
                <h1>Current audio speed: {this.state.audioSpeed}</h1>
                <h1>Set Speed to: {this.state.nextAudioSpeed}</h1>
                <br></br>
                <br></br>
                <br></br>
                <h1>
                  Hit <img src={enterKey}></img> to confirm your choice!
                </h1>
                <h1>
                  Hit <img src={escKey}></img> to exit this window!
                </h1>
              </div>
            </SpeechModal>
        </Container>
      </React.Fragment>
      </div>
    );
  }
}

export default Table;
