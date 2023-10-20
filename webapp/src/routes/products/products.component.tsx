import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductsPreview from '../../components/products/products.component';
import { ApiError } from '../../services/api';
import { setCurrentProducts } from '../../store/products/products.action';

const Products = () => {
    const dispatch = useDispatch();
    const currentProducts = useSelector((state:any) => state.products.currentProducts);

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

                await dispatch(setCurrentProducts(res));
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
            {currentProducts ? 
                <ProductsPreview key="Products" title="Products" products={currentProducts}/> :
                <>Loading</>
            }
        </div>
    );
}
    
export default Products;