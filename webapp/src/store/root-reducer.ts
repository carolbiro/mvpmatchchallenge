import { combineReducers } from 'redux';

import { userReducer } from './user/user.reducer';
import { productsReducer } from './products/products.reducer';

export const rootReduccer = combineReducers({
    user: userReducer,
    products: productsReducer
}) 