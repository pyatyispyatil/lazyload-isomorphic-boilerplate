import React, {Component} from 'react';
import {connect} from 'react-redux';
import {action} from '../actions/voteActions';

class Vote extends Component {
  render() {
    return (
      <div>
        <div style={{
          width: '100px',
          height: '100px',
          border: '1px solid black',
          fontSize: '40px'
        }}>{this.props.vote.rating}</div>
        <button onClick={this.props.onIncrement}>+</button>
        <button onClick={this.props.onDecrement}>-</button>
        <button onClick={this.props.onReset}>reset</button>
      </div>
    );
  }
}

export default connect(
  (state) => state,
  (dispatch) => {
    return ({
      onIncrement: () => dispatch({type: action.INCREMENT}),
      onDecrement: () => dispatch({type: action.DECREMENT}),
      onReset: () => dispatch({type: action.RESET})
    })
  }
)(Vote);
