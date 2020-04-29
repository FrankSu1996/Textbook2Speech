import React, { Component } from "react";
import Textbook from "../../textbook/textbook";
import Tutorial from "../Tutorial";
import styles from "./dashboard.module.css";
import leftArrow from "../../images/left_arrow.png";
import upArrow from "../../images/up_arrow.png";
import downArrow from "../../images/down_arrow.png";
import rightArrow from "../../images/right_arrow.png";
import tKey from "../../images/t_key.png";
import ErrorModal from "../errorModal/errorModal";
import SpeechModal from "../errorModal/errorModal";
import { Container, Row, Col } from "react-bootstrap";
import { Redirect, BrowserRouter as Router } from "react-router-dom";
import {
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Collapse,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadset } from "@fortawesome/free-solid-svg-icons";
import oKey from "../../images/o_key.png";

const NAVIGATION = {
  PARAGRAPH: 0,
  SUBCHAP: 1,
  CHAP: 2,
  MAX: 3,
};

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <Container>
            <NavbarBrand>
              <FontAwesomeIcon icon={faHeadset} /> Textbook2Speech{" "}
            </NavbarBrand>
            <Nav>
              <NavItem>
                Capstone 2019-2020 Group 3: Anna Jo, Frank Su, Anna
                Lindsay-Mosher, Peter Weng
              </NavItem>
            </Nav>
          </Container>
        </Navbar>
      </div>
    );
  }
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textbookSelected: Textbook,
      navigation: NAVIGATION.PARAGRAPH,
      audioSpeed: 1,
      audioConfig: new SpeechSynthesisUtterance(),
      chapterNumber: this.props.chapterStart,
      subChapterNumber: this.props.subChapterStart,
      paragraphNumber: 0,
      stopPlay: false,
      currentTextToRead:
        "This unit introduces the idea of thinking scientifically about language by making empirical observations rather than judgments of correctness.",
      showTutorial: false,
      upArrowBoxColor: "black",
      downArrowBoxColor: "black",
      leftArrowBoxColor: "black",
      rightArrowBoxColor: "black",
      showErrorModal: false,
      showSpeechModal: false,
      modalMessage: "",
      nav: false,
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);

    //disables up and down arrow causing browser to scroll
    window.addEventListener(
      "keydown",
      function (e) {
        // space and arrow keys
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
          e.preventDefault();
        }
      },
      false
    );
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  //function to show modal
  showErrorModal = (e) => {
    this.cancel();
    this.setState({ showErrorModal: true });
  };

  //function to close error modal
  closeErrorModal = (e) => {
    this.cancel();
    this.setState({ showErrorModal: false });
  };

  //function to open speech modal
  showSpeechModal = (e) => {
    this.cancel();
    this.setState({ showSpeechModal: true });
  };

  //function to close speech modal
  closeSpeechModal = (e) => {
    this.cancel();
    this.setState({ showSpeechModal: false });
  };

  //function to open/close tutorial
  toggleTutorial = () => {
    this.cancel();
    this.setState({
      showTutorial: !this.state.showTutorial,
    });
  };

  //handler for keypress events
  handleKeyPress = (event) => {
    if (this.state.showErrorModal) {
      if (event.keyCode === 27) {
        this.closeErrorModal();
      }
    } else if (this.state.showSpeechModal) {
      if (event.keyCode === 27) {
        this.closeSpeechModal();
      }
    } else {
      switch (event.keyCode) {
        //'s' key to start speech api
        case 83:
          this.startSpeechHandler(this.state.audioConfig);
          break;
        //'c' key to navigate to contentes
        case 67:
          this.setState({ nav: true });
          this.cancel();
          speechSynthesis.cancel();
          break;
        //'esc' key to stop speech api
        case 27:
          this.cancel();
          break;
        case 37:
          // left arrow key handler
          this.leftArrowHandler();
          break;
        case 39:
          // right arrow key handler
          this.rightArrowHandler();
          break;
        case 38:
          // up arrow key handler
          this.upArrowHandler();
          break;
        case 40:
          // down arrow key handler
          this.downArrowHandler();
          break;
        //p key pauses speech api
        case 80:
          speechSynthesis.pause();
          break;
        //r key resumes
        case 82:
          speechSynthesis.resume();
          break;
        //t toggles tutorial
        case 84:
          this.toggleTutorial();
          break;
        //o opens peech modal
        case 79:
          this.showSpeechModal();
          break;
        default:
          break;
      }
    }
  };

  //handler to start speech api on current text to read. Will continuously read through paragraphs
  //until another functionality key is pressed
  startSpeechHandler = (config) => {
    speechSynthesis.cancel();
    this.readAllParagraphsInSubchapter(
      this.state.subChapterNumber,
      this.state.audioConfig
    );
  };

  //function to read all paragraphs in given subchapter
  readAllParagraphsInSubchapter = (subChapterNum, config) => {
    this.setState({ subChapterNumber: subChapterNum, stopPlay: false });
    if (this.state.stopPlay === true) {
      setTimeout(
        this.readAllParagraphsInSubchapter,
        100,
        subChapterNum,
        config
      );
    } else {
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
        this.setState({ currentTextToRead: list[index] });
        this.speech(list[index], config);
        //check if end of subchapter
        if (index === list.length - 1) {
          this.speech("End of subchapter", config);
          return;
        }
        let newIndex = index;
        this.setState({ paragraphNumber: newIndex });
        this.continuousRead(list, newIndex, config);
      }
    }
  };

  //handler for up arrow key events
  upArrowHandler = () => {
    this.cancel();
    //increments the navigation state
    if (this.state.navigation < NAVIGATION.MAX - 1) {
      let navigation = this.state.navigation;
      navigation += 1;
      this.setState({ navigation: navigation });
      if (navigation === NAVIGATION.SUBCHAP) {
        speechSynthesis.cancel();
        this.speech("Subchapter navigation", this.state.audioConfig);
      } else if (navigation === NAVIGATION.CHAP) {
        speechSynthesis.cancel();
        this.speech("Chapter navigation", this.state.audioConfig);
      }
    }
    //hacky way to flicker background color
    this.setState({ upArrowBoxColor: "red" });
    setTimeout(() => {
      this.setState({ upArrowBoxColor: "black" });
    }, 65);
  };

  //handler for down arrow key events
  downArrowHandler = () => {
    this.cancel();
    //decrements the navigation state
    if (this.state.navigation > 0) {
      let navigation = this.state.navigation;
      navigation -= 1;
      this.setState({ navigation: navigation });
      if (navigation === NAVIGATION.SUBCHAP) {
        speechSynthesis.cancel();
        this.speech("Subchapter navigation", this.state.audioConfig);
      } else if (navigation === NAVIGATION.PARAGRAPH) {
        speechSynthesis.cancel();
        this.speech("Paragraph navigation", this.state.audioConfig);
      }
    }
    //hacky way to flicker background color
    this.setState({ downArrowBoxColor: "red" });
    setTimeout(() => {
      this.setState({ downArrowBoxColor: "black" });
    }, 65);
  };

  //handler for left arrow key events
  rightArrowHandler = () => {
    this.cancel();
    //hacky way to flicker background color
    this.setState({ rightArrowBoxColor: "red" });
    setTimeout(() => {
      this.setState({ rightArrowBoxColor: "black" });
    }, 65);
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
      } else if (
        this.state.paragraphNumber ===
          this.getCurrentSubchapter().paragraphs.length - 1 &&
        this.state.subChapterNumber <
          this.getCurrentChapter().subchapters.length - 1
      ) {
        //reached end of subchapter: navigates to first paragraph of next subchapter
        const newSubChapterNumber = this.state.subChapterNumber + 2;
        this.handleSubchapterNavigation(newSubChapterNumber);
      } else if (
        this.state.chapterNumber <
        this.state.textbookSelected.chapters.length - 1
      ) {
        //reached end of chapter: navigate to first paragraph of first subchapter of next chapter
        if (
          this.state.chapterNumber <
          this.state.textbookSelected.chapters.length - 1
        ) {
          const newChapterNumber = this.state.chapterNumber + 1;
          this.handleChapterNavigation(newChapterNumber);
        }
      } else {
        this.setState({
          modalMessage:
            "Reached end of chapters! Please hit Escape to exit this window",
        });
        this.showErrorModal();
        this.cancel();
        this.speech(
          "Error: Reached end of chapters! Please hit Escape to exit this window",
          this.state.audioConfig
        );
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
      } else if (
        this.state.subChapterNumber ===
          this.getCurrentChapter().subchapters.length - 1 &&
        this.state.chapterNumber <
          this.state.textbookSelected.chapters.length - 1
      ) {
        //reached end of current chapter: Navigate to first subchapter of next chapter
        const newChapterNumber = this.state.chapterNumber + 1;
        this.handleChapterNavigation(newChapterNumber);
      } else {
        this.setState({
          modalMessage:
            "Reached end of chapters! Please hit Escape to exit this window",
        });
        this.showErrorModal();
        this.cancel();
        this.speech(
          "Error: Reached end of chapters! Please hit Escape to exit this window",
          this.state.audioConfig
        );
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
        this.setState({
          modalMessage:
            "Reached end of chapters! Please hit Escape to exit this window",
        });
        this.showErrorModal();
        this.cancel();
        this.speech(
          "Error: Reached end of chapters! Please hit Escape to exit this window",
          this.state.audioConfig
        );
      }
    }
  };

  //handler for right arrow key events
  leftArrowHandler = () => {
    this.cancel();
    //hacky way to flicker background color
    this.setState({ leftArrowBoxColor: "red" });
    setTimeout(() => {
      this.setState({ leftArrowBoxColor: "black" });
    }, 65);
    if (this.state.navigation === NAVIGATION.PARAGRAPH) {
      //check if incrementing paragraph counter will go out of bounds
      if (this.state.paragraphNumber > 0) {
        //increment paragraph counter in state
        let newParagraphNumber = this.state.paragraphNumber;
        this.handleParagraphNavigation(newParagraphNumber);
      } else if (
        this.state.paragraphNumber === 0 &&
        this.state.subChapterNumber > 0
      ) {
        //reached beginning of subchapter: navigates to last paragraph of last subchapter
        const newSubChapterNumber = this.state.subChapterNumber;
        this.handleSubchapterNavigation(newSubChapterNumber);
        const newParagraphNumber = this.getCurrentSubchapter().paragraphs
          .length;
        this.handleParagraphNavigation(newParagraphNumber);
        this.speech(
          "subchapter " + this.getCurrentSubchapter().name,
          this.state.audioConfig
        );
      } else if (
        this.state.chapterNumber > 0 &&
        this.state.paragraphNumber === 0 &&
        this.state.subChapterNumber === 0
      ) {
        //reached beginning of subchapter: navigates to last paragraph of last subchapter of last chapter
        const newChapterNumber = this.state.chapterNumber - 1;
        this.handleChapterNavigation(newChapterNumber);
        const newSubChapterNumber = this.getCurrentChapter().subchapters.length;
        this.handleSubchapterNavigation(newSubChapterNumber);
        const newParagraphNumber = this.getCurrentSubchapter().paragraphs
          .length;
        this.handleParagraphNavigation(newParagraphNumber);
        this.speech(
          "subchapter " + this.getCurrentSubchapter().name,
          this.state.audioConfig
        );
      } else {
        this.setState({
          modalMessage:
            "Reached the beginning of the first chapter! Please hit Escape to exit this window",
        });
        this.showErrorModal();
        this.cancel();
        this.speech(
          "Error: Reached the beginning of the first chapter! Please hit Escape to exit this window",
          this.state.audioConfig
        );
      }
    } else if (this.state.navigation === NAVIGATION.SUBCHAP) {
      //handling navigation for subchapters
      if (this.state.subChapterNumber > 0) {
        //increment subchapter counter and set paragraph counter to 0
        const newSubChapterNumber = this.state.subChapterNumber;
        this.handleSubchapterNavigation(newSubChapterNumber);
      } else if (
        this.state.subChapterNumber === 0 &&
        this.state.chapterNumber > 0
      ) {
        //reached beginning of current chapter: Navigate to last subchapter of previous chapter
        const newChapterNumber = this.state.chapterNumber - 1;
        this.handleChapterNavigation(newChapterNumber);
        const newSubChapterNumber = this.getCurrentChapter().subchapters.length;
        this.handleSubchapterNavigation(newSubChapterNumber);
      } else {
        this.setState({
          modalMessage:
            "Reached the beginning of the first chapter! Please hit Escape to exit this window",
        });
        this.showErrorModal();
        this.cancel();
        this.speech(
          "Error: Reached the beginning of the first chapter! Please hit Escape to exit this window",
          this.state.audioConfig
        );
      }
    } else {
      //handling navigation for chapters
      if (this.state.chapterNumber > 0) {
        //increment chapter counter and set both subchapter and paragraph counter to 0
        const newChapterNumber = this.state.chapterNumber - 1;
        this.handleChapterNavigation(newChapterNumber);
      } else {
        this.setState({
          modalMessage:
            "Reached the beginning of the first chapter! Please hit Escape to exit this window",
        });
        this.showErrorModal();
        this.cancel();
        this.speech(
          "Error: Reached the beginning of the first chapter! Please hit Escape to exit this window",
          this.state.audioConfig
        );
      }
    }
  };

  //function to start the speech api
  speech = (text, config) => {
    console.log("Speech currently playing...");
    config.text = text;
    speechSynthesis.speak(config);
  };

  //function to set the text that is to be read. Will cancel the speech api to do so
  setTextToRead = (text) => {
    speechSynthesis.cancel();
    this.setState({ currentTextToRead: text });
  };

  //function to set the rate of speech. Will cancel the current speech api to do so
  setAudioSpeed = (config) => {
    speechSynthesis.cancel();
    config.rate = this.state.audioSpeed;
    this.speech("Audio speed set to:" + config.rate, config);
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
  getParagraph = (paragraphNumber) => {
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
    this.setState({ currentTextToRead: newParagraph });
  };

  //handles navigating to a certain subChapter, starts at the first paragraph
  handleSubchapterNavigation = (subchapterNumber) => {
    //cancel speech api
    speechSynthesis.cancel();
    this.setState({
      subChapterNumber: subchapterNumber - 1,
      paragraphNumber: 0,
    });
    let text = this.getParagraph(this.state.paragraphNumber).text;
    this.setState({ currentTextToRead: text });
    this.speech(
      "subchapter " + this.getCurrentSubchapter().name,
      this.state.audioConfig
    );
  };

  //handles navigating to a certain paragraph
  handleParagraphNavigation = (paragraphNumber) => {
    //cancel speech api
    speechSynthesis.cancel();
    this.setState({ paragraphNumber: paragraphNumber - 1 });
    let text = this.getParagraph(this.state.paragraphNumber).text;
    this.setState({ currentTextToRead: text });
  };

  //handles navigating to a certain chapter
  handleChapterNavigation = (chapterNumber) => {
    speechSynthesis.cancel();
    this.setState({
      chapterNumber: chapterNumber,
      subChapterNumber: 0,
      paragraphNumber: 0,
    });
    //retrieve next paragraph to read and change state
    let newParagraph = this.getParagraph(this.state.paragraphNumber).text;
    this.setState({ currentTextToRead: newParagraph });
    this.speech(this.getCurrentChapter().name, this.state.audioConfig);
    this.speech(
      "subchapter " + this.getCurrentSubchapter().name,
      this.state.audioConfig
    );
  };

  //function to cancel speech api
  cancel = () => {
    var newPNumber = this.state.paragraphNumber;
    const textToRead = this.getParagraph(newPNumber).text;

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
    let nextNavigation;
    let previousNavigation;
    //navigate to table of contents if t is pressed
    if (this.state.nav === true) {
      return <Redirect to="/" />;
    }
    const upArrowBoxColor = {
      backgroundColor: this.state.upArrowBoxColor,
    };

    const downArrowBoxColor = {
      backgroundColor: this.state.downArrowBoxColor,
    };

    const leftArrowBoxColor = {
      backgroundColor: this.state.leftArrowBoxColor,
    };

    const rightArrowBoxColor = {
      backgroundColor: this.state.rightArrowBoxColor,
    };

    if (this.state.navigation === NAVIGATION.PARAGRAPH) {
      navigation = "Paragraph";
      nextNavigation = "Subchapter";
      previousNavigation = "Paragraph";
    } else if (this.state.navigation === NAVIGATION.CHAP) {
      navigation = "Chapter";
      nextNavigation = "Chapter";
      previousNavigation = "Subchapter";
    } else {
      navigation = "Subchapter";
      nextNavigation = "Chapter";
      previousNavigation = "Paragraph";
    }

    const ColStyle = {
      paddingLeft: 0,
      paddingRight: 0,
    };

    const leftRightArrowStyle = {
      display: "block",
      margin: "auto",
      marginTop: 180,
    };

    return (
      <React.Fragment>
        <Header></Header>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "50px",
            marginTop: "40px",
          }}
        >
          Press <img src={tKey} alt="UpArrow" width="50" height="50" /> to open
          the Tutorial
        </h1>

        <div className={styles.Title}>
          <h1>{this.state.textbookSelected.name}</h1>
        </div>

        <Container>
          <Row>
            <Col
              xs={2}
              className={styles.LeftArrowDiv}
              style={leftArrowBoxColor}
            >
              <img
                src={leftArrow}
                alt="UpArrow"
                width="50"
                height="50"
                style={leftRightArrowStyle}
              />
              <h4>Prev Paragraph</h4>
            </Col>
            <Col xs={6} md={8} style={ColStyle}>
              {/* Div for the up arrow */}
              <div className={styles.UpArrowDiv} style={upArrowBoxColor}>
                <img src={upArrow} alt="UpArrow" width="50" height="50" />
                <h2>Set Navigation To: {nextNavigation}</h2>
              </div>

              {/* Div for textbook text */}
              <div className={styles.TextbookDiv}>
                <h1>{chapterName}</h1>
                <h2>{subChapterName}</h2>
                <h5 className={styles.TextArea}>{text}</h5>
                <h3>Current navigation : {navigation}</h3>
              </div>

              {/* Div for the down arrow */}
              <div className={styles.DownArrowDiv} style={downArrowBoxColor}>
                <img src={downArrow} alt="downArrow" width="50" height="50" />
                <h2>Set Navigation To: {previousNavigation}</h2>
              </div>
            </Col>
            <Col
              xs={2}
              className={styles.RightArrowDiv}
              style={rightArrowBoxColor}
            >
              <img
                src={rightArrow}
                alt="UpArrow"
                width="50"
                height="50"
                style={leftRightArrowStyle}
              />
              <h4>Next Paragraph</h4>
            </Col>
            {this.state.showTutorial ? (
              <Tutorial closePopup={this.toggleTutorial.bind(this)} />
            ) : null}
          </Row>
          <ErrorModal show={this.state.showErrorModal}>
            <h1 style={{ textAlign: "center" }}>Error!</h1>
            <h2>{this.state.modalMessage}</h2>
          </ErrorModal>
          <SpeechModal show={this.state.showSpeechModal}>
            <div className={styles.AudioPanel}>
              <h1>Set audio speed to: (Between 1 - 10)</h1>
              <input
                value={this.state.audioSpeed}
                type="number"
                onChange={(e) => this.setState({ audioSpeed: e.target.value })}
              />
              <button
                onClick={(e) => this.setAudioSpeed(this.state.audioConfig)}
              >
                Set
              </button>
            </div>
          </SpeechModal>
        </Container>
      </React.Fragment>
    );
  }
}

export default Dashboard;
