import { Fragment, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthenticationContext } from '../../contexts/authentication.context';

import {
    NavigationContainer,
    NavLinks,
    NavLink,
    LogoContainer,
} from './navigation.styles';



const Navigation = () => {
    const { currentAuthentication: currentAuthentication, setCurrentAuthentication: setCurrentAuthentication } = useContext(AuthenticationContext);
    const signOutUser = () => {
        setCurrentAuthentication(null);
    }
    return (
        <Fragment>
            <NavigationContainer>
                <LogoContainer to='/'> HOME </LogoContainer>
                <NavLinks>
                    <NavLink to='/products'>PRODUCTS</NavLink>
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
