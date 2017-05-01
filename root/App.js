import React from 'react';
import {Link} from 'react-router-dom';

export default ({children}) =>
  (
    <div style={{
      border: '2px solid red'
    }}>
      <h1>Hello</h1>
      <div>
        <Link to="/">/</Link>
      </div>
      <div>
        <Link to="/catalog">catalog</Link>
      </div>
      <div>{children}</div>
    </div>
  )
