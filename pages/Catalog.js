import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class Catalog extends Component {
  render() {
    return (
      <div>
        <h2>Catalog</h2>
        <ol>
          {this.props.catalog.items.map((item) =>
            <li>
              <Link to={`/catalog/vote/${item.id}`}>{item.label}</Link>
              {this.props.vote.id === item.id ? this.props.children : null}
            </li>
          )}
        </ol>
        <hr/>
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
