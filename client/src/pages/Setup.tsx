
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Server, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function Setup() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Status Check
    useEffect(() => {
        fetch('http://localhost:3005/api/setup/status')
            .then(res => res.json())
            .then(data => {
                if (!data.isSetupRequired) {
                    navigate('/login');
                }
            })
            .catch(console.error);
    }, [navigate]);

    // Form Data
    const [formData, setFormData] = useState({
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        smtpHost: 'smtp.gmail.com', // Default
        smtpPort: '587',
        smtpUser: '',
        smtpPass: '',
        googleClientId: '',
        googleClientSecret: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:3005/api/setup/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Success!
            alert('Sistema inicializado correctamente. Por favor inicia sesión.');
            navigate('/login');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-[#16191f] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="bg-blue-600/10 p-8 border-b border-gray-800 text-center">
                    <div className="inline-flex p-4 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                        <Server className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Inicialización del Sistema</h1>
                    <p className="text-blue-200">Configuración inicial de Gestión de Siniestros AI</p>
                </div>

                {/* Steps Config */}
                <div className="p-8">
                    {/* Progress Bar */}
                    <div className="flex items-center justify-center mb-8 gap-4">
                        <div className={`h-2 rounded-full flex-1 transition-all ${step >= 1 ? 'bg-blue-500' : 'bg-gray-800'}`} />
                        <div className={`h-2 rounded-full flex-1 transition-all ${step >= 2 ? 'bg-blue-500' : 'bg-gray-800'}`} />
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-blue-400" />
                                        Crear Administrador
                                    </h2>
                                    <p className="text-gray-400 text-sm">Este usuario tendrá control total sobre la plataforma.</p>
                                </div>

                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Nombre Completo</label>
                                        <input name="adminName" required value={formData.adminName} onChange={handleChange}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Email Corporativo</label>
                                        <input name="adminEmail" type="email" required value={formData.adminEmail} onChange={handleChange}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Contraseña</label>
                                        <input name="adminPassword" type="password" required value={formData.adminPassword} onChange={handleChange}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>

                                <button type="button" onClick={() => setStep(2)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-colors">
                                    Siguiente: Configurar Correo
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-purple-400" />
                                        Configuración de Salida (SMTP / OAuth)
                                    </h2>
                                    <p className="text-gray-400 text-sm">Necesario para enviar notificaciones a los clientes.</p>
                                </div>

                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">SMTP Host</label>
                                            <input name="smtpHost" value={formData.smtpHost} onChange={handleChange}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Puerto</label>
                                            <input name="smtpPort" value={formData.smtpPort} onChange={handleChange}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Usuario SMTP</label>
                                            <input name="smtpUser" placeholder="ej: notificaciones@empresa.com" value={formData.smtpUser} onChange={handleChange}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Contraseña SMTP</label>
                                            <input name="smtpPass" type="password" value={formData.smtpPass} onChange={handleChange}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-800 my-2 pt-4">
                                        <h3 className="text-sm font-semibold text-gray-400 mb-4">Opcional: Google OAuth (Para lectura de buzones)</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Client ID</label>
                                                <input name="googleClientId" value={formData.googleClientId} onChange={handleChange}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Client Secret</label>
                                                <input name="googleClientSecret" type="password" value={formData.googleClientSecret} onChange={handleChange}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setStep(1)}
                                        className="px-6 py-3 rounded-lg font-bold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
                                        Atrás
                                    </button>
                                    <button type="submit" disabled={loading}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                                        {loading ? 'Inicializando...' : 'Finalizar Configuración'}
                                        {!loading && <CheckCircle className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
