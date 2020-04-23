import React, {Component} from 'react';
import styles from './errorModal.module.css';

class ErrorModal extends Component {
  render () {
    //checks whether to show modal or not
    if (!this.props.show) {
      return null;
    }
    return (
      <div className={styles.Modal}>
        <div>{this.props.children}</div>
      </div>
    );
  }
}

export default ErrorModal;
