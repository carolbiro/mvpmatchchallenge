import { combineReducers } from 'redux';

import { userReducer } from './user/user.reducer'

export const rootReduccer = combineReducers({
    user: userReducer
}) 