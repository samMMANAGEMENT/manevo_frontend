import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './shared/components/ui/Button'

function App() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: "Comisiones Automáticas",
      description: "Registra un servicio y manevo calcula al instante cuánto le corresponde a cada empleado. Sin calculadora, sin errores, sin discusiones al final del día.",
      icon: "payments",
      highlight: true,
    },
    {
      title: "Auditoría Diaria",
      description: "Al cerrar el día, ves exactamente cuánto ingresó, cuánto se gastó, cuánto queda de ganancia y el desglose por cada empleado.",
      icon: "receipt_long",
    },
    {
      title: "Control de Inventario",
      description: "Lleva el stock de tus productos al día. Alertas automáticas cuando un producto está por agotarse, sin hojas de papel ni Excel.",
      icon: "inventory_2",
    },
    {
      title: "Punto de Venta",
      description: "Registra ventas de productos y servicios en segundos. Acepta efectivo, transferencia o pagos mixtos con un solo flujo.",
      icon: "point_of_sale",
    },
    {
      title: "Multi-Sucursal",
      description: "¿Tienes más de un local? Gestiona todas tus sucursales desde una sola cuenta con datos separados y reportes consolidados.",
      icon: "hub",
    },
    {
      title: "Facturación Electrónica",
      description: "Emite facturas electrónicas con cumplimiento DIAN integrado. Sin software adicional, sin intermediarios, sin complicaciones.",
      icon: "verified",
    },
  ];

  const painPoints = [
    {
      before: "Calculas comisiones a mano al final del día y siempre hay errores o discusiones con tus empleados.",
      after: "manevo calcula cada comisión en tiempo real. Al cerrar el día, el número está listo.",
      icon: "calculate",
    },
    {
      before: "No sabes exactamente cuánto ganaste hoy hasta que sumas todo en papel o en el celular.",
      after: "El dashboard te muestra la ganancia neta del día en tiempo real, desglosada por empleado.",
      icon: "insights",
    },
    {
      before: "Tu inventario se pierde o se agota sin aviso y solo te enteras cuando el cliente ya está en la silla.",
      after: "Alertas automáticas de stock bajo. Siempre sabes qué tienes y qué necesitas pedir.",
      icon: "inventory",
    },
  ];

  const plans = [
    {
      name: "Gratis",
      slug: "free",
      price: "0",
      priceSuffix: "para siempre",
      highlight: false,
      badge: null,
      maxUsers: "2 usuarios",
      modules: [
        "Dashboard operativo",
        "Servicios + comisiones",
        "Punto de Venta (POS)",
        "Control de gastos",
        "Inventario básico",
        "Facturación electrónica",
        "Reportes",
        "1 sucursal",
      ],
      notIncluded: ["Agendas y citas", "Integraciones", "Panel de administración", "API Access"],
      cta: "Crear cuenta gratis",
    },
    {
      name: "Goo",
      slug: "goo",
      price: "$39.900",
      priceSuffix: "COP / mes",
      highlight: false,
      badge: null,
      maxUsers: "Hasta 5 usuarios",
      modules: [
        "Todo lo del plan Gratis",
        "Agendas y gestión de citas",
        "Integraciones externas",
        "Hasta 5 empleados activos",
      ],
      notIncluded: ["Panel de administración", "API Access"],
      cta: "Empezar prueba gratis",
    },
    {
      name: "Essential",
      slug: "essential",
      price: "$79.900",
      priceSuffix: "COP / mes",
      highlight: true,
      badge: "Más popular",
      maxUsers: "Usuarios ilimitados",
      modules: [
        "Todo lo del plan Goo",
        "Panel de administración",
        "Empleados ilimitados",
        "Reportes avanzados",
        "Soporte prioritario",
      ],
      notIncluded: ["API Access"],
      cta: "Empezar prueba gratis",
    },
    {
      name: "Business",
      slug: "business",
      price: "$399.900",
      priceSuffix: "COP / mes",
      highlight: false,
      badge: "Multi-sucursal",
      maxUsers: "Usuarios ilimitados",
      modules: [
        "Todo lo del plan Essential",
        "API Access completo",
        "Sucursales ilimitadas",
        "Onboarding personalizado",
        "Soporte dedicado",
      ],
      notIncluded: [],
      cta: "Contactar ventas",
    },
  ];

  const faqs = [
    {
      q: "¿Necesito saber de sistemas para usar manevo?",
      a: "No. manevo está diseñado para que cualquier persona pueda usarlo desde el primer día. Si sabes usar WhatsApp, puedes usar manevo.",
    },
    {
      q: "¿Puedo probar manevo antes de pagar?",
      a: "Sí. El plan Gratis no tiene límite de tiempo y te da acceso a los módulos principales. Cuando necesites más funciones, puedes actualizar con un clic.",
    },
    {
      q: "¿Funciona para talleres de reparación, no solo peluquerías?",
      a: "Sí. Cualquier negocio que preste servicios y tenga empleados con comisión puede usar manevo: talleres mecánicos, centros de estética, spas, clínicas de uñas y más.",
    },
    {
      q: "¿Mis datos están seguros?",
      a: "Sí. Todos los datos se almacenan en servidores seguros con backups automáticos. Cada sucursal tiene sus datos separados y solo tú tienes acceso.",
    },
    {
      q: "¿Puedo cancelar en cualquier momento?",
      a: "Sí, sin penalidades ni letras pequeñas. Si cancelas, conservas el acceso hasta el final del período pagado y luego bajas automáticamente al plan Gratis.",
    },
  ];

  return (
    <div className="min-h-screen bg-manevo-bg-dark font-manrope selection:bg-manevo-teal/30 text-white overflow-x-hidden">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 md:px-20 py-4 md:py-6 fixed top-0 w-full z-50 backdrop-blur-md bg-manevo-bg-dark/80 border-b border-white/5">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="size-8 md:size-9 rounded-xl bg-manevo-teal/10 text-manevo-teal flex items-center justify-center border border-manevo-teal/20 shadow-[0_0_15px_rgba(19,236,218,0.1)]">
            <svg className="w-7 h-5" viewBox="0 0 31 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="18" height="18" rx="9" fill="currentColor" />
              <rect x="22" y="0" width="9" height="18" rx="4.5" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xl md:text-2xl font-black text-white tracking-tightest">manevo</span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-sm font-bold text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Funciones</a>
          <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth/login" className="text-xs md:text-sm font-bold text-gray-300 hover:text-white transition-colors">Iniciar sesión</Link>
          <Button onClick={() => navigate('/auth/register')} className="px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] font-black tracking-widest uppercase shrink-0">
            GRATIS
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-44 pb-28 px-6 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-manevo-teal/10 blur-[130px] rounded-full -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-manevo-mint/5 blur-[120px] rounded-full -z-10"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-manevo-teal/10 border border-manevo-teal/20 rounded-full transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <span className="size-1.5 bg-manevo-teal rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-manevo-teal uppercase tracking-widest">Hecho para peluquerías, salones y talleres en Colombia</span>
          </div>

          <h1 className={`text-5xl md:text-[80px] font-black text-white tracking-tightest leading-[0.9] transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            ¿Todavía calculas<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-manevo-teal via-white to-manevo-teal">comisiones a mano?</span>
          </h1>

          <p className={`text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            manevo calcula automáticamente las comisiones de tus empleados, lleva el control de tu caja diaria y te muestra exactamente cuánto ganaste — todo en tiempo real.
          </p>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Button onClick={() => navigate('/auth/register')} className="px-10 py-5 text-base font-black shadow-[0_0_30px_rgba(19,236,218,0.2)]">
              CREAR CUENTA GRATIS
            </Button>
            <a href="#features" className="px-10 py-5 text-base font-black border border-white/10 rounded-xl text-white hover:bg-white/5 transition-colors">
              VER FUNCIONES
            </a>
          </div>

          <p className={`text-xs font-bold text-gray-600 uppercase tracking-widest transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Sin tarjeta de crédito · Plan gratuito permanente · Listo en 5 minutos
          </p>
        </div>
      </section>

      {/* Social proof strip */}
      <div className="border-y border-white/5 bg-white/2 py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-16 gap-y-4">
          {[
            { value: "100%", label: "Comisiones sin errores" },
            { value: "5 min", label: "Para configurar tu negocio" },
            { value: "0 COP", label: "Para empezar hoy" },
            { value: "Multi-sucursal", label: "Desde el plan Gratis" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xl font-black text-manevo-teal">{stat.value}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pain Points — Antes vs Después */}
      <section className="py-28 px-6 bg-[#090e0d]">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black text-manevo-teal uppercase tracking-widest">El problema que resolvemos</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tightest">Lo que vives hoy<br />vs. lo que tendrás.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {painPoints.map((point, i) => (
              <div key={i} className="space-y-4">
                {/* Antes */}
                <div className="bg-red-500/5 border border-red-500/10 rounded-[28px] p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="size-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[12px]! text-red-400">close</span>
                    </span>
                    <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Antes</span>
                  </div>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">{point.before}</p>
                </div>
                {/* Después */}
                <div className="bg-manevo-teal/5 border border-manevo-teal/15 rounded-[28px] p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="size-5 rounded-full bg-manevo-teal/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[12px]! text-manevo-teal">check</span>
                    </span>
                    <span className="text-[9px] font-black text-manevo-teal uppercase tracking-widest">Con manevo</span>
                  </div>
                  <p className="text-white text-sm font-medium leading-relaxed">{point.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black text-manevo-teal uppercase tracking-widest">Funciones</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tightest">Todo lo que necesitas,<br />nada de lo que no.</h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto text-lg">Diseñado específicamente para negocios de servicios con empleados.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <div
                key={i}
                className={`p-8 rounded-[32px] border transition-all group relative overflow-hidden
                  ${feat.highlight
                    ? 'bg-manevo-teal/10 border-manevo-teal/30 hover:border-manevo-teal/50'
                    : 'bg-white/2 border-white/5 hover:bg-white/5 hover:border-manevo-teal/20'
                  }`}
              >
                {feat.highlight && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-manevo-teal text-manevo-slate rounded-full text-[8px] font-black uppercase tracking-widest">
                    Killer feature
                  </div>
                )}
                <div className={`size-14 rounded-2xl flex items-center justify-center mb-8 border transition-all group-hover:scale-110
                  ${feat.highlight
                    ? 'bg-manevo-teal/20 text-manevo-teal border-manevo-teal/20'
                    : 'bg-manevo-teal/10 text-manevo-teal border-manevo-teal/10'
                  }`}>
                  <span className="material-symbols-outlined text-3xl!">{feat.icon}</span>
                </div>
                <h3 className="text-xl font-black mb-3 text-white">{feat.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-28 px-6 bg-[#090e0d] border-y border-white/5">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black text-manevo-teal uppercase tracking-widest">Así de fácil</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tightest">En 3 pasos, listo.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Crea tu cuenta", desc: "Regístrate gratis en menos de 2 minutos. No necesitas tarjeta de crédito.", icon: "person_add" },
              { step: "02", title: "Configura tu negocio", desc: "Agrega tus servicios, empleados y porcentajes de comisión. Tarda menos de 5 minutos.", icon: "settings" },
              { step: "03", title: "Empieza a operar", desc: "Registra servicios y ventas. manevo hace el resto — comisiones, caja, reportes.", icon: "rocket_launch" },
            ].map((s, i) => (
              <div key={i} className="relative group text-center space-y-5">
                <div className="size-20 mx-auto rounded-3xl bg-manevo-teal/10 border border-manevo-teal/20 text-manevo-teal flex items-center justify-center group-hover:bg-manevo-teal group-hover:text-manevo-slate transition-all duration-300">
                  <span className="material-symbols-outlined text-4xl!">{s.icon}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-manevo-teal uppercase tracking-widest">Paso {s.step}</p>
                  <h4 className="text-xl font-black text-white">{s.title}</h4>
                  <p className="text-gray-500 font-medium leading-relaxed text-sm">{s.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 -right-5 text-white/10">
                    <span className="material-symbols-outlined text-3xl!">arrow_forward</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black text-manevo-teal uppercase tracking-widest">Precios</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tightest">Sin letras pequeñas.</h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto text-lg">Empieza gratis. Escala cuando lo necesites.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-[32px] p-7 flex flex-col border transition-all
                  ${plan.highlight
                    ? 'bg-manevo-teal text-manevo-slate border-manevo-teal shadow-[0_0_60px_rgba(19,236,218,0.25)]'
                    : 'bg-white/3 border-white/8 hover:border-white/15'
                  }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest whitespace-nowrap
                    ${plan.highlight ? 'bg-manevo-slate text-manevo-teal' : 'bg-manevo-teal text-manevo-slate'}`}>
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${plan.highlight ? 'text-manevo-slate/60' : 'text-gray-500'}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-black ${plan.highlight ? 'text-manevo-slate' : 'text-white'}`}>
                      {plan.price}
                    </span>
                  </div>
                  <p className={`text-[10px] font-bold mt-0.5 ${plan.highlight ? 'text-manevo-slate/60' : 'text-gray-500'}`}>
                    {plan.priceSuffix}
                  </p>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-3 ${plan.highlight ? 'text-manevo-slate/70' : 'text-gray-600'}`}>
                    {plan.maxUsers}
                  </p>
                </div>

                <div className="flex-1 space-y-2 mb-6">
                  {plan.modules.map((mod, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className={`material-symbols-outlined text-[14px]! mt-0.5 shrink-0 ${plan.highlight ? 'text-manevo-slate' : 'text-manevo-teal'}`}>
                        check_circle
                      </span>
                      <span className={`text-xs font-medium ${plan.highlight ? 'text-manevo-slate' : 'text-gray-300'}`}>{mod}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((mod, j) => (
                    <div key={j} className="flex items-start gap-2 opacity-40">
                      <span className="material-symbols-outlined text-[14px]! mt-0.5 shrink-0 text-gray-500">remove</span>
                      <span className="text-xs font-medium text-gray-500">{mod}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/auth/register')}
                  className={`w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all
                    ${plan.highlight
                      ? 'bg-manevo-slate text-manevo-teal hover:bg-manevo-slate/80'
                      : 'bg-manevo-teal/10 text-manevo-teal border border-manevo-teal/20 hover:bg-manevo-teal hover:text-manevo-slate'
                    }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-xs font-bold text-gray-600 uppercase tracking-widest">
            Todos los planes incluyen 30 días de prueba sin costo · Cancela cuando quieras
          </p>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-28 px-6 bg-[#090e0d] border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-2">
            {[1,2,3,4,5].map(s => (
              <span key={s} className="inline-block text-manevo-teal text-xl mr-1">★</span>
            ))}
          </div>
          <blockquote className="text-3xl md:text-4xl font-black text-white tracking-tightest leading-tight">
            "Antes cerraba el día y tardaba 40 minutos sumando comisiones en papel. Ahora abro manevo y el número ya está listo. Eso solo ya valió la pena."
          </blockquote>
          <div className="flex flex-col items-center gap-4">
            <div className="size-16 rounded-full border-2 border-manevo-teal/30 p-1 bg-gray-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-manevo-teal text-3xl!">person</span>
            </div>
            <div>
              <p className="text-lg font-black text-white">Andrea Martínez</p>
              <p className="text-sm font-bold text-manevo-teal uppercase tracking-[0.2em]">Dueña · Estética & Spa Zen, Medellín</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black text-manevo-teal uppercase tracking-widest">Preguntas frecuentes</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tightest">Resolvemos tus dudas.</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-all cursor-pointer
                  ${activeFaq === i ? 'border-manevo-teal/30 bg-manevo-teal/5' : 'border-white/8 bg-white/2 hover:border-white/15'}`}
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between p-5 gap-4">
                  <p className="text-sm font-black text-white">{faq.q}</p>
                  <span className={`material-symbols-outlined text-manevo-teal shrink-0 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </div>
                {activeFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-linear-to-br from-manevo-teal/20 via-[#0d1312] to-transparent border border-manevo-teal/15 rounded-[48px] p-10 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 size-96 bg-manevo-teal/10 blur-[100px] rounded-full pointer-events-none"></div>
          <p className="text-[10px] font-black text-manevo-teal uppercase tracking-widest">Empieza hoy</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tightest text-white leading-tight">
            Tu negocio merece<br />un sistema que lo entienda.
          </h2>
          <p className="text-gray-400 text-lg font-medium max-w-lg mx-auto">
            Crea tu cuenta gratis, configura tus empleados y empieza a registrar servicios hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button onClick={() => navigate('/auth/register')} className="px-12 py-5 text-base font-black shadow-[0_0_30px_rgba(19,236,218,0.2)]">
              CREAR CUENTA GRATIS
            </Button>
            <button className="px-12 py-5 text-base font-black border border-white/10 rounded-xl text-white hover:bg-white/5 transition-colors">
              HABLAR CON VENTAS
            </button>
          </div>
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Sin tarjeta · Sin contratos · Sin complicaciones</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-white/5 text-manevo-teal flex items-center justify-center border border-white/10">
              <svg className="w-7 h-5" viewBox="0 0 31 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="18" height="18" rx="9" fill="currentColor" />
                <rect x="22" y="0" width="9" height="18" rx="4.5" fill="currentColor" />
              </svg>
            </div>
            <span className="text-xl font-black text-white tracking-tightest">manevo</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-xs font-black text-gray-600 uppercase tracking-widest">
            <a href="#features" className="hover:text-white transition-colors">Funciones</a>
            <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link to="/auth/login" className="hover:text-white transition-colors">Iniciar sesión</Link>
          </nav>
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">© 2026 manevo · Precision in Motion · Medellín, Colombia</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
