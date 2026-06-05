import { getMyPayments } from '@/slices/UserSlice';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard,
    Clock,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Wallet,
    Truck,
    ChevronDown,
    ChevronUp,
    Search,
    AlertTriangle,
    ShoppingBag,
    MapPin,
} from "lucide-react";

const SWIGGY_BASE_URL =
    "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_200,c_fit/";

// ─── Shimmer Components ──────────────────────────────────────────────
const ShimmerKPI = () => (
    <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-gray-200 animate-pulse">
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-28 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
        </div>
    </div>
);

const ShimmerPaymentRow = () => (
    <div className="border border-gray-100 rounded-xl overflow-hidden animate-pulse">
        <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
            <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const ShimmerToolbar = () => (
    <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-1 flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
        </div>
        <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
);

// ─── KPI Card ──────────────────────────────────────────────────────────
const KPICard = ({
    title,
    value,
    sub,
    icon: Icon,
    borderColor,
    textColor,
    bgIcon,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${borderColor} hover:shadow-md transition-shadow`}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm mb-1">{title}</p>
                <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
            </div>
            <div className={`${bgIcon} p-3 rounded-full`}>
                <Icon className={`w-6 h-6 ${textColor}`} />
            </div>
        </div>
    </motion.div>
);

// ─── Status badge ──────────────────────────────────────────────────────────────
const statusConfig = {
    pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-700",
        dot: "bg-yellow-400",
    },
    paid: {
        label: "Paid",
        color: "bg-green-100 text-green-700",
        dot: "bg-green-500",
    },
    failed: {
        label: "Failed",
        color: "bg-red-100 text-red-700",
        dot: "bg-red-500",
    },
    refunded: {
        label: "Refunded",
        color: "bg-blue-100 text-blue-700",
        dot: "bg-blue-500",
    },
};

const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] ?? statusConfig.pending;
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

// ─── Method badge ──────────────────────────────────────────────────────────────
const MethodBadge = ({ method }) => (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
        {method === "esewa" ? (
            <Wallet className="w-3 h-3" />
        ) : (
            <Truck className="w-3 h-3" />
        )}
        {method === "esewa" ? "eSewa" : "COD"}
    </span>
);

// ─── Payment Row ───────────────────────────────────────────────────────────────
const PaymentRow = ({ payment }) => {
    const [expanded, setExpanded] = useState(false); // Changed to false for better UX

    const restaurants = payment?.order?.restaurants;
    const orderId = payment?.order?._id;

    const firstRestaurant = payment?.order?.restaurants?.[0];
    const restaurantSummary = restaurants?.length > 1
        ? `${firstRestaurant?.restaurantName} +${restaurants.length - 1} more`
        : (firstRestaurant?.restaurantName ?? "—");

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
        >
            <div
                className="flex items-center gap-4 p-4 cursor-pointer select-none"
                onClick={() => setExpanded((v) => !v)}
            >
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${payment.status === "paid"
                            ? "bg-green-100"
                            : payment.status === "failed"
                                ? "bg-red-100"
                                : payment.status === "refunded"
                                    ? "bg-blue-100"
                                    : "bg-yellow-100"
                        }`}
                >
                    {payment.status === "paid" && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {payment.status === "failed" && <XCircle className="w-5 h-5 text-red-500" />}
                    {payment.status === "refunded" && <RefreshCw className="w-5 h-5 text-blue-500" />}
                    {payment.status === "pending" && <Clock className="w-5 h-5 text-yellow-500" />}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                        Order #{orderId?.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {restaurantSummary} &middot;{" "}
                        {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>
                </div>

                <MethodBadge method={payment.method} />
                <StatusBadge status={payment.status} />

                <p
                    className={`font-bold text-base min-w-[70px] text-right
                    ${payment.status === "refunded"
                            ? "text-blue-600"
                            : payment.status === "failed"
                                ? "text-red-500"
                                : "text-gray-800"
                        }`}
                >
                    ₹{payment.amount?.toLocaleString("en-IN") ?? 0}
                </p>

                <button className="text-gray-400 hover:text-gray-600 transition">
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 border-t border-gray-100"
                    >
                        <div className="px-4 pt-3 pb-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs border-b border-gray-100">
                            <div>
                                <p className="text-gray-400 mb-0.5">Transaction ID</p>
                                <p className="font-mono font-semibold text-gray-700 truncate">
                                    {payment.transactionId ?? "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-0.5">Order ID</p>
                                <p className="font-mono font-semibold text-gray-700 truncate">
                                    {orderId?.slice(-12).toUpperCase()}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-0.5">Placed At</p>
                                <p className="font-semibold text-gray-700">
                                    {new Date(payment.createdAt).toLocaleString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            {payment.paidAt && (
                                <div>
                                    <p className="text-gray-400 mb-0.5">Paid At</p>
                                    <p className="font-semibold text-green-700">
                                        {new Date(payment.paidAt).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            )}
                            {payment.failedAt && (
                                <div>
                                    <p className="text-gray-400 mb-0.5">Failed At</p>
                                    <p className="font-semibold text-red-600">
                                        {new Date(payment.failedAt).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-3 space-y-4">
                            {restaurants?.map((restaurant) => (
                                <div key={restaurant._id}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <ShoppingBag className="w-3.5 h-3.5 text-orange-500" />
                                            <span className="font-semibold text-sm text-gray-800">
                                                {restaurant.restaurantName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <MapPin className="w-3 h-3" />
                                            {restaurant.locality}, {restaurant.city}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {restaurant.items?.map((item) => (
                                            <div key={item._id} className="flex items-center gap-3">
                                                {item.image && (
                                                    <img
                                                        src={`${SWIGGY_BASE_URL}${item.image}`}
                                                        alt={item.name}
                                                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.style.display = "none";
                                                        }}
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-700 truncate">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        ₹{item.price} × {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="text-xs font-bold text-gray-700 flex-shrink-0">
                                                    ₹{item.price * item.quantity}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                        <span className="text-xs text-gray-400">Restaurant Total</span>
                                        <span className="text-xs font-bold text-gray-700">
                                            ₹{restaurant.restaurantTotal}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between items-center pt-2 border-t-2 border-gray-200">
                                <span className="text-sm font-semibold text-gray-700">Amount Paid</span>
                                <span className={`text-sm font-bold
                                    ${payment.status === "refunded"
                                        ? "text-blue-600"
                                        : payment.status === "failed"
                                            ? "text-red-500"
                                            : "text-orange-600"
                                    }`}
                                >
                                    ₹{payment.amount?.toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── Main PaymentPage ──────────────────────────────────────────────────────────
export default function PaymentPage() {
    const { user, authLoading, paymentLoading } = useSelector(state => state.user);
    const { orders, loading, ordersFetched } = useSelector((state) => state.order);

    const dispatch = useDispatch();

    useEffect(() => {

        if (paymentLoading) {

            dispatch(getMyPayments());

        }
    }, [orders?.length, dispatch]);


    const paymentDetails = user?.payment;

    const {
        payment: payments = [],
        pending = {},
        paid = {},
        failed = {},
        refund = {},
    } = paymentDetails || {};

    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const kpis = [
        {
            title: "Total Paid",
            value: `₹${paid?.totalPaid?.toLocaleString("en-IN") || 0}`,
            sub: `${paid?.noofTranscationInTotalPaid || 0} transactions`,
            icon: CheckCircle2,
            borderColor: "border-green-500",
            textColor: "text-green-600",
            bgIcon: "bg-green-50",
        },
        {
            title: "Pending",
            value: `₹${pending?.pendingPay?.toLocaleString("en-IN") || 0}`,
            sub: `${pending?.noOftransactioniInPendingPay || 0} awaiting`,
            icon: Clock,
            borderColor: "border-yellow-400",
            textColor: "text-yellow-600",
            bgIcon: "bg-yellow-50",
        },
        {
            title: "Failed",
            value: failed?.noOfFailed || 0,
            sub: `₹${failed?.failedAmount?.toLocaleString("en-IN") || 0} lost`,
            icon: AlertTriangle,
            borderColor: "border-red-500",
            textColor: "text-red-600",
            bgIcon: "bg-red-50",
        },
        {
            title: "Refunded",
            value: `₹${refund?.refundedAmout?.toLocaleString("en-IN") || 0}`,
            sub: `${refund?.noOfRefund || 0} refund${refund?.noOfRefund !== 1 ? "s" : ""}`,
            icon: RefreshCw,
            borderColor: "border-blue-500",
            textColor: "text-blue-600",
            bgIcon: "bg-blue-50",
        },
    ];

    const filteredPayments = payments.filter((p) => {
        const matchFilter = filter === "all" || p.status === filter;
        const matchSearch =
            !search ||
            p.order?._id?.toLowerCase().includes(search.toLowerCase()) ||
            p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
            p.order?.restaurants?.some((r) =>
                r.restaurantName.toLowerCase().includes(search.toLowerCase()),
            );
        return matchFilter && matchSearch;
    });

    const filterTabs = ["all", "paid", "pending", "failed", "refunded"];
    const countByStatus = (s) => payments.filter((p) => p.status === s).length;

    // Show loading state while auth is loading or when we're waiting for initial data
    // if (authLoading || (user && !user.payment && payments.length === 0)) {
    //     return (
    //         <div className="w-full min-h-full bg-gray-50 p-2">
    //             <div className="mb-3">
    //                 <div className="h-9 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
    //                 <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
    //             </div>

    //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
    //                 <ShimmerKPI />
    //                 <ShimmerKPI />
    //                 <ShimmerKPI />
    //                 <ShimmerKPI />
    //             </div>

    //             <div className="bg-white rounded-2xl shadow-md overflow-hidden">
    //                 <ShimmerToolbar />
    //                 <div className="p-4 space-y-3">
    //                     <ShimmerPaymentRow />
    //                     <ShimmerPaymentRow />
    //                     <ShimmerPaymentRow />
    //                     <ShimmerPaymentRow />
    //                     <ShimmerPaymentRow />
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="w-full min-h-full bg-gray-50 p-2">


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                    >
                        <KPICard {...kpi} />
                    </motion.div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition
                                    ${filter === tab
                                        ? "bg-orange-500 text-white shadow-sm"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {tab === "all"
                                    ? `All (${payments.length})`
                                    : `${tab} (${countByStatus(tab)})`}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search order, txn ID, restaurant…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 w-64"
                        />
                    </div>
                </div>

                <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                    <AnimatePresence initial={false}>
                        {filteredPayments.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">No payments found</p>
                                {search && (
                                    <p className="text-xs mt-1">
                                        Try searching by restaurant name or transaction ID
                                    </p>
                                )}
                            </div>
                        ) : (
                            filteredPayments.map((p) => <PaymentRow key={p._id} payment={p} />)
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}