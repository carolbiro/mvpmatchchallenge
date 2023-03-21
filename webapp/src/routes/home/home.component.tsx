import { useEffect, useState, useContext } from 'react';
import { ProductsContext } from '../../contexts/products.context';
import { AuthenticationContext, UserRole } from '../../contexts/authentication.context';
import  Deposit from '../../components/deposit/deposit.component';
import { HomeContainer, Title } from './home.styles';

const Home = () => {
    const [products, setProducts] = useState();
    const { setCurrentProducts: setCurrentProducts } = useContext(ProductsContext);
    const { currentAuthentication: currentAuthentication } = useContext(AuthenticationContext);

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


    return (
        <HomeContainer>
            <h2>
                <Title to={''}>Home</Title>
            </h2>
            {(currentAuthentication &&
                <>
                    <div>
                        Logged in as: <b>{currentAuthentication.user.username}</b>.
                    </div>
                    <div>
                        Role: <b>{currentAuthentication.user.role}</b>
                    </div>
                    {(currentAuthentication.user.role ===  UserRole.Buyer &&
                        <div>
                        <Deposit/>    
                        </div>
                    )}
                </>
            )}
        </HomeContainer>
    );
};

export default Home;
