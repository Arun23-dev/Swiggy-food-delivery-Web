import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, Wallet, Truck, Shield, CheckCircle,
    ChevronRight, Lock, AlertCircle, ArrowLeft,
    Receipt, Package, Zap, Tag, BadgePercent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createOrder } from '@/features/OrderSlice';
import { initiateEsewaPayment } from '../lib/esewa';
import toast, { Toaster } from 'react-hot-toast';

const SWIGGY_BASE_URL = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_200,c_fit/";

const PAYMENT_METHODS = [
    {
        id: 'esewa',
        label: 'eSewa',
        description: 'Pay via eSewa digital wallet',
        icon: Wallet,
        badge: 'Popular',
        badgeColor: 'bg-green-100 text-green-700',
        gradient: 'from-green-500 to-emerald-600',
    },
    {
        id: 'card',
        label: 'Credit / Debit Card',
        description: 'Visa, Mastercard, Rupay',
        icon: CreditCard,
        badge: null,
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        id: 'cod',
        label: 'Cash on Delivery',
        description: 'Pay when your order arrives',
        icon: Truck,
        badge: null,
        gradient: 'from-amber-500 to-orange-500',
    },
];

// ── KPI Card ──────────────────────────────────────────────────────────────────
const KPICard = ({ title, value, sub, icon: Icon, gradient, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="bg-white rounded-2xl shadow-sm p-5 overflow-hidden relative group hover:shadow-md transition-shadow"
    >
        {/* Subtle background accent */}
        <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
        <div className="relative">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
    </motion.div>
);

export default function PaymentPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { orders = [] } = useSelector((state) => state.order);

    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(user?.address?.[0] || null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    // ── Calculations ─────────────────────────────────────────────────────────
    const subtotal = items.reduce((s, i) => s + Math.floor((i.defaultPrice || i.price || 0) / 100) * i.quantity, 0);
    const deliveryFee = subtotal >= 500 ? 0 : (items.length > 0 ? 30 : 0);
    const total = subtotal + deliveryFee;
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);

    // ── Historical stats from past orders ───────────────────────────────────
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const totalPaidFood = deliveredOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const totalPaidDelivery = deliveredOrders.length * 30; // approx
    const avgOrderValue = deliveredOrders.length
        ? Math.round(totalPaidFood / deliveredOrders.length)
        : 0;
    const freeDeliveryOrders = deliveredOrders.filter(o => (o.totalAmount || 0) >= 530).length;

    // ── KPI configs ──────────────────────────────────────────────────────────
    const kpis = [
        {
            title: 'This Order',
            value: `₹${total}`,
            sub: `${totalItems} item${totalItems !== 1 ? 's' : ''} · ${deliveryFee === 0 ? 'Free delivery' : `₹${deliveryFee} delivery`}`,
            icon: Receipt,
            gradient: 'from-orange-500 to-rose-500',
        },
        {
            title: 'Total Spent on Food',
            value: `₹${totalPaidFood.toLocaleString()}`,
            sub: `Across ${deliveredOrders.length} delivered orders`,
            icon: Package,
            gradient: 'from-blue-500 to-indigo-500',
        },
        {
            title: 'Delivery Charges Paid',
            value: `₹${totalPaidDelivery}`,
            sub: `${freeDeliveryOrders} orders got free delivery`,
            icon: Truck,
            gradient: 'from-amber-500 to-yellow-500',
        },
        {
            title: 'Avg. Order Value',
            value: avgOrderValue ? `₹${avgOrderValue}` : '—',
            sub: deliveredOrders.length > 0 ? 'Per delivered order' : 'No orders yet',
            icon: BadgePercent,
            gradient: 'from-emerald-500 to-teal-500',
        },
    ];

    // ── Place order ──────────────────────────────────────────────────────────
    const handlePlaceOrder = async () => {
        if (!selectedAddress) return toast.error('Please select a delivery address');
        if (!selectedMethod) return toast.error('Please select a payment method');
        if (items.length === 0) return toast.error('Your cart is empty');

        setIsProcessing(true);
        try {
            const response = await dispatch(
                createOrder({
                    deliveryAddress: selectedAddress,
                    items,
                    totalAmount: total,
                    PaymentMode: selectedMethod,
                })
            );

            if (response?.payload?.success) {
                if (selectedMethod === 'esewa') {
                    initiateEsewaPayment({
                        orderId: response.payload.order._id,
                        amount: total,
                        transactionId: response.payload.transactionId,
                    });
                } else {
                    setSuccess(true);
                }
            } else {
                toast.error('Failed to place order. Try again.');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsProcessing(false);
        }
    };

    // ── Success screen ────────────────────────────────────────────────────────
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 flex items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 220 }}
                    className="bg-white rounded-3xl p-10 text-center max-w-md w-full shadow-2xl"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
                    >
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
                    <p className="text-gray-400 mb-2">Your food is being prepared.</p>
                    <p className="text-3xl font-bold text-orange-500 mb-6">₹{total}</p>
                    <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Food total</span>
                            <span className="font-medium">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Delivery</span>
                            <span className="font-medium">{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Payment</span>
                            <span className="font-medium capitalize">{selectedMethod}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => navigate('/dashboard/orders')}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 font-semibold"
                        >
                            Track Order
                        </Button>
                        <Button
                            onClick={() => navigate('/')}
                            variant="outline"
                            className="flex-1 rounded-xl h-12"
                        >
                            Home
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ── Main page ─────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-center" />

            {/* ── KPI Row ─────────────────────────────────────────────────────── */}
            <div className="px-6 pt-6 pb-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {kpis.map((kpi, i) => (
                        <KPICard key={i} {...kpi} delay={i * 0.07} />
                    ))}
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 pb-10 grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* ── LEFT — Address + Payment method ───────────────────────────── */}
                <section className="lg:col-span-3 space-y-5">

                    {/* Delivery Address */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-sm overflow-hidden"
                    >
                        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Truck className="w-4 h-4 text-orange-500" />
                            </div>
                            <h2 className="font-semibold text-gray-800">Delivery Address</h2>
                        </div>

                        <div className="p-5">
                            {user?.address?.length > 0 ? (
                                <div className="space-y-3">
                                    {user.address.map((addr) => {
                                        const isSelected = selectedAddress?._id === addr._id;
                                        return (
                                            <motion.div
                                                key={addr._id}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => setSelectedAddress(addr)}
                                                className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${isSelected
                                                        ? 'border-orange-500 bg-orange-50'
                                                        : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex gap-3 items-start">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${isSelected ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 border border-gray-200'
                                                            }`}>
                                                            {addr.label === 'Home' ? '🏠' : addr.label === 'Office' ? '🏢' : '📍'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm text-gray-800">{addr.label}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                                                {addr.street}, {addr.city} — {addr.pincode}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    No saved addresses. Please add one from your profile.
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Payment Methods */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.38 }}
                        className="bg-white rounded-2xl shadow-sm overflow-hidden"
                    >
                        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-blue-500" />
                            </div>
                            <h2 className="font-semibold text-gray-800">Payment Method</h2>
                        </div>

                        <div className="p-5 space-y-3">
                            {PAYMENT_METHODS.map((method) => {
                                const isSelected = selectedMethod === method.id;
                                return (
                                    <motion.div
                                        key={method.id}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`rounded-xl p-4 cursor-pointer transition-all border-2 flex items-center gap-4 ${isSelected
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${method.gradient} shadow-sm shrink-0`}>
                                            <method.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold text-sm text-gray-800">{method.label}</p>
                                                {method.badge && (
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${method.badgeColor}`}>
                                                        {method.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5">{method.description}</p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                                            }`}>
                                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Security + free delivery nudge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-700 text-sm">
                            <Shield className="w-5 h-5 shrink-0" />
                            <p>256-bit encrypted & secure checkout</p>
                        </div>
                        {deliveryFee > 0 && (
                            <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 text-amber-700 text-sm">
                                <Zap className="w-5 h-5 shrink-0" />
                                <p>Add ₹{500 - subtotal} more for <strong>free delivery</strong></p>
                            </div>
                        )}
                        {deliveryFee === 0 && items.length > 0 && (
                            <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-4 text-green-700 text-sm">
                                <Zap className="w-5 h-5 shrink-0" />
                                <p>🎉 <strong>Free delivery</strong> unlocked!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── RIGHT — Order summary + CTA ───────────────────────────────── */}
                <aside className="lg:col-span-2 space-y-4 sticky top-6 h-fit">
                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.42 }}
                        className="bg-white rounded-2xl shadow-sm overflow-hidden"
                    >
                        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-gray-400" /> Order Summary
                            </h2>
                            <Badge variant="secondary" className="text-xs">
                                {totalItems} item{totalItems !== 1 ? 's' : ''}
                            </Badge>
                        </div>

                        {/* Items list */}
                        <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
                            <AnimatePresence>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.swiggyItemId}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-3 px-5 py-3"
                                    >
                                        <img
                                            src={`${SWIGGY_BASE_URL}${item.image}`}
                                            alt={item.name}
                                            className="w-11 h-11 rounded-xl object-cover bg-gray-100 shrink-0"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-400">× {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-700 shrink-0">
                                            ₹{Math.floor((item.defaultPrice || item.price || 0) / 100) * item.quantity}
                                        </p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Bill breakdown */}
                        <div className="px-5 py-4 bg-gray-50 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Food subtotal</span>
                                <span className="font-medium text-gray-700">₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Delivery charge</span>
                                {deliveryFee === 0 ? (
                                    <span className="text-green-600 font-medium text-xs">FREE 🎉</span>
                                ) : (
                                    <span className="font-medium text-gray-700">₹{deliveryFee}</span>
                                )}
                            </div>
                            <Separator className="my-1" />
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800">Total Payable</span>
                                <span className="font-bold text-xl text-orange-500">₹{total}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing || !selectedMethod || !selectedAddress || items.length === 0}
                            className={`w-full h-14 rounded-2xl font-bold text-base flex items-center justify-between px-6 transition-all duration-200 ${isProcessing || !selectedMethod || !selectedAddress || items.length === 0
                                    ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                                    : 'bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <span>{isProcessing ? 'Processing...' : 'Place Order'}</span>
                            </div>
                            {!isProcessing && (
                                <div className="flex items-center gap-1 bg-white/20 rounded-xl px-3 py-1">
                                    <span className="font-bold text-sm">₹{total}</span>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            )}
                        </button>
                    </motion.div>

                    <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" />
                        By placing your order you agree to our Terms & Conditions
                    </p>
                </aside>

            </main>
        </div>
    );
}