import { Fragment, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { TokenContext } from '../../contexts/token.context';

import {
    NavigationContainer,
    NavLinks,
    NavLink,
    LogoContainer,
} from './navigation.styles';



const Navigation = () => {
    const { currentToken: currentToken, setCurrentToken: setCurrentToken } = useContext(TokenContext);
    const signOutUser = () => {
        setCurrentToken(null);
    }
    return (
        <Fragment>
            <NavigationContainer>
                <LogoContainer to='/'> HOME </LogoContainer>
                <NavLinks>
                    <NavLink to='/products'>PRODUCTS</NavLink>
                    {currentToken ? (
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
