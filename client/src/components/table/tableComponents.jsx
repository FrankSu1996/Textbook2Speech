import React, { Component } from "react";

class TC extends Component {
    state = {
        num: this.props.num
    };

    styles = {
        fontSize: 110
    };
    render () {
        let colour;
        if (this.props.colour == 0){
            colour = "badge badge-primary m-2"
        }
        else {
            colour = "badge badge-dark m-2"
        }
        return (
            <div>
                <span style = {this.styles} className={colour}> {this.props.num}</span>
            </div>
        );
    }


}

export default TC