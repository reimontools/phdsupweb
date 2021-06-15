import {Redirect, Route} from "react-router-dom";
import useAppContext from '../hooks/useAppContext';

import PersonList from '../components/views/person/PersonList';
import SupervisorList from '../components/views/supervisor/SupervisorList';
import SignIn from '../components/views/sign-in/SignIn';
import SignUp from '../components/views/sign-up/SingUp';

import Home from '../components/views/Home';
import Dashboard from '../components/views/Dashboard';
import NotFound from '../components/views/NotFound';

import PersonSupervisorUniversityListNa from '../components/views/user-views/PersonSupervisorUniversityListNa';
import PersonUniversityListNa from '../components/views/user-views/PersonUniversityListNa';

export const ROUTES = [
    {
        title: 'My supervisors',
        path: '/person-supervisor',
        component: PersonSupervisorUniversityListNa, 
        allowTo: ['User'],
        showInBar: true,
        auth: 'auth'
    },
    {
        title: 'My university',
        path: '/person-university',
        component: PersonUniversityListNa, 
        allowTo: ['User'],
        showInBar: true,
        auth: 'auth'
    },
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
        component: SupervisorList, 
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
        component: PersonList, 
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
