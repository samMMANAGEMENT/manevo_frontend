import { useState, useEffect } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import billingService, { type BillingConfig } from '../services/billingService';

export default function BillingManagementTab() {
    const [config, setConfig] = useState<BillingConfig>({
        razon_social: '',
        document_type: 'NIT',
        nit: '',
        dv: '',
        email_billing: '',
        phone_billing: '',
        address_billing: '',
        city_billing: '',
        tax_regime: '',
        resolution_number: '',
        resolution_date: '',
        prefix: '',
        start_range: 0,
        end_range: 0,
        software_id: '',
        software_pin: '',
        api_token: '',
        api_base_url: 'https://api.datainvoicecolombia.com/api',
        test_set_id: '',
        is_test: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            setLoading(true);
            const data = await billingService.getBillingConfig();
            if (data && data.razon_social) {
                setConfig(data);
            }
        } catch (error) {
            console.error('Error cargando configuración:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadTestData = () => {
        setConfig({
            ...config,
            razon_social: 'CASTRO MERIÑO VICTOR ANDRES',
            document_type: 'CC',
            nit: '7573772',
            api_token: '43bd4fb03f875a4b959c6b2b004846e998e9b502c8e7e51b2d0a1c62c4cce48f',
            prefix: 'SETP',
            resolution_number: '18760000001',
            start_range: 990000000,
            end_range: 995000000,
            api_base_url: 'https://api.datainvoicecolombia.com/api',
            is_test: true
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await billingService.saveBillingConfig(config);
            alert('Configuración guardada exitosamente');
        } catch (error: any) {
            console.error('Error guardando configuración:', error);
            alert(error.response?.data?.message || 'Error al guardar configuración');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-12 rounded-4xl border border-slate-100 shadow-xl flex items-center justify-center animate-pulse">
                <div className="text-slate-400 font-bold">Cargando configuración...</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-10 rounded-4xl border border-slate-100 shadow-xl space-y-10 animate-fade-in relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-manevo-teal/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-6">
                    <div className="size-16 rounded-3xl bg-manevo-slate text-manevo-teal flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">receipt_long</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-manevo-slate tracking-tight">Facturación Electrónica</h2>
                        <p className="text-slate-400 font-medium">Configura tu conexión con la DIAN y DataInvoice Colombia.</p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={loadTestData}
                    className="border-manevo-teal/20 text-manevo-teal hover:bg-manevo-teal/5 font-bold"
                >
                    <span className="material-symbols-outlined mr-2">science</span>
                    Cargar Datos de Prueba
                </Button>
            </div>

            <form onSubmit={handleSave} className="space-y-12 relative z-10">
                {/* General Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="material-symbols-outlined text-manevo-teal text-[20px]">business</span>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Información de la Entidad</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Razón Social / Nombre"
                            placeholder="Ej: CASTRO MERIÑO VICTOR ANDRES"
                            value={config.razon_social}
                            onChange={(e) => setConfig({ ...config, razon_social: e.target.value })}
                            required
                        />
                        <div className="grid grid-cols-6 gap-3">
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Tipo Doc</label>
                                <Select
                                    value={config.document_type}
                                    onChange={(val) => setConfig({ ...config, document_type: String(val) })}
                                    options={[
                                        { value: 'NIT', label: 'NIT' },
                                        { value: 'CC', label: 'Cédula' },
                                        { value: 'CE', label: 'C. Extranjería' },
                                        { value: 'PPN', label: 'Paso Pasaporte' }
                                    ]}
                                    className="space-y-0 text-sm font-bold"
                                />
                            </div>
                            <div className="col-span-3">
                                <Input
                                    label="Número"
                                    placeholder="Ej: 7573772"
                                    value={config.nit}
                                    onChange={(e) => setConfig({ ...config, nit: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <Input
                                    label="DV"
                                    placeholder="0"
                                    maxLength={1}
                                    value={config.dv || ''}
                                    onChange={(e) => setConfig({ ...config, dv: e.target.value })}
                                    disabled={config.document_type !== 'NIT'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            placeholder="facturacion@empresa.com"
                            value={config.email_billing || ''}
                            onChange={(e) => setConfig({ ...config, email_billing: e.target.value })}
                        />
                        <Input
                            label="Teléfono Móvil"
                            placeholder="321 000 0000"
                            value={config.phone_billing || ''}
                            onChange={(e) => setConfig({ ...config, phone_billing: e.target.value })}
                        />
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Régimen Fiscal</label>
                            <Select
                                value={config.tax_regime || ''}
                                onChange={(val) => setConfig({ ...config, tax_regime: String(val) })}
                                placeholder="Seleccionar..."
                                options={[
                                    { value: 'RESPONSABLE_IVA', label: 'Responsable de IVA' },
                                    { value: 'NO_RESPONSABLE_IVA', label: 'No responsable de IVA' },
                                    { value: 'REGIMEN_SIMPLE', label: 'Régimen Simple de Tributación' }
                                ]}
                                className="space-y-0 text-sm font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* Resolution Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="material-symbols-outlined text-manevo-teal text-[20px]">description</span>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Resolución DIAN</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            label="Nro de Resolución"
                            placeholder="Ej: 18760000001"
                            value={config.resolution_number || ''}
                            onChange={(e) => setConfig({ ...config, resolution_number: e.target.value })}
                        />
                        <Input
                            label="Fecha de Resolución"
                            type="date"
                            value={config.resolution_date || ''}
                            onChange={(e) => setConfig({ ...config, resolution_date: e.target.value })}
                        />
                        <Input
                            label="Prefijo"
                            placeholder="Ej: SETP"
                            value={config.prefix || ''}
                            onChange={(e) => setConfig({ ...config, prefix: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Rango Inicial"
                            type="number"
                            placeholder="Ej: 990000000"
                            value={config.start_range || ''}
                            onChange={(e) => setConfig({ ...config, start_range: parseInt(e.target.value) || 0 })}
                        />
                        <Input
                            label="Rango Final"
                            type="number"
                            placeholder="Ej: 995000000"
                            value={config.end_range || ''}
                            onChange={(e) => setConfig({ ...config, end_range: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>

                {/* API Section */}
                <div className="bg-slate-50 p-8 rounded-3xl space-y-8 border border-slate-100">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-manevo-teal text-[20px]">hub</span>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Integración DataInvoice</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Modo Pruebas</span>
                            <button
                                type="button"
                                onClick={() => setConfig({ ...config, is_test: !config.is_test })}
                                className={`w-12 h-6 rounded-full transition-all relative ${config.is_test ? 'bg-manevo-teal' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.is_test ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="API Base URL"
                            placeholder="https://api.datainvoicecolombia.com/api"
                            value={config.api_base_url || ''}
                            onChange={(e) => setConfig({ ...config, api_base_url: e.target.value })}
                        />
                        <Input
                            label="API Access Token"
                            placeholder="Tu token de 64 caracteres"
                            value={config.api_token || ''}
                            onChange={(e) => setConfig({ ...config, api_token: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-dashed border-slate-200">
                        <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            <span className="material-symbols-outlined">info</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Para iniciar pruebas, utiliza el prefijo <strong>SETP</strong> y la resolución brindada en la documentación de habilitación. <br />
                            Consulta la <a href="https://docs.datainvoicecolombia.com/factura_electronica/factura/" target="_blank" className="text-manevo-teal font-black underline">Documentación Oficial</a> para más detalles.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-manevo-slate text-white px-12 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-manevo-slate/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {saving ? 'Guardando...' : 'GUARDAR CONFIGURACIÓN DIAN'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
