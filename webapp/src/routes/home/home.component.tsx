import { useContext } from 'react';
import { UserContext, UserRole } from '../../contexts/user.context';
import Deposit from '../../components/deposit/deposit.component';
import ProductInput from '../../components/product-input/product-input.component';
import { HomeContainer, Title } from './home.styles';

const Home = () => {
    const { currentUser: currentUser } = useContext(UserContext);

    return (
        <HomeContainer>
            <h2>
                <Title to={''}>Home</Title>
            </h2>
            {(currentUser &&
                <>
                    <div>
                    Logged in as: <b>{currentUser.username}</b>.
                    </div>
                    <div>
                    Role: <b>{currentUser.role}</b>
                    </div>
                {(currentUser.role === UserRole.Buyer &&
                        <div>
                            <Deposit />    
                        </div>
                    )}
                {(currentUser.role === UserRole.Seller &&
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
