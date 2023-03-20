import { useEffect, useState, useContext } from 'react';
import { ProductsContext } from '../../contexts/products.context';

const Home = () => {
    const [products, setProducts] = useState();
    const { setCurrentProducts: setCurrentProducts } = useContext(ProductsContext);

    useEffect(() => {
        const getProducts = async () => {
            const response = await fetch('/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const bodyText = await response.text();
            setCurrentProducts(JSON.parse(bodyText))
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
            HOME COMPONENT
        </div>
    );
};

export default Home;
