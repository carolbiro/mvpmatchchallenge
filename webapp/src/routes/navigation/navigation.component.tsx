import { Fragment, useContext } from 'react';
import { Outlet , useNavigate } from 'react-router-dom';
import { AuthenticationContext } from '../../contexts/authentication.context';

import {
    NavigationContainer,
    NavLinks,
    NavLink,
    NavDiv,
    LeftNavLinks
} from './navigation.styles';

const Navigation = () => {
    const { currentAuthentication: currentAuthentication, setCurrentAuthentication: setCurrentAuthentication } = useContext(AuthenticationContext);
    const navigate = useNavigate();
    const signOutUser = () => {
        setCurrentAuthentication(null);
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
                    <NavDiv>{currentAuthentication ? `BALANCE: ${currentAuthentication.user.deposit} cents` : ''}</NavDiv> 
                    {currentAuthentication ? (
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
