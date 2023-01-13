import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './store';
import { composeWithDevTools } from 'redux-devtools-extension';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export default function configureStore() {
  return createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...[thunk]))
  );
}