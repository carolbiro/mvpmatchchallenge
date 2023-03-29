import { useContext, useEffect } from 'react';
import ProductsPreview from '../../components/products/products.component';
import { ProductsContext } from '../../contexts/products.context';
import { ApiError } from '../../services/api';

const Products = () => {
    const { currentProducts, setCurrentProducts } = useContext(ProductsContext);
    useEffect(() => {
        const getProducts = async () => {
            try {    
                const response = await fetch('/products', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const res = await response.json();

                if (!response.ok) {
                    throw new ApiError(`${res.message}`);
                }

                await setCurrentProducts(res);
            } catch (error) {
                console.error(error);
                if (error instanceof ApiError)
                    alert(error.message);
            }
        }
        getProducts();
        // eslint-disable-next-line
    },[]);
    return (
        <div>
            <ProductsPreview key="Products" title="Products" products={currentProducts}/>
        </div>
    );
}

export default Products;