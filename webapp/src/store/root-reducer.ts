import { combineReducers } from '@reduxjs/toolkit';

import { userReducer } from './user/user.reducer';
import { productsReducer } from './products/products.reducer';

export const rootReducer = combineReducers({
    user: userReducer,
    products: productsReducer
}) 