import middleware from '../middleware';
import configureStore from '../../stores/configureStore';

export default configureStore(window.REDUX_INITIAL_STATE || {}, middleware);
