import { call, fork } from 'redux-saga/effects';

import {initPage} from './pageSaga';
import {serverWatcher} from './serverSaga';


export default function * () {
  yield fork(initPage);
}
