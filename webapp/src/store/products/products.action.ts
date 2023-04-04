import { PRODUCTS_ACTION_TYPES } from "./products.types";
import { createAction } from '../../utils/reducer.utils';

export const setCurrentProducts = (products: any) => createAction(PRODUCTS_ACTION_TYPES.SET_CURRENT_PRODUCTS, products);