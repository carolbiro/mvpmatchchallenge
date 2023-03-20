// import { useDispatch, useSelector } from 'react-redux';
// import { addItemToCart } from '../../store/cart/cart.action';
// import { selectCartItems } from '../../store/cart/cart.selector';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import {
    ProductCartContainer,
    Footer,
    Name,
    Price,
} from './product-card.styles';

const ProductCard = ({ product }: any) => {
    //   const dispatch = useDispatch();
    //   const cartItems = useSelector(selectCartItems);
    const { productName, cost, sellerId } = product;

    //   const addProductToCart = () => dispatch(addItemToCart(cartItems, product));

    return (
        <ProductCartContainer>
            <Footer>
                <Name>{productName}</Name>
                <Price>{cost}</Price>
            </Footer>
            <Button
                buttonType={BUTTON_TYPE_CLASSES.inverted}
            >
                Add to card
            </Button>
        </ProductCartContainer>
    );
};

export default ProductCard;
