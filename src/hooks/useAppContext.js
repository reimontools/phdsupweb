import { useContext } from 'react';
import { AppContext } from '../store/AppProvider'; 

export default function useAppContext() {
    return useContext(AppContext);
}