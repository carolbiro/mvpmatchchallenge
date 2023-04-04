import { PRODUCTS_ACTION_TYPES } from "./products.types";

const INITIAL_STATE = {
    currentProducts: null
}

export const productsReducer = (state: any = INITIAL_STATE, action: any) => {
    const { type, payload } = action;

    switch (type) {
        case PRODUCTS_ACTION_TYPES.SET_CURRENT_PRODUCTS:
            return {
                ...state,
                currentProducts: payload
            }
        default:
            return state;
    }
}
