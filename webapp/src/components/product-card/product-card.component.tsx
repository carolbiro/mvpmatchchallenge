import { useContext, useState } from 'react';
import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';
import { AuthenticationContext, UserRole, Authentication } from '../../contexts/authentication.context';
import { ProductsContext, Product } from '../../contexts/products.context';

import {
    ProductCardContainer,
    ProductCardWraper,
    Name,
    Price,
    Available
} from './product-card.styles';

const ProductCard = ({ product }: any) => {
    const { currentAuthentication: currentAuthentication, setCurrentAuthentication: setCurrentAuthentication } = useContext(AuthenticationContext);
    const { currentProducts: currentProducts, setCurrentProducts: setCurrentProducts } = useContext(ProductsContext);
    const { id, productName, cost, amountAvailable } = product;
    const [amount, setAmount] = useState('1');

    const handleBuy = async () => {
        const response = await fetch('/transactions/buy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentAuthentication?.accessToken}`
            },
            body: JSON.stringify({
                "productId": id,
                "amount": parseFloat(amount)
            })
        });

        const bodyText = await response.text();
        const result = JSON.parse(bodyText);
        if (response.ok) {

            // update the products context
            const updatedProducts = currentProducts.map(item => {
                if (item.id === id) {
                    item.amountAvailable -= parseFloat(amount);
                    return item;
                }
                return item;
            }) as Product[]
            await setCurrentProducts(updatedProducts);
            const auth = currentAuthentication as Authentication;
            const newBalance = auth.user.deposit - parseFloat(result.totalSpent);
            const newUser = { ...auth.user, "deposit": newBalance };
            await setCurrentAuthentication({...auth, user: newUser})
        } else {
            const error = `Failed to load products: ${result.message}`;
            console.log(`Failed to load products: ${error}`);
            alert(error);
        }
    }

    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        const { value } = event.target as HTMLInputElement;
        setAmount(value);
    }

    return (
        <ProductCardContainer>
            <ProductCardWraper>
                <Name>{productName}</Name>
                <Available>{amountAvailable} available</Available>
                <Price>at {cost} cents</Price>
                {currentAuthentication && currentAuthentication.user.role === UserRole.Buyer && (
                    <>
                        <Button onClick={handleBuy} buttonType={BUTTON_TYPE_CLASSES.inverted}>
                            Buy
                        </Button>
                        <input type="text" name="amount" onChange={handleChange} value={amount} />
                    </>
                )}
            </ProductCardWraper>
        </ProductCardContainer>
    );
};

export default ProductCard;
