import React, { useState, useEffect, useMemo } from 'react';
import {
    LayoutDashboard,
    Package,
    ArrowRightLeft,
    Warehouse,
    LogOut,
    Plus,
    Search,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    ClipboardList,
    Truck,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
    CheckCircle2,
    XCircle,
    User,
    Lock,
    ChevronRight
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp
} from 'firebase/firestore';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInAnonymously
} from 'firebase/auth';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

// --- Firebase Configuration (Placeholder) ---
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let db;
let auth;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

// --- Utility Functions ---
const cn = (...inputs) => twMerge(clsx(inputs));

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

// --- Mock Data ---
const MOCK_PRODUCTS = [
    { id: '1', name: 'MacBook Pro M3', sku: 'APP-MBP-M3', category: 'Electronics', uom: 'units', minStockLevel: 10, reorderPoint: 15, price: 1999 },
    { id: '2', name: 'Ergonomic Chair', sku: 'FUR-ERGO-01', category: 'Furniture', uom: 'units', minStockLevel: 5, reorderPoint: 10, price: 350 },
    { id: '3', name: 'Arabica Coffee Beans', sku: 'PAN-COF-001', category: 'Pantry', uom: 'kg', minStockLevel: 20, reorderPoint: 50, price: 25 },
    { id: '4', name: 'Wireless Mouse', sku: 'ACC-MSE-WL', category: 'Accessories', uom: 'units', minStockLevel: 15, reorderPoint: 25, price: 49 },
    { id: '5', name: '4K Monitor', sku: 'ELC-MON-4K', category: 'Electronics', uom: 'units', minStockLevel: 8, reorderPoint: 12, price: 499 },
];

const MOCK_WAREHOUSES = [
    { id: '1', name: 'Central Hub', location: 'New York, NY' },
    { id: '2', name: 'West Coast Depot', location: 'San Francisco, CA' },
    { id: '3', name: 'Euro Distribution', location: 'Berlin, Germany' },
];

const MOCK_LEDGER = [
    { id: '1', date: new Date(), type: 'Initial', productId: '1', warehouseId: '1', quantity: 50, referenceDoc: 'INIT-001', status: 'Done' },
    { id: '2', date: new Date(), type: 'Initial', productId: '2', warehouseId: '1', quantity: 20, referenceDoc: 'INIT-001', status: 'Done' },
    { id: '3', date: new Date(), type: 'Receipt', productId: '3', warehouseId: '2', quantity: 100, referenceDoc: 'PO-2024-001', status: 'Done' },
    { id: '4', date: new Date(), type: 'Delivery', productId: '1', warehouseId: '1', quantity: 5, referenceDoc: 'SO-2024-005', status: 'Done' },
];

// --- Components ---

