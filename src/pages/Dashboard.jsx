import React from 'react';
import { useAuth } from '/utils/auth';

export default function Dashboard () {
    const { role } = useAuth();

    return (
        <div className="dashboard">
            <h1>Bem vindo {role} </h1>
        </div>
    )
}