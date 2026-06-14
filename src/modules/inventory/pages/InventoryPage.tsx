import React, { useEffect, useState } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Modal } from '../../../shared/components/ui/Modal';
import inventoryService from '../services/inventoryService';
import type { Product } from '../types/inventoryType';

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modals state
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Form states
    const [productForm, setProductForm] = useState({
        name: '',
        quantity: 0,
        unit_cost: 0,
        selling_price: 0,
        package_size: ''
    });

    const [movementForm, setMovementForm] = useState({
        type: 'in' as 'in' | 'out',
        amount: 1
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await inventoryService.createProduct({
                ...productForm,
                package_size: productForm.package_size ? parseInt(productForm.package_size) : undefined
            });
            setIsProductModalOpen(false);
            setProductForm({ name: '', quantity: 0, unit_cost: 0, selling_price: 0, package_size: '' });
            loadProducts();
        } catch (error) {
            console.error('Error al crear producto:', error);
        }
    };

    const handleRecordMovement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        try {
            await inventoryService.recordMovement(selectedProduct.id, movementForm);
            setIsMovementModalOpen(false);
            setMovementForm({ type: 'in', amount: 1 });
            loadProducts();
        } catch (error) {
            console.error('Error al registrar movimiento:', error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'out_of_stock': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'inactive': return 'bg-slate-50 text-slate-600 border-slate-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);
    };
    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header section with Premium Dark Banner */}
            <div className="relative overflow-hidden bg-manevo-slate rounded-3xl md:rounded-4xl p-6 md:p-10 text-white shadow-2xl shadow-manevo-slate/20">
                <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-manevo-teal/5 blur-2xl md:blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-manevo-teal/10 text-manevo-teal rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-3 md:mb-4 border border-manevo-teal/20">
                            Logística y Control
                        </span>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tightest leading-tight">Inventario de Productos</h1>
                        <p className="text-slate-400 font-medium mt-1 text-sm md:text-base">Gestión avanzada de stock y trazabilidad de movimientos.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <Button variant="outline" className="flex-1 md:flex-none flex items-center gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs md:text-sm px-3 md:px-4">
                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">file_download</span>
                            Exportar
                        </Button>
                        <Button onClick={() => setIsProductModalOpen(true)} className="flex-1 md:flex-none flex items-center gap-2 shadow-lg shadow-manevo-teal/20 text-xs md:text-sm px-3 md:px-4">
                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">add</span>
                            Nuevo Producto
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Overview with dark accents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-4xl border border-slate-100 shadow-sm flex items-center gap-4 md:gap-5 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-manevo-slate flex items-center justify-center text-manevo-teal shadow-inner group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl md:text-3xl">inventory_2</span>
                    </div>
                    <div>
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Productos</p>
                        <p className="text-2xl md:text-4xl font-black text-manevo-slate leading-none">{products.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-4xl border border-slate-100 shadow-sm flex items-center gap-4 md:gap-5 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-manevo-slate flex items-center justify-center text-manevo-teal shadow-inner group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl md:text-3xl">payments</span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Valor Inventario</p>
                        <p className="text-xl md:text-3xl font-black text-manevo-slate leading-none truncate">
                            {formatCurrency(products.reduce((acc, p) => acc + (p.quantity * p.unit_cost), 0))}
                        </p>
                    </div>
                </div>
                <div className="sm:col-span-2 lg:col-span-1 bg-white p-6 md:p-8 rounded-3xl md:rounded-4xl border border-slate-100 shadow-sm flex items-center gap-4 md:gap-5 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-manevo-slate flex items-center justify-center text-orange-500 shadow-inner group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl md:text-3xl">warning</span>
                    </div>
                    <div>
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stock Crítico</p>
                        <p className="text-2xl md:text-4xl font-black text-rose-500 leading-none">
                            {products.filter(p => p.quantity <= 5).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Buscar producto por nombre..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-manevo-teal/20 focus:border-manevo-teal transition-all text-black"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Producto</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Precio Venta</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Costo Unit.</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Stock</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Estado</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-8" colSpan={6}>
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No se encontraron productos.
                                    </td>
                                </tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                                                <span className="material-symbols-outlined">image</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-manevo-slate">{product.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                                                    {product.package_size ? `Empaque: ${product.package_size} uds` : 'Unidad Individual'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700">
                                        {formatCurrency(product.selling_price)}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-500 italic">
                                        {formatCurrency(product.unit_cost)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-lg font-black ${product.quantity <= 5 ? 'text-rose-500' : 'text-slate-700'}`}>
                                            {product.quantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(product.status)}`}>
                                            {product.status === 'active' ? 'ACTIVO' : product.status === 'out_of_stock' ? 'AGOTADO' : 'INACTIVO'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                title="Ajustar Stock"
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setIsMovementModalOpen(true);
                                                }}
                                                className="p-2 text-manevo-teal hover:bg-manevo-teal/10 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                                            </button>
                                            <button
                                                title="Configuraciones"
                                                className="p-2 text-slate-400 hover:text-manevo-slate hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Product Modal */}
            <Modal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                title="Nuevo Producto"
            >
                <form onSubmit={handleCreateProduct} className="space-y-4">
                    <Input
                        label="Nombre del Producto"
                        required
                        placeholder="Ej: Aceite de Motor 10W-30"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Costo Unitario (Compra)"
                            type="number"
                            placeholder="0"
                            value={productForm.unit_cost.toString()}
                            onChange={(e) => setProductForm({ ...productForm, unit_cost: parseFloat(e.target.value) })}
                        />
                        <Input
                            label="Precio de Venta"
                            type="number"
                            placeholder="0"
                            value={productForm.selling_price.toString()}
                            onChange={(e) => setProductForm({ ...productForm, selling_price: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Stock Inicial"
                            type="number"
                            placeholder="0"
                            value={productForm.quantity.toString()}
                            onChange={(e) => setProductForm({ ...productForm, quantity: parseInt(e.target.value) })}
                        />
                        <Input
                            label="Tamaño de Paquete (Opcional)"
                            type="number"
                            placeholder="Ej: 12"
                            value={productForm.package_size}
                            onChange={(e) => setProductForm({ ...productForm, package_size: e.target.value })}
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button variant="outline" className="flex-1" type="button" onClick={() => setIsProductModalOpen(false)}>Cancelar</Button>
                        <Button className="flex-1" type="submit">Guardar Producto</Button>
                    </div>
                </form>
            </Modal>

            {/* Movement / Adjust Stock Modal */}
            <Modal
                isOpen={isMovementModalOpen}
                onClose={() => setIsMovementModalOpen(false)}
                title={`Ajustar Stock: ${selectedProduct?.name}`}
            >
                <form onSubmit={handleRecordMovement} className="space-y-4">
                    <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
                        <button
                            type="button"
                            onClick={() => setMovementForm({ ...movementForm, type: 'in' })}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${movementForm.type === 'in' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}
                        >
                            ENTRADA (+)
                        </button>
                        <button
                            type="button"
                            onClick={() => setMovementForm({ ...movementForm, type: 'out' })}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${movementForm.type === 'out' ? 'bg-white shadow text-rose-600' : 'text-slate-500'}`}
                        >
                            SALIDA (-)
                        </button>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                            <span>STOCK ACTUAL</span>
                            <span>{selectedProduct?.quantity} uds</span>
                        </div>
                        <div className="flex justify-between text-sm font-black text-manevo-slate">
                            <span>NUEVO STOCK</span>
                            <span className={movementForm.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}>
                                {movementForm.type === 'in'
                                    ? (selectedProduct?.quantity || 0) + (movementForm.amount || 0)
                                    : (selectedProduct?.quantity || 0) - (movementForm.amount || 0)
                                } uds
                            </span>
                        </div>
                    </div>

                    <Input
                        label="Cantidad del Movimiento"
                        type="number"
                        min="1"
                        required
                        value={movementForm.amount.toString()}
                        onChange={(e) => setMovementForm({ ...movementForm, amount: parseInt(e.target.value) })}
                    />

                    <div className="pt-4 flex gap-3">
                        <Button variant="outline" className="flex-1" type="button" onClick={() => setIsMovementModalOpen(false)}>Cancelar</Button>
                        <Button className="flex-1" type="submit">Confirmar Ajuste</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
