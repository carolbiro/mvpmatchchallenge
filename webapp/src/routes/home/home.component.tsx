import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductsPreview from '../../components/products/products.component';


const Home = () => {
    const [products, setProducts] = useState();

    useEffect(() => {
        const getProducts = async () => {
            const response = await fetch('/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const bodyText = await response.text();
            if (response.ok) {
                setProducts(JSON.parse(bodyText));
                console.log(products);
            } else {
                const error = JSON.parse(bodyText);
                console.log(`Failed to load products: ${error.message}`);
            }
        }
        getProducts();
    },[]);

    console.log(products);


    return (
        <div>
            <ProductsPreview key="Products" title="Products" products={products}/>
            <Outlet />
        </div>
    );
};

export default Home;
