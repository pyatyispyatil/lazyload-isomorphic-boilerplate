import { fork } from 'redux-saga/effects';

import {initPage} from './pageSaga';


export default function * () {
  yield fork(initPage);
}
