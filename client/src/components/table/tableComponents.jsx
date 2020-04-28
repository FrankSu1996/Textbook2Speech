import React, { Component } from "react";

class TC extends Component {
    state = {
        num: 0,
        colour:"badge badge-primary m-2"
    };

    styles = {
        fontSize: 80
    };
    render () {
        return (
            <div>
                <span style = {this.styles} className={this.state.colour}> {this.state.num}</span>
            </div>
        );
    }


}

export default TC