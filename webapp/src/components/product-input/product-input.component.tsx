import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ApiError, fetchWithAuth } from '../../services/api';
import { ProductInputContainer } from './product-input.styles';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import { setCurrentProducts } from '../../store/products/products.action';
import { Product } from '../../store/products/products.types';

const defaultFormFields = {
    productName: '',
    amountAvailable: '',
    cost: ''
};

const ProductInput = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state:any) => state.user.currentUser);
    const currentProducts = useSelector((state:any) => state.products.currentProducts);

    const [formFields, setFormFields] = useState(defaultFormFields);
    const { productName, amountAvailable, cost } = formFields;
    const navigate = useNavigate();

    const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
        const { name, value } = event.target as HTMLInputElement;
        setFormFields({ ...formFields, [name]: value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const productToAdd = {
            productName,
            "amountAvailable": parseFloat(amountAvailable),
            "cost": parseFloat(cost),
            "sellerId": currentUser?.id,
        } as Product;

        try{        
            const response = await fetchWithAuth('/products', {
                method: 'POST',
                body: JSON.stringify(productToAdd)
            });
            const res = await response.json();
    
            if (!response.ok) {
                throw new ApiError(`${res.message}`);
            }
            
            currentProducts.push(productToAdd);
            await dispatch(setCurrentProducts(currentProducts));
            alert('Product added successfully!');
            navigate('/products');
        } catch (error) {
            console.error(error);
            if (error instanceof ApiError)
                alert(error.message);
        }
    };

    return (
        <ProductInputContainer>
            <h2>
                Add product
            </h2>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label='Productname:'
                    type='text'
                    required
                    onChange={handleChange}
                    name='productName'
                    value={productName}
                />
                <br />
                <FormInput
                    label='Amount Available:'
                    type='text'
                    required
                    onChange={handleChange}
                    name='amountAvailable'
                    value={amountAvailable}
                />
                <br />
                <FormInput
                    label='Cost:'
                    type='text'
                    required
                    onChange={handleChange}
                    name='cost'
                    value={cost}
                />
                <br />
                <Button type="submit">Add</Button>
            </form>
        </ProductInputContainer>
    )
}

export default ProductInput;
