import { useSelector } from 'react-redux';
import { UserRole } from '../../store/user/user.types';
import Deposit from '../../components/deposit/deposit.component';
import ProductInput from '../../components/product-input/product-input.component';
import { HomeContainer, Title } from './home.styles';

const Home = () => {
    const currentUser = useSelector((state:any) => state.user.currentUser)

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
