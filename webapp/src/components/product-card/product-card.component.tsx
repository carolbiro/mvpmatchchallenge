import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

import {
    ProductCartContainer,
    Footer,
    Name,
    Price,
} from './product-card.styles';

const ProductCard = ({ product }: any) => {
    const { productName, cost, sellerId } = product;

    return (
        <ProductCartContainer>
            <Footer>
                <Name>{productName}</Name>
                <Price>{cost}</Price>
            </Footer>
            {/* <Button buttonType={BUTTON_TYPE_CLASSES.inverted}>
                Add to card
            </Button> */}
        </ProductCartContainer>
    );
};

export default ProductCard;