// 1. Authentication
const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('admin@stockmaster.com');
    const [password, setPassword] = useState('password');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check for placeholder config or missing auth
        if (!auth || firebaseConfig.apiKey === "YOUR_API_KEY") {
            setTimeout(() => {
                onLogin({ uid: 'demo-user', email });
                toast.success('Welcome back, Admin! (Demo Mode)');
                setLoading(false);
            }, 800);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Successfully signed in!');
        } catch (err) {
            console.error("Login error:", err);
            try {
                await signInAnonymously(auth);
                toast.success('Signed in as Guest');
            } catch (anonErr) {
                console.error("Anonymous login error:", anonErr);
                // Fallback to demo if everything fails
                onLogin({ uid: 'demo-user', email });
                toast.success('Login failed, falling back to Demo Mode');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md p-8 mx-4 glass rounded-2xl border border-white/20 shadow-2xl"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg mb-4">
                        <Package className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">StockMaster</h1>
                    <p className="text-slate-500 mt-2 font-medium">Enterprise Inventory System</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-70 flex items-center justify-center"
                    >
                        {loading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign In to Dashboard
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Credentials Display */}
                <div className="mt-8 p-4 bg-blue-50/80 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 text-center">Demo Credentials</p>
                    <div className="flex justify-between text-sm text-blue-900">
                        <span className="font-medium">Email:</span>
                        <span className="font-mono">admin@stockmaster.com</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-900 mt-1">
                        <span className="font-medium">Password:</span>
                        <span className="font-mono">password</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// 2. Dashboard
const Dashboard = ({ products, stockData, ledger }) => {
    const kpiData = useMemo(() => {
        const totalProducts = products.length;
        const lowStockItems = products.filter(p => (stockData[p.id]?.total || 0) < p.minStockLevel).length;
        const pendingReceipts = ledger.filter(l => l.type === 'Receipt' && l.status === 'Draft').length;
        const pendingDeliveries = ledger.filter(l => l.type === 'Delivery' && l.status === 'Draft').length;
        const scheduledTransfers = ledger.filter(l => l.type === 'Transfer' && l.status === 'Draft').length;
        return { totalProducts, lowStockItems, pendingReceipts, pendingDeliveries, scheduledTransfers };
    }, [products, stockData, ledger]);

    const chartData = useMemo(() => {
        const categoryStock = {};
        products.forEach(p => {
            const stock = stockData[p.id]?.total || 0;
            categoryStock[p.category] = (categoryStock[p.category] || 0) + stock;
        });
        return Object.entries(categoryStock).map(([name, value]) => ({ name, value }));
    }, [products, stockData]);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const KPICard = ({ title, value, icon: Icon, gradient, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={cn("p-6 rounded-2xl shadow-lg relative overflow-hidden group", gradient)}
        >
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <Icon className="w-24 h-24" />
            </div>
            <div className="relative z-10">
                <div className="p-3 bg-white/20 w-fit rounded-xl backdrop-blur-sm mb-4">
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-blue-100 font-medium text-sm">{title}</p>
                <h3 className="text-4xl font-bold mt-1">{value}</h3>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1">Real-time inventory metrics and performance</p>
                </div>
                <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <KPICard title="Total Products" value={kpiData.totalProducts} icon={Package} gradient="card-gradient-1" delay={0.1} />
                <KPICard title="Low Stock Alerts" value={kpiData.lowStockItems} icon={AlertTriangle} gradient="card-gradient-4" delay={0.2} />
                <KPICard title="Pending Receipts" value={kpiData.pendingReceipts} icon={TrendingUp} gradient="card-gradient-2" delay={0.3} />
                <KPICard title="Pending Deliveries" value={kpiData.pendingDeliveries} icon={Truck} gradient="card-gradient-3" delay={0.4} />
                <KPICard title="Internal Transfers" value={kpiData.scheduledTransfers} icon={ArrowRightLeft} gradient="bg-gradient-to-br from-purple-500 to-purple-600 text-white" delay={0.5} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                        Stock Distribution by Category
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <div className="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
                        Inventory Composition
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// 3. Product Management
const ProductList = ({ products, stockData, onAddProduct, warehouses }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', sku: '', category: '', uom: 'units', minStockLevel: 0, reorderPoint: 0, initialStock: 0, initialWarehouse: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [warehouseFilter, setWarehouseFilter] = useState('All');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddProduct({
            ...newProduct,
            minStockLevel: Number(newProduct.minStockLevel),
            reorderPoint: Number(newProduct.reorderPoint),
            initialStock: Number(newProduct.initialStock),
            initialWarehouse: newProduct.initialWarehouse
        });
        setIsModalOpen(false);
        setNewProduct({ name: '', sku: '', category: '', uom: 'units', minStockLevel: 0, reorderPoint: 0, initialStock: 0, initialWarehouse: '' });
        toast.success('Product added successfully');
    };

    // Get unique categories
    const categories = ['All', ...new Set(products.map(p => p.category))];

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;

        let matchesWarehouse = true;
        if (warehouseFilter !== 'All') {
            const stockInfo = stockData[product.id] || { warehouses: {} };
            matchesWarehouse = stockInfo.warehouses[warehouseFilter] > 0;
        }

        return matchesSearch && matchesCategory && matchesWarehouse;
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Product Catalog</h1>
                    <p className="text-slate-500 mt-1">Manage your inventory items and stock levels</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 flex items-center font-medium transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Product
                </motion.button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            value={warehouseFilter}
                            onChange={(e) => setWarehouseFilter(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                        >
                            <option value="All">All Warehouses</option>
                            {warehouses.map(wh => (
                                <option key={wh.id} value={wh.id}>{wh.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product Info</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">UoM</th>
                                <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Level</th>
                                <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Reorder Pt.</th>
                                <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredProducts.map((product, idx) => {
                                const stockInfo = stockData[product.id] || { total: 0, warehouses: {} };
                                const stock = stockInfo.total;
                                const isLowStock = stock < product.minStockLevel;
                                return (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={product.id}
                                        className="hover:bg-slate-50/80 transition-colors group"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-100 transition-colors">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{product.name}</div>
                                                    <div className="text-xs text-slate-500 font-mono mt-0.5">{product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-600">{product.uom}</td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="font-mono font-bold text-slate-700">{stock}</div>
                                            <div className="text-[10px] text-slate-400 mt-1 space-y-0.5">
                                                {Object.entries(stockInfo.warehouses).map(([wid, qty]) => {
                                                    if (qty === 0) return null;
                                                    return <div key={wid}>WH-{wid}: {qty}</div>
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right font-mono text-sm text-slate-500">
                                            {product.reorderPoint || '-'}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            {isLowStock ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    In Stock
                                                </span>
                                            )}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Product Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-xl font-bold text-slate-800">Add New Product</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. Wireless Keyboard"
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">SKU</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. KEY-WL-01"
                                            value={newProduct.sku}
                                            onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. Electronics"
                                            value={newProduct.category}
                                            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Unit of Measure</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. pcs, kg"
                                            value={newProduct.uom}
                                            onChange={e => setNewProduct({ ...newProduct, uom: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Min Stock Level</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="0"
                                            value={newProduct.minStockLevel}
                                            onChange={e => setNewProduct({ ...newProduct, minStockLevel: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Reorder Point</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="0"
                                            value={newProduct.reorderPoint}
                                            onChange={e => setNewProduct({ ...newProduct, reorderPoint: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Initial Stock (Optional)</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="0"
                                            value={newProduct.initialStock}
                                            onChange={e => setNewProduct({ ...newProduct, initialStock: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Initial Warehouse (Optional)</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                                            value={newProduct.initialWarehouse}
                                            onChange={e => setNewProduct({ ...newProduct, initialWarehouse: e.target.value })}
                                        >
                                            <option value="">Select Warehouse</option>
                                            {warehouses.map(wh => (
                                                <option key={wh.id} value={wh.id}>{wh.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all"
                                    >
                                        Save Product
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// 4. Operations
const Operations = ({ products, warehouses, onTransaction }) => {
    const [activeTab, setActiveTab] = useState('receipt');
    const [formData, setFormData] = useState({
        productId: '',
        warehouseId: '',
        targetWarehouseId: '',
        quantity: '',
        referenceDoc: '',
        partner: '',
        status: 'Done'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const typeMap = {
            receipt: 'Receipt',
            delivery: 'Delivery',
            transfer: 'Transfer',
            adjustment: 'Adjustment'
        };

        onTransaction({
            type: typeMap[activeTab],
            ...formData,
            quantity: Number(formData.quantity),
            date: new Date(),
            status: formData.status
        });

        setFormData({
            productId: '',
            warehouseId: '',
            targetWarehouseId: '',
            quantity: '',
            referenceDoc: '',
            partner: '',
            status: 'Done'
        });
        toast.success('Transaction recorded successfully!');
    };

    const tabs = [
        { id: 'receipt', label: 'Receipt', icon: ArrowDownLeft, color: 'bg-emerald-500' },
        { id: 'delivery', label: 'Delivery', icon: ArrowUpRight, color: 'bg-blue-500' },
        { id: 'transfer', label: 'Transfer', icon: ArrowRightLeft, color: 'bg-amber-500' },
        { id: 'adjustment', label: 'Adjustment', icon: RefreshCw, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Operations Center</h1>
                <p className="text-slate-500 mt-1">Process stock movements and adjustments</p>
            </div>

            <div className="flex flex-wrap gap-4">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center px-6 py-4 rounded-xl transition-all duration-300 border",
                                isActive
                                    ? "bg-white border-blue-500 shadow-lg scale-105 ring-1 ring-blue-500"
                                    : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md text-slate-600"
                            )}
                        >
                            <div className={cn("p-2 rounded-lg mr-3 text-white", tab.color)}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={cn("font-bold", isActive ? "text-slate-800" : "text-slate-500")}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-3xl"
            >
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {activeTab === 'receipt' && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Supplier Name</label>
                            <input
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Global Tech Supplies"
                                value={formData.partner}
                                onChange={e => setFormData({ ...formData, partner: e.target.value })}
                            />
                        </div>
                    )}

                    {activeTab === 'delivery' && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Customer Name</label>
                            <input
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Acme Corp"
                                value={formData.partner}
                                onChange={e => setFormData({ ...formData, partner: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Product</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.productId}
                                onChange={e => setFormData({ ...formData, productId: e.target.value })}
                                required
                            >
                                <option value="">Select Product</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {activeTab === 'transfer' ? 'Source Warehouse' : 'Warehouse'}
                            </label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.warehouseId}
                                onChange={e => setFormData({ ...formData, warehouseId: e.target.value })}
                                required
                            >
                                <option value="">Select Warehouse</option>
                                {warehouses.map(w => (
                                    <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
                            </select>
                        </div>

                        {activeTab === 'transfer' && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Target Warehouse</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={formData.targetWarehouseId}
                                    onChange={e => setFormData({ ...formData, targetWarehouseId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Target</option>
                                    {warehouses.map(w => (
                                        <option key={w.id} value={w.id}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            required
                        >
                            <option value="Draft">Draft</option>
                            <option value="Waiting">Waiting</option>
                            <option value="Ready">Ready</option>
                            <option value="Done">Done</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Reference Document</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. PO-001, INV-001"
                            value={formData.referenceDoc}
                            onChange={e => setFormData({ ...formData, referenceDoc: e.target.value })}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all"
                        >
                            Confirm Transaction
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// 5. Warehouse Management
const WarehouseList = ({ warehouses, onAddWarehouse }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddWarehouse(newWarehouse);
        setIsModalOpen(false);
        setNewWarehouse({ name: '', location: '' });
        toast.success('Warehouse added successfully');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Warehouse Network</h1>
                    <p className="text-slate-500 mt-1">Manage storage locations and distribution centers</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 flex items-center font-medium transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Warehouse
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {warehouses.map((w, idx) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        key={w.id}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                                <Warehouse className="w-8 h-8 text-indigo-600" />
                            </div>
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">ACTIVE</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{w.name}</h3>
                        <p className="text-slate-500 flex items-center text-sm">
                            <Truck className="w-4 h-4 mr-1" />
                            {w.location}
                        </p>
                        <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between text-sm text-slate-400">
                            <span>Capacity: 85%</span>
                            <span>Zones: 4</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Add Warehouse Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-xl font-bold text-slate-800">Add New Warehouse</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Warehouse Name</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. North Distribution Center"
                                        value={newWarehouse.name}
                                        onChange={e => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. Chicago, IL"
                                        value={newWarehouse.location}
                                        onChange={e => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all"
                                    >
                                        Save Warehouse
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};



// 6. Move History
const MoveHistory = ({ ledger, products, warehouses }) => {
    const [filterType, setFilterType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const getProductName = (id) => products.find(p => p.id === id)?.name || id;
    const getWarehouseName = (id) => warehouses.find(w => w.id === id)?.name || id;

    const filteredLedger = ledger.filter(entry => {
        const matchesType = filterType === 'All' || entry.type === filterType;
        const productName = getProductName(entry.productId).toLowerCase();
        const refDoc = (entry.referenceDoc || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        const matchesSearch = productName.includes(search) || refDoc.includes(search);
        return matchesType && matchesSearch;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Stock Ledger</h1>
                    <p className="text-slate-500 mt-1">Complete history of all stock movements</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none w-64"
                            placeholder="Search product or reference..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Receipt">Receipts</option>
                        <option value="Delivery">Deliveries</option>
                        <option value="Transfer">Transfers</option>
                        <option value="Adjustment">Adjustments</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Warehouse</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLedger.sort((a, b) => b.date - a.date).map((entry, idx) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.02 }}
                                    key={entry.id}
                                    className="hover:bg-slate-50/80 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(entry.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{entry.referenceDoc || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2 py-1 rounded-md text-xs font-bold uppercase",
                                            entry.type === 'Receipt' && "bg-emerald-100 text-emerald-700",
                                            entry.type === 'Delivery' && "bg-blue-100 text-blue-700",
                                            entry.type.includes('Transfer') && "bg-amber-100 text-amber-700",
                                            entry.type === 'Adjustment' && "bg-purple-100 text-purple-700",
                                            entry.type === 'Initial' && "bg-slate-100 text-slate-700"
                                        )}>
                                            {entry.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{getProductName(entry.productId)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{getWarehouseName(entry.warehouseId)}</td>
                                    <td className={cn(
                                        "px-6 py-4 text-right font-mono font-bold",
                                        entry.quantity > 0 ? "text-emerald-600" : "text-red-600"
                                    )}>
                                        {entry.quantity > 0 ? '+' : ''}{entry.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="flex items-center justify-end text-xs font-medium text-slate-500">
                                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                                            {entry.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// 7. User Profile
const UserProfile = ({ user, onUpdateProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        gender: user.gender || 'prefer-not-to-say',
        role: user.role || 'Administrator'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateProfile(profileData);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
    };

    const handleCancel = () => {
        setProfileData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            city: user.city || '',
            country: user.country || '',
            gender: user.gender || 'prefer-not-to-say',
            role: user.role || 'Administrator'
        });
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
                    <p className="text-slate-500 mt-1">Manage your account information</p>
                </div>
                {!isEditing && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 flex items-center font-medium transition-colors"
                    >
                        <User className="w-5 h-5 mr-2" />
                        Edit Profile
                    </motion.button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold shadow-lg">
                            {(profileData.name || profileData.email || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{profileData.name || 'User'}</h2>
                            <p className="text-blue-100 mt-1">{profileData.role}</p>
                            <p className="text-blue-100 text-sm mt-1">{profileData.email}</p>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                placeholder="Enter your full name"
                                value={profileData.name}
                                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                placeholder="your.email@example.com"
                                value={profileData.email}
                                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                placeholder="+1 (555) 123-4567"
                                value={profileData.phone}
                                onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                            <select
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 bg-white"
                                value={profileData.gender}
                                onChange={e => setProfileData({ ...profileData, gender: e.target.value })}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Street Address</label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                placeholder="123 Main Street, Apt 4B"
                                value={profileData.address}
                                onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                placeholder="New York"
                                value={profileData.city}
                                onChange={e => setProfileData({ ...profileData, city: e.target.value })}
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                placeholder="United States"
                                value={profileData.country}
                                onChange={e => setProfileData({ ...profileData, country: e.target.value })}
                            />
                        </div>

                        {/* Role (Read-only) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                            <input
                                type="text"
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none"
                                value={profileData.role}
                            />
                            <p className="text-xs text-slate-500 mt-1">Contact your administrator to change your role</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function StockMaster() {
    const [user, setUser] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard');
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [warehouses, setWarehouses] = useState(MOCK_WAREHOUSES);
    const [ledger, setLedger] = useState(MOCK_LEDGER);

    // Auth Listener
    useEffect(() => {
        if (auth) {
            const unsubscribe = onAuthStateChanged(auth, (u) => {
                setUser(u);
            });
            return unsubscribe;
        } else {
            const demoUser = sessionStorage.getItem('demoUser');
            if (demoUser) setUser(JSON.parse(demoUser));
        }
    }, []);

    // Calculate Stock Logic (Per Warehouse)
    const stockData = useMemo(() => {
        const stock = {}; // {productId: {total: 0, warehouses: {wid: qty } } }

        // Initialize
        products.forEach(p => {
            stock[p.id] = { total: 0, warehouses: {} };
        });

        ledger.forEach(entry => {
            if (entry.status !== 'Done') return;
            const qty = Number(entry.quantity);
            const pid = entry.productId;
            const wid = entry.warehouseId;

            if (!stock[pid]) stock[pid] = { total: 0, warehouses: {} };

            // All quantities are already signed correctly:
            // - Receipts: positive (adds stock)
            // - Deliveries: negative (removes stock)
            // - Transfers: Transfer Out is negative, Transfer In is positive
            // - Adjustments: can be positive or negative
            // - Initial: positive
            const change = qty;

            stock[pid].warehouses[wid] = (stock[pid].warehouses[wid] || 0) + change;
            stock[pid].total += change;
        });
        return stock;
    }, [ledger, products]);

    const handleTransaction = (transaction) => {
        const newEntry = { ...transaction, id: Date.now().toString() };
        if (transaction.type === 'Transfer') {
            const sourceEntry = { ...newEntry, quantity: -transaction.quantity, warehouseId: transaction.warehouseId, type: 'Transfer Out' };
            const targetEntry = { ...newEntry, quantity: transaction.quantity, warehouseId: transaction.targetWarehouseId, type: 'Transfer In', id: Date.now().toString() + '_2' };
            setLedger([...ledger, sourceEntry, targetEntry]);
        } else if (transaction.type === 'Delivery') {
            // Deliveries should reduce stock, so store as negative quantity
            setLedger([...ledger, { ...newEntry, quantity: -transaction.quantity }]);
        } else {
            setLedger([...ledger, newEntry]);
        }
    };

    const handleAddProduct = (product) => {
        const newProduct = { ...product, id: Date.now().toString() };
        setProducts([...products, newProduct]);

        // Create initial stock ledger entry if initial stock is provided
        if (product.initialStock > 0 && product.initialWarehouse) {
            const initialEntry = {
                id: Date.now().toString() + '_init',
                date: new Date(),
                type: 'Initial',
                productId: newProduct.id,
                warehouseId: product.initialWarehouse,
                quantity: product.initialStock,
                referenceDoc: 'INIT-' + newProduct.sku,
                status: 'Done'
            };
            setLedger([...ledger, initialEntry]);
        }
    };

    const handleAddWarehouse = (warehouse) => {
        const newWarehouse = { ...warehouse, id: Date.now().toString() };
        setWarehouses([...warehouses, newWarehouse]);
    };

    const handleLogin = (userData) => {
        setUser(userData);
        sessionStorage.setItem('demoUser', JSON.stringify(userData));
    };

    const handleUpdateProfile = (profileData) => {
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        sessionStorage.setItem('demoUser', JSON.stringify(updatedUser));
    };

    const handleLogout = () => {
        if (auth) signOut(auth);
        setUser(null);
        sessionStorage.removeItem('demoUser');
    };

    if (!user) {
        return (
            <>
                <Toaster position="top-center" />
                <Login onLogin={handleLogin} />
            </>
        );
    }

    const NavItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setCurrentView(id)}
            className={cn(
                "flex items-center w-full px-4 py-3.5 rounded-xl transition-all duration-200 font-medium mb-1",
                currentView === id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
        >
            <Icon className="w-5 h-5 mr-3" />
            {label}
            {currentView === id && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
        </button>
    );

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            <Toaster position="top-right" toastOptions={{ style: { borderRadius: '10px', background: '#333', color: '#fff' } }} />

            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
                <div className="p-8">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">StockMaster</span>
                    </div>

                    <nav className="space-y-1">
                        <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <NavItem id="products" icon={Package} label="Products" />
                        <NavItem id="operations" icon={ArrowRightLeft} label="Operations" />
                        <NavItem id="warehouses" icon={Warehouse} label="Warehouses" />
                        <NavItem id="history" icon={ClipboardList} label="Move History" />
                        <NavItem id="profile" icon={User} label="My Profile" />
                    </nav>
                </div>

                <div className="mt-auto p-6 m-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold shadow-lg">
                            {user.email ? user.email[0].toUpperCase() : 'U'}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-bold truncate text-white">{user.email || 'Guest User'}</p>
                            <p className="text-xs text-slate-400">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50 relative">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50 to-slate-50 -z-10"></div>

                <div className="p-10 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentView}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {currentView === 'dashboard' && <Dashboard products={products} stockData={stockData} ledger={ledger} />}
                            {currentView === 'products' && <ProductList products={products} stockData={stockData} onAddProduct={handleAddProduct} warehouses={warehouses} />}
                            {currentView === 'operations' && <Operations products={products} warehouses={warehouses} onTransaction={handleTransaction} />}
                            {currentView === 'warehouses' && <WarehouseList warehouses={warehouses} onAddWarehouse={handleAddWarehouse} />}
                            {currentView === 'history' && <MoveHistory ledger={ledger} products={products} warehouses={warehouses} />}
                            {currentView === 'profile' && <UserProfile user={user} onUpdateProfile={handleUpdateProfile} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
