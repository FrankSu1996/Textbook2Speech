import React, { Component } from "react";

class TC extends Component {
    state = {
        num: this.props.num,
        colour: this.props.colour
    };

    styles = {
        fontSize: 100
    };
    render () {
        let colour;
        if (this.state.colour == 0){
            colour = "badge badge-primary m-2"
        }
        else {
            colour = "badge badge-dark m-2"
        }
        return (
            <div>
                <span style = {this.styles} className={colour}> {this.state.num}</span>
            </div>
        );
    }


}

export default TC