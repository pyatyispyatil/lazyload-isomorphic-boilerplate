import React, {Component} from 'react';
import {connect} from 'react-redux';

class Catalog extends Component {
  render() {
    console.log('catalog props:', this.props.catalog);
    return (
      <div>
        <h2>Catalog</h2>
        <ol>
          {this.props.catalog.items.map((item) => <li>{item.label}</li>)}
        </ol>
        <hr/>
        {this.props.children}
      </div>
    )
  }
}

export default connect(
  (state) => state,
  (dispatch) => {
    return ({
    })
  }
)(Catalog);
