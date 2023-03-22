import { useEffect, useContext } from 'react';
import { ApiError } from '../../App';
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
