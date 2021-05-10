import {Redirect, Route} from "react-router-dom";
import useAppContext from '../hooks/useAppContext';

import Home from '../components/views/Home';
import Dashboard from '../components/views/Dashboard';
import SignIn from '../components/views/SignIn';
import SignUp from '../components/views/SingUp';
import User from '../components/views/User';
import NotFound from '../components/views/NotFound';

export const ROUTES = [
    {
        title: 'Home',
        path: '/',
        component: Home, 
        allowTo: ['*'],
        showInBar: true,
        auth: 'all'
    },
    {
        title: 'Dashboard',
        path: '/Dashboard',
        component: Dashboard, 
        allowTo: ['User'],
        showInBar: true,
        auth: 'auth'
    },
    {
        title: 'Users',
        path: '/user',
        component: User, 
        allowTo: ['Admin'],
        showInBar: true,
        auth: 'auth'
    },
    {
        title: 'Sign In',
        path: '/sign-in',
        component: SignIn, 
        allowTo: ['*'],
        showInBar: true,
        auth: 'nonAuth'
    },
    {
        title: 'Sign Up',
        path: '/sign-up',
        component: SignUp, 
        allowTo: ['*'],
        showInBar: true,
        auth: 'nonAuth'
    },
    {
        title: 'Not Found',
        path: '*',
        component: NotFound, 
        allowTo: ['*'],
        showInBar: false,
        auth: 'all'
    }
];

export const ProtectedRoute = ({component: Component, allowTo = ['*'], auth, ...options}) => {
    const { user, isLogged } = useAppContext();
    if (auth === "all") {
        return (
            <Route {...options}>
                <Component />
            </Route>
        );
    };
    if (auth === "nonAuth") {
        return (
            <Route {...options}>
                {!isLogged() ? (<Component />) : (<Redirect to="/" />)}
            </Route>
        );
    };
    if (auth === "auth") {
        return (
            <Route {...options}>
                {(() => {
                    if (!isLogged()) return <Redirect to="/sign-in" />
                    if (!allowTo.includes(user.rol) && !allowTo.includes('*')) return <Redirect to="/" />
                    return <Component />
                })}
            </Route>
        );
    };
};
