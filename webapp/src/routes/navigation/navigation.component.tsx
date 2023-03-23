import { Fragment, useContext } from 'react';
import { Outlet , useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/user.context';

import {
    NavigationContainer,
    NavLinks,
    NavLink,
    NavDiv,
    LeftNavLinks
} from './navigation.styles';

const Navigation = () => {
    const { currentUser: currentUser, setCurrentUser: setCurrentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const signOutUser = () => {
        setCurrentUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate("/");
    }
    return (
        <Fragment>
            <NavigationContainer>
                <LeftNavLinks>
                    <NavLink to='/'>HOME</NavLink>
                    <NavLink to='/products'>PRODUCTS</NavLink> 
                </LeftNavLinks>
                <NavLinks>
                    <NavDiv>{currentUser ? `BALANCE: ${currentUser.deposit} cents` : ''}</NavDiv> 
                    {currentUser ? (
                        <NavLink as='span' onClick={signOutUser}>
                            SIGN OUT
                        </NavLink>
                    ) : (
                        <NavLink to='/auth'>SIGN IN</NavLink>
                    )}
                </NavLinks>
            </NavigationContainer>
            <Outlet />
        </Fragment>
    );
};

export default Navigation;
