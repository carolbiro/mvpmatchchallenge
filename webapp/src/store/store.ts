import {compose, createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';

import { rootReduccer } from './root-reducer';

const middleWares = [logger];

const composedEnhancers = compose(applyMiddleware(...middleWares));

export const store =  createStore(rootReduccer, undefined, composedEnhancers);