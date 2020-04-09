import React from 'react';
import '../index.css';
import leftArrow from '../images/left_arrow.png';
import upArrow from '../images/up_arrow.png';
import downArrow from '../images/down_arrow.png';
import rightArrow from '../images/right_arrow.png';


class Tutorial extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      text: "With Textbook2Speech, you can navigate and interact with your textbooks using only your keyboard. Keyboard commands: Press s to start the textbook reader. Press the up and down arrow keys to change the navigation state. Press the left and right arrow keys to navigate through the current navigation state.  Press t to access this tutorial at any time. ",
      audioConfig: new SpeechSynthesisUtterance()
    }
    this.closeTutorial = this.closeTutorial.bind(this);
  }
  componentDidMount(){
    var text = this.state.text;
    speechSynthesis.speak(new SpeechSynthesisUtterance(text))
  }

  closeTutorial() {
    speechSynthesis.cancel();
    this.props.closePopup();

  }

  keyPress = (event) => {
    if (event.keyCode == 84) {
      this.closeTutorial();
    }
  }

  render() {
    const text = this.state.text;
    return (
      <div className='popup' onKeyPress={this.keyPress} tabIndex="0">
        <div className='popup_inner'>

          <button onClick={this.closeTutorial}>X</button>
          <p style={{fontSize: "20px"}}> With Textbook2Speech, you can navigate and interact with your textbooks using only your keyboard.
           <br/>
           <b>Keyboard commands</b>
           <br/>
           Press s to start the textbook reader. Press the <img src={upArrow} />  and <img src={downArrow} /> arrow keys to change the navigation state.
           Press the <img src={leftArrow} /> and <img src={rightArrow} /> arrow keys to navigate through the current navigation state.
           Press t to access this tutorial at any time.
          </p>


        </div>
      </div>

    );
  }
}

export default Tutorial;
