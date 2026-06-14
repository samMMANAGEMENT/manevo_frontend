import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Checkbox } from '../../../shared/components/ui/Checkbox';
import authService from '../services/authService';

import { useAuth } from '../../../shared/providers/AuthProvider';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login: authLogin, user, token } = useAuth();

    React.useEffect(() => {
        if (user && token) {
            navigate('/app/dashboard');
        }
    }, [user, token, navigate]);

    const [showPassword, setShowPassword] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNavigate = (path: string) => {
        setIsLeaving(true);
        setTimeout(() => {
            navigate(path);
        }, 300);
    };

    const login = async () => {
        try {
            setLoading(true);
            const response = await authService.login({ email, password });
            authLogin(response.user, response.token);
            navigate('/app/dashboard');
        } catch (error: any) {
            console.error('Error al iniciar sesión:', error);
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`flex min-h-screen w-full font-manrope ${isLeaving ? 'animate-fade-out' : 'animate-fade-in'}`}>
            {/* Left side: Abstract design */}
            <div className="hidden lg:flex lg:w-1/2 abstract-gradient relative flex-col justify-between p-12">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="size-8 text-manevo-teal">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <h2 className="text-white text-2xl font-bold tracking-tight">manevo</h2>
                </div>

                <div className="relative z-10 max-w-md">
                    <h1 className="text-white text-5xl font-extrabold leading-tight mb-6">Domina la Operatividad de tu Negocio.</h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Accede a manevo para gestionar integralmente tus servicios, inventario y personal. Control absoluto para peluquerías, salones y talleres con visión de crecimiento.
                    </p>
                </div>

                <div className="relative z-10 flex gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0c1110] bg-gray-800 flex items-center justify-center overflow-hidden">
                                <img
                                    alt="User"
                                    src="/src/assets/images/avatar-1.png"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm flex items-center">Impulsando el crecimiento de negocios locales y multi-sucursal</p>
                </div>
            </div>

            {/* Right side: Login form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-bg-dark lg:bg-white transition-all duration-500 overflow-y-auto no-scrollbar">
                {/* Mobile Logo Header */}
                <div className="lg:hidden flex items-center justify-between px-8 py-10">
                    <div className="flex items-center gap-2">
                        <div className="size-6 text-manevo-teal">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <h2 className="text-white text-xl font-bold tracking-tight">manevo</h2>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center px-6 md:px-20 lg:px-24 bg-white rounded-t-[40px] lg:rounded-none py-12 lg:py-0 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] lg:shadow-none">

                    <div className="w-full max-w-[420px]">
                        <div className="mb-8 animate-on-load stagger-1">
                            <h2 className="text-3xl font-extrabold text-manevo-slate tracking-tight">Bienvenido de nuevo</h2>
                            <p className="text-gray-500 mt-2">Ingresa tus credenciales para acceder a tu cuenta</p>
                        </div>

                        <div className="flex p-1 bg-gray-100 rounded-xl mb-8 gap-5 animate-on-load stagger-2">
                            <button className="flex-1 py-2 text-sm font-bold rounded-lg bg-white shadow-sm text-manevo-slate transition-all transition-duration-300">Iniciar Sesión</button>
                            <button
                                onClick={() => handleNavigate('/auth/register')}
                                className="flex-1 py-2 text-sm font-semibold text-gray-500 hover:text-manevo-slate transition-all transition-duration-300"
                            >
                                Registrarse
                            </button>
                        </div>

                        <form className="space-y-5 animate-on-load stagger-3" onSubmit={(e) => e.preventDefault()}>
                            <Input
                                id="email"
                                label="Correo Electrónico"
                                placeholder="nombre@empresa.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-manevo-slate" htmlFor="password">Contraseña</label>
                                    <a className="text-sm font-semibold text-manevo-teal hover:underline" href="#">¿Olvidaste tu contraseña?</a>
                                </div>
                                <Input
                                    id="password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    icon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="p-0 bg-transparent border-none flex items-center justify-center text-gray-400 hover:text-manevo-slate transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {showPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                    }
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <Checkbox id="remember" label="Mantener sesión iniciada" />

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            <Button fullWidth type="submit" className="py-3.5 text-base" onClick={login} disabled={loading}>
                                {loading ? 'Iniciando sesión...' : 'Continuar'}
                            </Button>
                        </form>

                        <div className="relative my-8 animate-on-load stagger-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-400 uppercase tracking-widest text-[10px] font-bold">O continuar con</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 animate-on-load stagger-5">
                            <Button variant="outline" className="py-2.5">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                <span className="text-sm font-bold">Google</span>
                            </Button>
                        </div>

                        <div className="mt-12 text-center text-xs text-gray-400">
                            Al continuar estableces que estás de acuerdo con los <a className="underline hover:text-gray-600" href="#">Términos de Servicio</a> y la <a className="underline hover:text-gray-600" href="#">Política de Privacidad</a> de manevo.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
