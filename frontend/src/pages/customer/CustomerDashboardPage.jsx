import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Gift,
} from 'lucide-react';
import { CustomerAffiliateTab } from '../../components/customer/CustomerAffiliateTab';

export function CustomerDashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'affiliate'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/account');
      return;
    }

    async function fetchOrders() {
      try {
        const res = await fetch('/api/v1/orders', {
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setOrders(json.data || []);
          }
        }
      } catch (err) {
        console.error('Failed to load customer orders:', err);
        setErrorOrders('Could not load order history.');
      } finally {
        setLoadingOrders(false);
      }
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading || (!user && !errorOrders)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-3 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-bold text-gray-500">Loading customer profile...</p>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const activeOrdersCount = orders.filter((o) => ['PENDING', 'PROCESSING', 'SHIPPED'].includes(o.order_status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Top Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-softGray border border-brand-accent/20 flex items-center justify-center text-brand-accent font-black text-xl shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-brand-graphite">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                {user?.role || 'Customer'}
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">{user?.email}</p>
            {user?.phone && <p className="text-xs font-mono text-gray-400 mt-0.5">{user.phone}</p>}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-brand-graphite text-white shadow-sm'
              : 'text-gray-500 hover:text-brand-graphite hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders</span>
          <span className="px-2 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('affiliate')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'affiliate'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white shadow-md shadow-purple-500/20'
              : 'text-gray-500 hover:text-[#8B5CF6] hover:bg-purple-50'
          }`}
        >
          <Gift className="w-4 h-4 text-[#00F0FF]" />
          <span>Creator & Affiliate Alliance</span>
          <span className="px-2 py-0.5 rounded-full text-[9px] bg-[#00F0FF]/20 text-[#00F0FF] font-bold uppercase tracking-wider">
            Earn 5%
          </span>
        </button>
      </div>

      {activeTab === 'affiliate' ? (
        <CustomerAffiliateTab />
      ) : (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
              <span className="text-xs text-gray-400 block mb-1">Total Orders</span>
              <span className="text-2xl font-black text-brand-graphite">{orders.length}</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
              <span className="text-xs text-gray-400 block mb-1">Active Shipments</span>
              <span className="text-2xl font-black text-brand-accent">{activeOrdersCount}</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
              <span className="text-xs text-gray-400 block mb-1">Total Lifetime Spend</span>
              <span className="text-2xl font-black text-brand-graphite font-mono">
                ৳{totalSpent.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-brand-graphite tracking-tight">Order History</h2>
                <p className="text-xs text-brand-muted">Hardware dispatch status and payment records</p>
              </div>
          <Link
            to="/products"
            className="text-xs font-bold text-brand-accent hover:underline inline-flex items-center gap-1"
          >
            Browse Products
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingOrders ? (
          <div className="py-12 text-center text-xs text-gray-400">Loading order records...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-600">No Orders Yet</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              You haven't placed any orders with LazyForge yet. When you do, they will appear here.
            </p>
            <Link
              to="/products"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-accent text-white"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden text-xs">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-black text-brand-graphite">{order.order_number}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                        order.order_status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.order_status === 'CANCELLED'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {order.order_status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[11px]">
                    Placed on{' '}
                    {new Date(order.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    • {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online (SSLCommerz)'}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <span className="font-mono font-black text-sm text-brand-graphite block">
                      ৳{Number(order.total_amount).toLocaleString()}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        order.payment_status === 'PAID'
                          ? 'text-emerald-600'
                          : order.payment_status === 'PENDING'
                          ? 'text-amber-600'
                          : 'text-red-500'
                      }`}
                    >
                      Payment: {order.payment_status}
                    </span>
                  </div>

                  <Link
                    to={`/order-confirmation/${order.order_number}`}
                    className="p-2 rounded-xl bg-brand-softGray hover:bg-brand-accent hover:text-white text-gray-600 transition-colors"
                    title="View Order Details & Invoice"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )}
</div>
);
}
