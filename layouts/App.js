import React from 'react';
import {Link} from 'react-router-dom';

export default ({children}) =>
  (
    <div style={{
      border: '2px solid red'
    }}>
      Hello<br/>
      <a href="/">/</a><br/>
      <a href="/catalog">catalog</a><br/>
      <a href="/catalog/page3">page3</a><br/>
      <div>{children}</div>
    </div>
  )
