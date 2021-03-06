import React from "react";
import "../index.css";
import leftArrow from "../images/left_arrow.png";
import upArrow from "../images/up_arrow.png";
import downArrow from "../images/down_arrow.png";
import rightArrow from "../images/right_arrow.png";
import p from "../images/p_key.png";
import r from "../images/r_key.png";
import t from "../images/t_key.png";
import o from "../images/o_key.png";
import s from "../images/s_key.png";
import c from "../images/c_key.png";
import esc from "../images/esc_key.png";

class Tutorial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text:
        'With Textbook2Speech, you can navigate and interact with your textbooks using only your \
         keyboard. To make our application as simple and convenient \
         as possible, we use "navigation states". To understand what navigation \
         states are, imagine the textbook as a hierarchy divided into \
         chapters, subchapters, and paragraphs. A navigation state refers to \
         a level in this hierarchy. Continue this tutorial to learn the different \
         keyboard commands that are used to control Textbook2Speech. \
         Keyboard commands: Press o to change the speed of the text reader. Press s to start the textbook reader, or restart after navigation. Press p to pause. \
         Press r to resoom. Press the escape key to cancel. Press the up and down arrow \
         keys to change the navigation state. For example, if you are currently on the subchapters navigation state, press \
         the up arrow key to set the navigation state to chapter. Press the down arrow \
         key to set the navigation state to paragraphs. Press the left and right arrow keys to navigate through \
         the current navigation state. For example, if you are currently on the chapter navigation state, \
         press the left arrow key to go to the previous chapter. Press the right \
         arrow key to go to the next chapter. Press t to open or close this tutorial at any time. \
         Press c to go to the table of contents\
         In the table of contents, the navigation commands are the same. Press s to begin navigation, \
         then press enter to select the current chapter and subchapter you wish to listen to. \
         Layout of main user interface: For users who can view the screen, the title of the textbook is located at the centre of the screen. Below that is the \
         navigation tool containing the contents of the textbook. It displays the chapter title, \
         subchapter title, the appropriate passage from the textbook, and the current navigation level.\
         Layout of table of contents: there is a grid representation of the current chapter or subchapter you are navigating through. \
         If the boxes are grey, you are navigating through the chapters. If the boxes are blue, you are navigating through the \
         subchapters of a specific chapter. The current chapter, subchapter, and navigation are also displayed at the top of the page',
      audioConfig: new SpeechSynthesisUtterance(),
    };
    this.closeTutorial = this.closeTutorial.bind(this);
  }
  componentDidMount() {
    this.startAudio();
  }

  closeTutorial() {
    speechSynthesis.cancel();
    this.props.closePopup();
  }

  startAudio() {
    var synth = window.speechSynthesis;
    var text = this.state.text;
    var audio = new SpeechSynthesisUtterance(text);
    audio.onstart = () => console.log(audio.text);
    synth.speak(audio);
  }

  keyPress = (event) => {
    if (event.keyCode == 84) {
      this.closeTutorial();
    }
  };

  render() {
    const text = this.state.text;
    return (
      <div
        className="popup"
        onKeyPress={this.keyPress}
        tabIndex="0"
        style={{ height: "1300px" }}
      >
        <div className="popup_inner">
          <button onClick={this.closeTutorial}>X</button>
          <p style={{ fontSize: "20px" }}>
            {" "}
            With Textbook2Speech, you can navigate and interact with your
            textbooks using only your keyboard. To make our application as
            simple and convenient as possible, we use "navigation states". To
            understand what navigation states are, imagine the textbook as a
            hierarchy divided into chapters, subchapters, and paragraphs. A
            navigation state refers to a level in this hierarchy. Continue this
            tutorial to learn the different keyboard commands that are used to
            control Textbook2Speech.
            <br />
            <br />
            <b>Keyboard commands</b>
            <br />
            <ul>
              <li>
                Press <img src={o}></img> to change the speed of the text
                reader.
              </li>
              <li>
                Press <img src={s}></img> to start the textbook reader, or
                restart after navigation
              </li>
              <li>
                Press <img src={p} /> to pause.{" "}
              </li>
              <li>
                Press <img src={r} /> to resume.{" "}
              </li>
              <li>
                Press <img src={esc} /> to cancel.{" "}
              </li>
              <li>
                Press the <img src={upArrow} /> and <img src={downArrow} />{" "}
                arrow keys to change the navigation state. For example, if you
                are currently on the subchapters navigation state, press
                <img src={upArrow} /> to set the navigation state to chapter.
                Press <img src={downArrow} />
                to set the navigation state to paragraphs.
              </li>
              <li>
                Press the <img src={leftArrow} /> and <img src={rightArrow} />{" "}
                arrow keys to navigate through the current navigation state. For
                example, if you are currently on the chapter navigation state,
                press <img src={leftArrow} /> to go to the previous chapter.
                Press <img src={rightArrow} /> to go to the next chapter.
              </li>
              <li>
                Press <img src={t}></img> to open/close this tutorial at any
                time.
              </li>
              <li>
                Press <img src={c}></img> to go to the table of contents
              </li>
              <li>
                For the table of contents, all of the commands are the same.
                Press enter to select the current chapter and subchapter.
              </li>
            </ul>
            <br />
            <b>Layout</b>
            <br />
            For users who can view the screen, your audio preference settings
            are located at the top of the screen. The title of the textbook is
            located at the centre of the screen. Below that is the navigation
            tool containing the contents of the textbook. It displays the
            chapter title, subchapter title, the appropriate passage from the
            textbook, and the current navigation level.
          </p>
        </div>
      </div>
    );
  }
}

export default Tutorial;
