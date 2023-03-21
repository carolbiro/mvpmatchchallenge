import { useEffect, useContext } from 'react';
import { ProductsContext } from '../../contexts/products.context';
import { AuthenticationContext, UserRole } from '../../contexts/authentication.context';
import Deposit from '../../components/deposit/deposit.component';
import ProductInput from '../../components/product-input/product-input.component';
import { HomeContainer, Title } from './home.styles';

const Home = () => {
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
            const result = JSON.parse(bodyText);
            if (response.ok) {
                await setCurrentProducts(result);
            } else {
                const errorMessage = `Failed to load products: ${result.message}`;
                alert(errorMessage);
                console.log(errorMessage);
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
                        <Deposit />    
                        </div>
                    )}
                {(currentAuthentication.user.role === UserRole.Seller &&
                    <div>
                        <ProductInput />
                    </div>
                )}
                </>
            )}
        </HomeContainer>
    );
};

export default Home;
