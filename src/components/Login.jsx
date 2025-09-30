import React, { useState } from 'react';
import { useAuth } from './utils/auth.jsx';

export const Login = () => {
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

    }
    
    return(
        <form onSubmit={handleSubmit}>

        <input
        type='text'
        value={email}
       
        placeholder='Usuário'
        />
    
        </form>
    )
}