export default function WelcomeComponent() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = user.operator?.name || 'Usuario';

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden bg-manevo-slate rounded-4xl p-10 text-white shadow-2xl shadow-manevo-slate/20">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-manevo-teal/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-manevo-mint/5 blur-2xl rounded-full -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 max-w-2xl">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-manevo-teal/10 text-manevo-teal rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-manevo-teal/20">
                        <span className="animate-pulse size-1.5 bg-manevo-teal rounded-full"></span>
                        Panel de Control
                    </span>
                    <h1 className="text-5xl font-black mb-4 tracking-tightest leading-tight">
                        Hola, <span className="text-manevo-teal">{name}</span>. <br />
                        Bienvenido a manevo.
                    </h1>
                    <p className="text-gray-400 text-lg font-medium leading-relaxed mb-8">
                        Tu ecosistema inteligente para automatizar flujos SaaS complejos con precisión quirúrgica. Todo lo que necesitas está listo para ti.
                    </p>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-manevo-teal text-manevo-slate font-bold rounded-xl hover:scale-105 transition-transform">
                            Comenzar ahora
                        </button>
                        <button className="px-6 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                            Ver Tutorial
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Procesos Activos', value: '12', icon: 'sync', color: 'text-blue-500' },
                    { label: 'Eficiencia Operada', value: '98%', icon: 'bolt', color: 'text-yellow-500' },
                    { label: 'Alertas Pendientes', value: '0', icon: 'notifications_none', color: 'text-manevo-teal' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-4">
                            <span className={`material-symbols-outlined ${stat.color} bg-gray-50 p-2 rounded-xl`}>{stat.icon}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global</span>
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-manevo-slate">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
