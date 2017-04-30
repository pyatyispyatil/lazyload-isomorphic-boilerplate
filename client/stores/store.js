import {compose, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

import middleware from '../middleware';
import configureStore from '../../stores/configureStore';
import rootSaga from './../../sagas';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore(window.REDUX_INITIAL_STATE || {}, compose(applyMiddleware(sagaMiddleware), middleware));
sagaMiddleware.run(rootSaga);

export default store;
