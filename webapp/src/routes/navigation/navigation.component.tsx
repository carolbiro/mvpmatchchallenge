import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet , useNavigate } from 'react-router-dom';
import { setCurrentUser } from '../../store/user/user.reducer';

import {
    NavigationContainer,
    NavLinks,
    NavLink,
    NavDiv,
    LeftNavLinks
} from './navigation.styles';

const Navigation = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state:any) => state.user.currentUser)
    const navigate = useNavigate();
    const signOutUser = () => {
        dispatch(setCurrentUser(null));
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
