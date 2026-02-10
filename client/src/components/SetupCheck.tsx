import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SetupCheck({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Don't check if we're already on setup page
        if (location.pathname === '/setup') {
            setChecking(false);
            return;
        }

        fetch('http://localhost:3005/api/setup/status')
            .then(res => res.json())
            .then(data => {
                if (data.isSetupRequired) {
                    navigate('/setup');
                } else {
                    setChecking(false);
                }
            })
            .catch(err => {
                console.error('Setup check failed:', err);
                setChecking(false);
            });
    }, [navigate, location.pathname]);

    if (checking) {
        return (
            <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Verificando configuración...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
