import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import authService from '../services/authService';
import { useAuth } from '../../../shared/providers/AuthProvider';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const handleNavigate = (path: string) => {
        setIsLeaving(true);
        setTimeout(() => {
            navigate(path);
        }, 300);
    };

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        docType: 'CC',
        docNumber: '',
        mobileNumber: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authService.register({
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                document_type: formData.docType,
                document_number: formData.docNumber,
                phone: formData.mobileNumber,
            });

            if (response.token && response.user) {
                login(response.user, response.token);
                handleNavigate('/app/dashboard');
            }
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-white text-5xl font-extrabold leading-tight mb-6">
                        {step === 1 ? 'Tu viaje hacia el Control Total comienza aquí.' : 'Casi listo. Completa tu perfil profesional.'}
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        {step === 1
                            ? 'Experimenta la próxima generación de automatización de flujos de trabajo. Simple de configurar, potente para usar y diseñado para tu crecimiento.'
                            : 'Proporciona tus datos de identidad para verificar tu cuenta y comenzar a gestionar tus operaciones comerciales con precisión inteligente.'
                        }
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
                    <p className="text-gray-400 text-sm flex items-center">Confiado por más de 5,000 equipos en todo el mundo</p>
                </div>
            </div>

            {/* Right side: Form Details */}
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
                        {/* Progress indicator */}
                        <div className="mb-10 animate-on-load stagger-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-manevo-teal uppercase tracking-widest">Paso {step} de 2</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    {step === 1 ? 'Detalles de Cuenta' : 'Detalles de Identidad'}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-manevo-teal transition-all duration-500 rounded-full ${step === 1 ? 'w-1/2' : 'w-full'}`}
                                ></div>
                            </div>
                        </div>

                        {step === 1 ? (
                            <>
                                <div className="mb-8 animate-on-load stagger-2">
                                    <h2 className="text-3xl font-extrabold text-manevo-slate tracking-tight">Crea tu cuenta</h2>
                                    <p className="text-gray-500 mt-2">Empecemos con tu información básica.</p>
                                </div>
                                <form className="space-y-5 animate-on-load stagger-3" onSubmit={handleNext}>
                                    <Input
                                        id="fullName"
                                        label="Nombre Completo"
                                        placeholder="Victor Castro"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        id="email"
                                        label="Correo Electrónico"
                                        placeholder="nombre@empresa.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-manevo-slate" htmlFor="password">Contraseña</label>
                                        <Input
                                            id="password"
                                            placeholder="••••••••"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
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
                                        />
                                        <p className="mt-2 text-[11px] text-gray-400">Mínimo 8 caracteres con al menos un número.</p>
                                    </div>
                                    <div className="pt-4">
                                        <Button fullWidth type="submit" className="py-3.5">
                                            Siguiente Paso
                                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                        </Button>
                                    </div>
                                </form>
                                <div className="mt-12 text-center">
                                    <p className="text-sm text-gray-500">
                                        ¿Ya tienes una cuenta? <button onClick={() => handleNavigate('/auth/login')} className="text-manevo-teal font-bold hover:underline bg-transparent border-none p-0 cursor-pointer">Inicia Sesión</button>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-8 animate-on-load stagger-2">
                                    <h2 className="text-3xl font-extrabold text-manevo-slate tracking-tight">Detalles de Identidad</h2>
                                    <p className="text-gray-500 mt-2">Por favor verifica tu información de identificación legal.</p>
                                </div>
                                <form className="space-y-6 animate-on-load stagger-3" onSubmit={handleSubmit}>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-manevo-slate" htmlFor="docType">Tipo de Documento</label>
                                        <Select
                                            value={formData.docType}
                                            onChange={(val) => setFormData(prev => ({ ...prev, docType: String(val) }))}
                                            options={[
                                                { value: 'CC', label: 'Cedula de Ciudadanía (CC)' },
                                                { value: 'CE', label: 'Cédula de Extranjería (CE)' },
                                                { value: 'PP', label: 'Pasaporte (PP)' },
                                                { value: 'NIT', label: 'NIT' }
                                            ]}
                                            className="space-y-0 text-sm font-medium"
                                        />
                                    </div>
                                    <Input
                                        id="docNumber"
                                        label="Número de Documento"
                                        placeholder="1011390710"
                                        value={formData.docNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-manevo-slate" htmlFor="mobileNumber">Número de Celular</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">+57</span>
                                            <input
                                                id="mobileNumber"
                                                className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 text-black focus:ring-manevo-teal focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                                placeholder="3236374624"
                                                type="tel"
                                                value={formData.mobileNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4 space-y-3">
                                        <Button fullWidth type="submit" disabled={loading} className="py-3.5">
                                            {loading ? 'Procesando...' : 'Completar Registro'}
                                            {!loading && <span className="material-symbols-outlined text-[20px]">check_circle</span>}
                                        </Button>
                                        <Button fullWidth variant="ghost" type="button" onClick={handleBack} className="text-sm">
                                            Volver al paso 1
                                        </Button>
                                    </div>
                                </form>
                                <div className="mt-12 text-center">
                                    <p className="text-xs text-gray-400">
                                        ¿Necesitas ayuda? <a className="underline hover:text-gray-600 font-medium" href="#">Contacta a soporte</a>
                                    </p>
                                    <p className="text-[10px] text-gray-300 mt-4 uppercase tracking-widest font-bold">
                                        Encriptación Segura SSL 256-bit
                                    </p>
                                </div>
                            </>
                        )}

                        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
                                Al continuar, aceptas nuestros <br />
                                <a className="underline hover:text-gray-600 font-medium" href="#">Términos de Servicio</a> & <a className="underline hover:text-gray-600 font-medium" href="#">Política de Privacidad</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
