import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './shared/components/ui/Button'

function App() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const businessValues = [
    {
      title: "Facturación Electrónica",
      description: "Emisión de documentos legales integrada. Control de resoluciones y cumplimiento fiscal (DIAN) sin complicaciones.",
      icon: "receipt_long"
    },
    {
      title: "Control Financiero",
      description: "Seguimiento preciso de ingresos, gastos y rentabilidad. Cálculo automático de comisiones y pagos a empleados.",
      icon: "account_balance_wallet"
    },
    {
      title: "Gestión de Inventario",
      description: "Control de stock con alertas automáticas. Gestión de costos, precios y movimientos detallados por sucursal.",
      icon: "inventory_2"
    },
    {
      title: "Agendamiento & Citas",
      description: "Optimización de agendas con gestión de citas, listas de espera y reservas automáticas para mejorar el flujo.",
      icon: "event_available"
    },
    {
      title: "Administración de Personal",
      description: "Sistema de roles granular. Seguimiento de rendimiento individual y control de horarios de tu equipo.",
      icon: "group_add"
    },
    {
      title: "Multi-Sucursal",
      description: "Gestión centralizada de múltiples unidades con datos separados y reportes consolidados en tiempo real.",
      icon: "hub"
    }
  ];

  const benefits = [
    {
      label: "Optimización Operativa",
      title: "Convierte el caos en proceso",
      desc: "Desde listas de espera inteligentes hasta flujos de trabajo automatizados que reducen el error humano en un 80%.",
      icon: "auto_mode"
    },
    {
      label: "Análisis y Decisión",
      title: "Datos que impulsan crecimiento",
      desc: "Métricas de ventas, tendencias y proyecciones automáticas para que cada decisión esté respaldada por la realidad de tu negocio.",
      icon: "insights"
    }
  ];

  const implementationSteps = [
    {
      step: "01",
      title: "Configuración Ágil",
      desc: "Adaptamos manevo a la estructura de tus sucursales y roles de equipo en tiempo récord."
    },
    {
      step: "02",
      title: "Migración de Datos",
      desc: "Cargamos tus productos, servicios y clientes para que no pierdas ni un segundo de operación."
    },
    {
      step: "03",
      title: "Evolución Continua",
      desc: "Capacitamos a tu personal y te acompañamos en el crecimiento con soporte premium."
    }
  ];

  return (
    <div className="min-h-screen bg-manevo-bg-dark font-manrope selection:bg-manevo-teal/30 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 md:px-20 py-4 md:py-6 fixed top-0 w-full z-50 backdrop-blur-md bg-manevo-bg-dark/50 border-b border-white/5">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="size-8 md:size-9 rounded-xl bg-manevo-teal/10 text-manevo-teal flex items-center justify-center border border-manevo-teal/20 shadow-[0_0_15px_rgba(19,236,218,0.1)]">
            <svg
              className=" w-7 h-5"
              viewBox="0 0 31 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0"
                y="0"
                width="18"
                height="18"
                rx="9"
                fill="currentColor"></rect>
              <rect
                x="22"
                y="0"
                width="9"
                height="18"
                rx="4.5"
                fill="currentColor"></rect>
            </svg>
          </div>
          <span className="text-xl md:text-2xl font-black text-white tracking-tightest">manevo</span>
        </div>
        <div className="flex items-center gap-3 md:gap-10">
          <Link to="/auth/login" className="text-xs md:text-sm font-bold text-gray-300 hover:text-white transition-colors">Login</Link>
          <Button onClick={() => navigate('/auth/register')} className="px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] font-black tracking-widest uppercase shrink-0">
            EMPEZAR
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-manevo-teal/10 blur-[130px] rounded-full -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-manevo-mint/5 blur-[120px] rounded-full -z-10"></div>

        <div className="max-w-6xl mx-auto text-center space-y-10 relative z-10">

          <h1 className={`text-5xl md:text-[90px] font-black text-white tracking-tightest leading-[0.9] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Simplificamos tu negocio, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-manevo-teal to-white py-2">Escalamos tu éxito.</span>
          </h1>

          <p className={`text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            manevo es la plataforma integral diseñada para peluquerías, salones de belleza y talleres que buscan control absoluto, eficiencia operativa y crecimiento multi-sucursal.
          </p>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-5 pt-4 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Button onClick={() => navigate('/auth/register')} className="px-10 py-6 text-lg font-black shadow-[0_0_30px_rgba(19,236,218,0.2)]">
              REGISTRATE
            </Button>
            <Button variant="outline" className="px-12 py-6 text-lg font-black border-white/10 text-white hover:bg-white/5">
              CONOCER MÁS
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-32 px-6 bg-[#090e0d] border-y border-white/5 relative">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tightest text-white">Domina tu Operación</h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto text-lg text-pretty">Desde lo legal hasta lo operativo, manevo cubre cada necesidad de tu empresa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessValues.map((val, idx) => (
              <div key={idx} className="bg-white/2 border border-white/5 p-10 rounded-[40px] hover:bg-white/5 hover:border-manevo-teal/20 transition-all group relative overflow-hidden">
                <div className="size-16 rounded-2xl bg-manevo-teal/10 text-manevo-teal flex items-center justify-center mb-10 border border-manevo-teal/10 group-hover:scale-110 transition-all">
                  <span className="material-symbols-outlined text-4xl!">{val.icon}</span>
                </div>
                <h3 className="text-2xl font-black mb-4 text-white">{val.title}</h3>
                <p className="text-gray-500 text-base font-medium leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* manevo money Section */}
      <section className="py-32 px-6 bg-linear-to-b from-[#090e0d] to-[#0d1312] relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-1/2 left-[-10%] w-[400px] h-[400px] bg-manevo-mint/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] bg-manevo-teal/5 blur-[130px] rounded-full -z-10"></div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Card / Visual Preview */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="absolute inset-0 bg-manevo-teal/10 blur-[100px] rounded-full"></div>
            
            {/* Glassmorphic Mobile Preview Card */}
            <div className="w-full max-w-[420px] bg-white/2 border border-white/10 rounded-[40px] p-8 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6 group">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-manevo-mint/10 text-manevo-mint flex items-center justify-center border border-manevo-mint/20">
                    <span className="material-symbols-outlined text-xl!">savings</span>
                  </div>
                  <span className="text-sm font-bold text-gray-400">Finanzas Personales</span>
                </div>
                <span className="text-xs font-black text-manevo-teal uppercase bg-manevo-teal/10 px-3 py-1 rounded-full border border-manevo-teal/15 animate-pulse">BETA ABIERTA</span>
              </div>

              {/* Balance Widget */}
              <div className="space-y-1">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Mi Balance Total</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-black text-white">$4,850,000</span>
                  <span className="text-xs font-bold text-manevo-mint">COP</span>
                </div>
              </div>

              {/* Micro Savings Progress */}
              <div className="space-y-2 bg-white/2 border border-white/5 rounded-2xl p-4">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-gray-400">Meta: Viaje de Vacaciones</span>
                  <span className="font-black text-manevo-teal">75% ($3,000,000)</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-linear-to-r from-manevo-teal to-manevo-mint rounded-full"></div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-3">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Últimos Egresos</p>
                
                <div className="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg!">restaurant</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">Alimentación</p>
                      <p className="text-[10px] text-gray-500 font-bold">Hoy, 12:30 PM</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-red-400">-$35,000</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-manevo-teal/10 text-manevo-teal flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg!">directions_car</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">Transporte Urbano</p>
                      <p className="text-[10px] text-gray-500 font-bold">Ayer, 6:15 PM</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-manevo-teal">-$12,500</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copywriting & Logo info */}
          <div className="space-y-8 relative z-10 order-1 lg:order-2">
            <div className="inline-block px-4 py-1.5 bg-manevo-mint/10 text-manevo-mint rounded-full text-[10px] font-black uppercase tracking-widest border border-manevo-mint/20">
              NUEVO PRODUCTO
            </div>

            {/* Custom Brand Logo variant for Manevo Money */}
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-manevo-teal/10 text-manevo-teal flex items-center justify-center border border-manevo-teal/20 shadow-[0_0_20px_rgba(19,236,218,0.15)] relative overflow-hidden group">
                <svg
                  className="w-8 h-6"
                  viewBox="0 0 31 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0"
                    y="0"
                    width="18"
                    height="18"
                    rx="9"
                    fill="#13ECDA"></rect>
                  <rect
                    x="22"
                    y="0"
                    width="9"
                    height="18"
                    rx="4.5"
                    fill="#A7F3D0"></rect>
                </svg>
                {/* Glow ring overlay representing money flow */}
                <div className="absolute inset-0 border border-manevo-mint/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tightest leading-none">manevo</span>
                <span className="text-xs font-black text-manevo-mint tracking-[0.25em] uppercase leading-none mt-1">money</span>
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tightest leading-none">
              Tus finanzas personales, <br />
              <span className="text-manevo-mint">con estética infinita.</span>
            </h2>

            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
              Llevamos la aclamada experiencia de usuario, fluidez y diseño glassmórfico de Manevo al plano personal. Registra tus egresos diarios, planifica tus metas de ahorro y monitorea tu salud financiera sin hojas de cálculo aburridas.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button 
                onClick={() => alert("¡Te has registrado en la lista de espera de manevo money! Te avisaremos muy pronto.")}
                className="px-8 py-5 text-sm font-black shadow-[0_0_25px_rgba(167,243,208,0.15)] bg-manevo-mint text-manevo-bg-dark hover:shadow-[0_0_35px_rgba(167,243,208,0.3)] shrink-0"
              >
                UNIRSE A LA LISTA DE ESPERA
              </Button>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">REGISTRO GRATUITO</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Ecosystem Section */}
      <section className="py-32 px-6 bg-[#0d1312] overflow-hidden relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-block px-4 py-1.5 bg-manevo-teal/10 text-manevo-teal rounded-full text-[10px] font-black uppercase tracking-widest border border-manevo-teal/20">
              Movilidad Total
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tightest leading-none">Tu negocio <br /><span className="text-manevo-teal">en tu bolsillo.</span></h2>
            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
              Próximamente: Lleva el control de tus sucursales vayas donde vayas. Nuestra aplicación nativa te permitirá gestionar ventas, inventario y personal desde cualquier lugar.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 opacity-80">
              {/* App Store Badge */}
              <div className="h-[46px] cursor-not-allowed select-none transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_25px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden border border-white/5">
                <img 
                  src="/src/assets/images/app-store-svgrepo-com.svg" 
                  className="h-full w-auto" 
                  alt="Disponible en App Store"
                />
              </div>

              {/* Play Store Badge */}
              <div className="h-[46px] cursor-not-allowed select-none transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_25px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden border border-white/5">
                <img 
                  src="/src/assets/images/google-play-badge-logo-svgrepo-com.svg" 
                  className="h-full w-auto" 
                  alt="Disponible en Google Play"
                />
              </div>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-manevo-teal/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
            <div className="w-full max-w-[400px] h-[500px] bg-linear-to-br from-white/10 to-transparent border border-white/10 rounded-[60px] relative overflow-hidden flex items-center justify-center p-8 backdrop-blur-3xl group">
              <div className="absolute -inset-2 bg-linear-to-br from-manevo-teal/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <span className="material-symbols-outlined text-[200px]! text-white/5 group-hover:text-manevo-teal/10 transition-all duration-700">smartphone</span>
              <div className="absolute bottom-12 left-12 right-12 space-y-4">
                <div className="h-2 w-20 bg-manevo-teal rounded-full"></div>
                <div className="h-4 w-full bg-white/10 rounded-full"></div>
                <div className="h-4 w-2/3 bg-white/5 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Benefits */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-manevo-teal/10 blur-[100px] rounded-full"></div>
            <div className="bg-[#0b1110] border border-white/5 rounded-[50px] p-10 relative z-10">
              <div className="space-y-8">
                {benefits.map((b, i) => (
                  <div key={i} className="flex gap-6 items-start p-6 rounded-3xl hover:bg-white/2 transition-colors border border-transparent hover:border-white/5 group">
                    <div className="size-14 rounded-2xl bg-manevo-teal/5 text-manevo-teal flex items-center justify-center border border-manevo-teal/10 group-hover:bg-manevo-teal group-hover:text-manevo-slate transition-all duration-300 shrink-0">
                      <span className="material-symbols-outlined text-3xl!">{b.icon}</span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-black text-manevo-teal uppercase tracking-widest">{b.label}</span>
                      <h4 className="text-2xl font-black">{b.title}</h4>
                      <p className="text-gray-500 font-medium leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-12 order-1 lg:order-2 px-4">
            <h2 className="text-5xl md:text-7xl font-black tracking-tightest leading-[1.1]">Tu empresa, <br /><span className="text-manevo-teal">evolucionada.</span></h2>
            <div className="space-y-6">
              <p className="text-xl text-gray-400 font-medium leading-relaxed">
                manevo soluciona los problemas críticos de la gestión diaria: fugas de stock, errores en comisiones y falta de visibilidad financiera.
              </p>
              <ul className="space-y-4">
                {[
                  "Cumplimiento fiscal y facturación simplificada.",
                  "Histórico completo de cada transacción.",
                  "Optimización de agendas y citas."
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 text-white font-bold text-lg">
                    <div className="size-6 rounded-full bg-manevo-teal flex items-center justify-center text-manevo-slate">
                      <span className="material-symbols-outlined text-xs! font-black">check</span>
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Easy Implementation */}
      <section className="py-32 px-6 bg-[#0d1312] border-y border-white/5">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tightest">Fácil de implementar</h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto text-lg">No necesitas ser un experto técnico. Nosotros nos encargamos de todo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {implementationSteps.map((s, i) => (
              <div key={i} className="space-y-6 relative group">
                <div className="text-8xl font-black text-white/5 group-hover:text-manevo-teal/10 transition-colors absolute -top-12 -left-4 z-0 select-none">
                  {s.step}
                </div>
                <div className="relative z-10 space-y-4">
                  <h4 className="text-2xl font-black">{s.title}</h4>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed">{s.desc}</p>
                </div>
                {i < 2 && <div className="hidden lg:block absolute top-6 -right-6 w-12 h-px bg-white/10"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-40 px-6 text-center max-w-5xl mx-auto space-y-16">
        <blockquote className="text-4xl md:text-5xl font-black text-white tracking-tightest italic leading-tight">
          "manevo es el corazón que conecta cada parte de mi negocio. Ahora tengo la claridad necesaria para abrir mi tercera sucursal."
        </blockquote>
        <div className="flex flex-col items-center gap-4">
          <div className="size-16 rounded-full border-2 border-manevo-teal/30 p-1">
            <div className="size-full rounded-full bg-gray-800 overflow-hidden">
              <img src="/src/assets/images/avatar-1.png" alt="Andrea Martínez" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-white">Andrea Martínez</p>
            <p className="text-sm font-bold text-manevo-teal uppercase tracking-[0.2em]">Dueña, Estética & Spa Zen</p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto bg-linear-to-br from-manevo-teal/20 via-[#0d1312] to-transparent border border-manevo-teal/10 rounded-[60px] p-12 md:p-24 text-center space-y-10 overflow-hidden relative">
          <div className="absolute -top-24 -left-24 size-96 bg-manevo-teal/10 blur-[100px] rounded-full"></div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tightest text-white leading-none">¿Listo para evolucionar <br />tu empresa?</h2>
          <p className="text-gray-400 text-xl font-medium max-w-xl mx-auto">Únete a cientos de empresas que ya transformaron su operación con manevo.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Button onClick={() => navigate('/auth/register')} className="px-14 py-6 text-xl font-black">
              CREAR CUENTA GRATIS
            </Button>
            <Button variant="outline" className="px-14 py-6 text-xl font-black">
              CONTACTAR VENTAS
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 text-center space-y-12">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-white/5 text-manevo-teal flex items-center justify-center border border-white/10">
              <svg
                className=" w-7 h-5"
                viewBox="0 0 31 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0"
                  y="0"
                  width="18"
                  height="18"
                  rx="9"
                  fill="currentColor"></rect>
                <rect
                  x="22"
                  y="0"
                  width="9"
                  height="18"
                  rx="4.5"
                  fill="currentColor"></rect>
              </svg>
            </div>
            <span className="text-2xl font-black text-white tracking-tightest uppercase italic">manevo</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm font-black text-gray-500 uppercase tracking-widest">
            <Link to="#" className="hover:text-white transition-colors">Producto</Link>
            <Link to="#" className="hover:text-white transition-colors">Soluciones</Link>
            <Link to="#" className="hover:text-white transition-colors">Precios</Link>
            <Link to="#" className="hover:text-white transition-colors">Soporte</Link>
          </nav>
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">© 2026 manevo • PRECISION IN MOTION</p>
        </div>
      </footer>
    </div>
  )
}

export default App
