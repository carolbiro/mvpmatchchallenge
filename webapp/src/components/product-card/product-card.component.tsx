import { useContext, useState } from 'react';
import { ApiError, fetchWithAuth } from '../../services/api';
import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';
import { UserContext, UserRole, User } from '../../contexts/user.context';
import { ProductsContext, Product } from '../../contexts/products.context';

import {
    ProductCardContainer,
    ProductCardWraper,
    Name,
    Price,
    Available
} from './product-card.styles';

const ProductCard = ({ product }: any) => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const { currentProducts, setCurrentProducts } = useContext(ProductsContext);
    const { id, productName, cost, amountAvailable } = product;
    const [amount, setAmount] = useState('1');

    const handleBuy = async () => {
        try {
            const response = await fetchWithAuth('/transactions/buy', {
                method: 'POST',
                body: JSON.stringify({
                    "productId": id,
                    "amount": parseFloat(amount)
                })
            });
            const res = await response.json();

            if (!response.ok) {
                throw new ApiError(`${res.message}`);
            }

            // update the products context
            const updatedProducts = currentProducts.map(item => {
                if (item.id === id) {
                    item.amountAvailable -= parseFloat(amount);
                    return item;
                }
                return item;
            }) as Product[];
            await setCurrentProducts(updatedProducts);
            const user = currentUser as User;
            const newBalance = user.deposit - parseFloat(res.totalSpent);
            await setCurrentUser({...user, "deposit": newBalance });
            alert(`${amount} of "${productName}" has been purchased!\nTotal spent: ${res.totalSpent} cents.\nYour change is: ${JSON.stringify(res.change)}`);
        } catch (error) {
            console.error(error);
            if (error instanceof ApiError)
                alert(error.message);
        }
    }

    const handleDelete = async () => {
        try {
            await fetchWithAuth(`/products/${id}`, { method: 'DELETE'});

            // update the products context
            const updatedProducts = currentProducts.filter(item => item.id !== id) as Product[];
            await setCurrentProducts(updatedProducts);
            alert(`"${productName}" has been deleted!`);
        } catch (error) {
            console.log(error);
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
                {currentUser && currentUser.role === UserRole.Buyer && (
                    <>
                        <Button onClick={handleBuy} buttonType={BUTTON_TYPE_CLASSES.inverted}>
                            Buy
                        </Button>
                        <input type="text" name="amount" onChange={handleChange} value={amount} />
                    </>
                )}
                {currentUser && currentUser.role === UserRole.Seller && (
                    <Button onClick={handleDelete} buttonType={BUTTON_TYPE_CLASSES.inverted}>
                        Delete
                    </Button>
                )}
            </ProductCardWraper>
        </ProductCardContainer>
    );
};

export default ProductCard;
