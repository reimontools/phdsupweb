import {Redirect, Route} from "react-router-dom";
import useAppContext from '../hooks/useAppContext';

import Person from '../components/views/person/Person';
import Supervisor from '../components/views/supervisor/Supervisor';
import SignIn from '../components/views/sign-in/SignIn';
import SignUp from '../components/views/sign-up/SingUp';

import Home from '../components/views/others/Home';
import Dashboard from '../components/views/others/Dashboard';
import NotFound from '../components/views/others/NotFound';

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
        title: 'Supervisors',
        path: '/supervisor',
        component: Supervisor, 
        allowTo: ['Admin'],
        showInBar: true,
        auth: 'auth'
    },
    {
        title: 'Dashboard',
        path: '/dashboard',
        component: Dashboard, 
        allowTo: ['User'],
        showInBar: true,
        auth: 'auth'
    },
    {
        title: 'Person',
        path: '/person',
        component: Person, 
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
