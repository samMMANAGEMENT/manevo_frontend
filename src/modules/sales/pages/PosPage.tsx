import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Modal } from '../../../shared/components/ui/Modal';
import inventoryService from '../../inventory/services/inventoryService';
import salesService from '../services/salesService';
import type { Product } from '../../inventory/types/inventoryType';

interface CartItem extends Product {
    cartQuantity: number;
}

export default function PosPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);

    // Checkout state
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'mixed'>('cash');
    const [cashAmount, setCashAmount] = useState<string>('');
    const [transferAmount, setTransferAmount] = useState<string>('');
    const [processingSale, setProcessingSale] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getProducts();
            setProducts(data.filter(p => p.status === 'active'));
        } catch (error) {
            console.error('Error al cargar productos:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                if (existing.cartQuantity >= product.quantity) return prevCart;
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, cartQuantity: 1 }];
        });
    };

    const updateCartQuantity = (id: number, delta: number) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === id) {
                    const newQty = item.cartQuantity + delta;
                    if (newQty < 1) return item;
                    if (newQty > item.quantity) return item;
                    return { ...item, cartQuantity: newQty };
                }
                return item;
            });
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const total = useMemo(() => {
        return cart.reduce((acc, item) => acc + (item.selling_price * item.cartQuantity), 0);
    }, [cart]);

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        try {
            setProcessingSale(true);
            const saleData = {
                payment_method: paymentMethod,
                cash_amount: paymentMethod === 'mixed' ? parseFloat(cashAmount) : undefined,
                transfer_amount: paymentMethod === 'mixed' ? parseFloat(transferAmount) : undefined,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.cartQuantity
                }))
            };

            await salesService.createSale(saleData);

            // Reset everything
            setCart([]);
            setIsCheckoutModalOpen(false);
            setPaymentMethod('cash');
            setCashAmount('');
            setTransferAmount('');

            // Reload products to update stock
            loadProducts();

            alert('Venta procesada con éxito');
        } catch (error: any) {
            console.error('Error al procesar venta:', error);
            alert('Error: ' + (error.response?.data?.error || error.message));
        } finally {
            setProcessingSale(false);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-140px)] animate-fade-in relative pb-20 lg:pb-0">
            {/* Products Catalog */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
                <div className="bg-manevo-slate p-6 md:p-10 rounded-3xl md:rounded-4xl border border-white/5 shadow-2xl relative overflow-hidden text-white mb-2">
                    <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-manevo-teal/5 blur-2xl md:blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-manevo-teal/10 text-manevo-teal rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-3 md:mb-4 border border-manevo-teal/20">
                            Punto de Venta
                        </span>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tightest leading-tight">Venta de Productos</h1>
                        <p className="text-slate-400 font-medium mt-1 text-sm md:text-base">Gestiona el inventario y procesa ventas rápidamente.</p>
                    </div>
                </div>

                <div className="bg-white p-2 md:p-3 rounded-2xl md:rounded-3xl border border-slate-100 shadow-xl flex items-center gap-4 sticky top-16 md:top-20 z-20">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Buscar productos por nombre..."
                            className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-manevo-teal/20 focus:bg-white focus:border-manevo-teal transition-all placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 lg:overflow-y-auto no-scrollbar lg:pr-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 pb-4">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-white rounded-3xl p-4 border border-slate-100 animate-pulse h-40"></div>
                        ))
                    ) : filteredProducts.map(product => {
                        const inCart = cart.find(c => c.id === product.id);
                        const disabled = (inCart?.cartQuantity || 0) >= product.quantity;

                        return (
                            <div
                                key={product.id}
                                onClick={() => !disabled && addToCart(product)}
                                className={`group relative bg-white border rounded-3xl p-5 flex flex-col gap-3 transition-all cursor-pointer select-none
                                    ${disabled ? 'opacity-60 grayscale' : 'hover:border-manevo-teal hover:shadow-2xl hover:shadow-manevo-teal/10 active:scale-95'}
                                    ${inCart ? 'border-manevo-teal bg-manevo-teal/5 ring-1 ring-manevo-teal/20' : 'border-slate-100 shadow-sm'}
                                `}
                            >
                                <div className={`size-12 rounded-2xl flex items-center justify-center transition-all
                                    ${inCart ? 'bg-manevo-teal text-manevo-slate' : 'bg-slate-50 text-slate-400 group-hover:bg-manevo-teal group-hover:text-manevo-slate'}
                                `}>
                                    <span className="material-symbols-outlined text-2xl">inventory_2</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-manevo-slate text-sm line-clamp-1 uppercase tracking-tight">{product.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{product.quantity} EN STOCK</p>
                                </div>
                                <p className="text-xl font-black text-manevo-slate">{formatCurrency(product.selling_price)}</p>

                                {inCart ? (
                                    <div className="absolute top-4 right-4 size-8 rounded-full bg-manevo-teal text-manevo-slate flex items-center justify-center text-xs font-black shadow-lg animate-scale-in">
                                        {inCart.cartQuantity}
                                    </div>
                                ) : (
                                    <div className="absolute bottom-4 right-4 text-manevo-teal opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined">add_circle</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Shopping Cart */}
            <div className="w-full lg:w-[450px] flex flex-col gap-6" id="pos-cart">
                <div className="flex-1 bg-white rounded-3xl md:rounded-4xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-6 md:p-8 bg-manevo-slate text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-manevo-teal/10 to-transparent"></div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl md:text-2xl font-black tracking-tightest">Venta Actual</h3>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">{cart.length} productos en lista</p>
                            </div>
                            <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-manevo-teal">
                                <span className="material-symbols-outlined text-xl md:text-2xl">shopping_cart_checkout</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 custom-scrollbar bg-slate-50/30 min-h-[300px] lg:min-h-0">
                        {cart.length === 0 ? (
                            <div className="h-full py-12 lg:py-0 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-60">
                                <div className="size-16 md:size-20 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
                                    <span className="material-symbols-outlined text-3xl md:text-4xl">shopping_basket</span>
                                </div>
                                <p className="font-bold text-xs md:text-sm uppercase tracking-widest text-center">Selecciona productos para<br />empezar la venta</p>
                            </div>
                        ) : cart.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 border border-slate-100 space-y-4 animate-slide-in shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-manevo-teal"></div>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs md:text-sm font-black text-manevo-slate truncate uppercase tracking-tighter">{item.name}</p>
                                        <p className="text-[11px] md:text-xs font-bold text-manevo-teal">{formatCurrency(item.selling_price)}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="p-1 text-slate-300 hover:text-rose-500 transition-colors">
                                        <span className="material-symbols-outlined text-[18px] md:text-[20px]">delete</span>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center bg-slate-100 rounded-lg md:rounded-xl p-0.5 md:p-1 flex-1 max-w-[140px]">
                                        <button onClick={() => updateCartQuantity(item.id, -1)} className="size-7 md:size-8 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors bg-white rounded-md md:rounded-lg shadow-sm">
                                            <span className="material-symbols-outlined text-[16px] md:text-[18px]">remove</span>
                                        </button>
                                        <span className="flex-1 text-center text-xs md:text-sm font-black text-manevo-slate">{item.cartQuantity}</span>
                                        <button onClick={() => updateCartQuantity(item.id, 1)} className="size-7 md:size-8 flex items-center justify-center text-slate-500 hover:text-emerald-500 transition-colors bg-white rounded-md md:rounded-lg shadow-sm">
                                            <span className="material-symbols-outlined text-[16px] md:text-[18px]">add</span>
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-1">Subtotal</p>
                                        <p className="text-sm font-black text-manevo-slate">{formatCurrency(item.selling_price * item.cartQuantity)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 md:p-8 bg-white border-t border-slate-100 space-y-4 md:space-y-6">
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex justify-between text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span>SUBTOTAL PRODUCTOS</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs md:text-sm font-black text-manevo-slate uppercase tracking-tighter">Total a Pagar</span>
                                <span className="text-2xl md:text-3xl font-black text-manevo-slate">{formatCurrency(total)}</span>
                            </div>
                        </div>
                        <Button
                            fullWidth
                            className="py-4 md:py-5 text-base md:text-lg font-black bg-manevo-slate text-white shadow-2xl shadow-manevo-slate/20 rounded-2xl md:rounded-3xl hover:bg-manevo-slate/90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            disabled={cart.length === 0}
                            onClick={() => setIsCheckoutModalOpen(true)}
                        >
                            PROCEDER AL PAGO
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Cart Floating Button */}
            <div className="fixed bottom-6 right-6 z-30 lg:hidden">
                <button
                    onClick={() => document.getElementById('pos-cart')?.scrollIntoView({ behavior: 'smooth' })}
                    className="size-14 rounded-full bg-manevo-slate text-manevo-teal shadow-2xl flex items-center justify-center relative active:scale-90 transition-transform"
                >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 size-6 bg-manevo-teal text-manevo-slate text-[10px] font-black rounded-full flex items-center justify-center border-2 border-manevo-slate">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Checkout Modal */}
            <Modal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                title="Confirmar Venta"
            >
                <div className="space-y-6">
                    <div className="text-center bg-manevo-teal/5 p-6 rounded-3xl border border-manevo-teal/10">
                        <p className="text-xs font-bold text-manevo-teal uppercase tracking-widest mb-1">Total a Cobrar</p>
                        <h2 className="text-5xl font-black text-manevo-slate">{formatCurrency(total)}</h2>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Método de Pago</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['cash', 'transfer', 'mixed'].map((method) => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method as any)}
                                    className={`py-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1
                                        ${paymentMethod === method
                                            ? 'border-manevo-teal bg-manevo-teal/5 text-manevo-teal'
                                            : 'border-slate-100 text-slate-400 hover:border-slate-200'}
                                    `}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {method === 'cash' ? 'payments' : method === 'transfer' ? 'account_balance' : 'account_balance_wallet'}
                                    </span>
                                    <span className="text-[10px] font-black uppercase text-center">
                                        {method === 'cash' ? 'EFECTIVO' : method === 'transfer' ? 'TRANSF.' : 'MIXTO'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {paymentMethod === 'mixed' && (
                        <div className="grid grid-cols-2 gap-4 animate-slide-in bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <Input
                                label="Efectivo"
                                type="number"
                                placeholder="0"
                                value={cashAmount}
                                onChange={(e) => setCashAmount(e.target.value)}
                            />
                            <Input
                                label="Transferencia"
                                type="number"
                                placeholder="0"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="pt-2 flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setIsCheckoutModalOpen(false)}>Cancelar</Button>
                        <Button
                            className="flex-1 shadow-lg shadow-manevo-teal/20"
                            onClick={handleCheckout}
                            disabled={processingSale || (paymentMethod === 'mixed' && (!cashAmount || !transferAmount))}
                        >
                            {processingSale ? 'Procesando...' : 'Finalizar Venta'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
