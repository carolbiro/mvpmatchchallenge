import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../../App';
import { AuthenticationContext } from '../../contexts/authentication.context';
import { ProductsContext, Product } from '../../contexts/products.context';
import { ProductInputContainer } from './product-input.styles';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';

const defaultFormFields = {
    productName: '',
    amountAvailable: '',
    cost: ''
};

const ProductInput = () => {
    const { currentAuthentication: currentAuthentication } = useContext(AuthenticationContext);
    const { currentProducts: currentProducts, setCurrentProducts: setCurrentProducts } = useContext(ProductsContext);
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
            "sellerId": currentAuthentication?.user.id,
        } as Product;

        try{        
            const response = await fetch('/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentAuthentication?.accessToken}`
                },
                body: JSON.stringify(productToAdd)
            });
    
            const res = await response.json();
    
            if (!response.ok) {
                throw new ApiError(`${res.message}`);
            }
            
            currentProducts.push(productToAdd);
            await setCurrentProducts(currentProducts);
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
