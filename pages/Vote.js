import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as vote from '../actions/voteActions';

class Vote extends Component {
  render() {
    return (
      <span>
        <span style={{
          border: '1px solid black',
          padding: '0 10px',
          lineHeight: '100%',
          marginLeft: '10px'
        }}>{this.props.vote.rating}</span>
        <button onClick={this.props.onIncrement}>+</button>
        <button onClick={this.props.onDecrement}>-</button>
        <button onClick={this.props.onReset}>reset</button>
      </span>
    );
  }
}

export default connect(
  (state) => state,
  (dispatch) => {
    return ({
      onIncrement: () => dispatch({type: vote.actions.INCREMENT}),
      onDecrement: () => dispatch({type: vote.actions.DECREMENT}),
      onReset: () => dispatch({type: vote.actions.RESET})
    })
  }
)(Vote);
