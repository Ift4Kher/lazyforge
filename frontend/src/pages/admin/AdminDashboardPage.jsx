import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Layers,
  AlertTriangle,
  ArrowUpRight,
  Database,
  Cpu,
  RefreshCw,
  Users,
  CheckCircle2,
  Clock,
  Truck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatBDT } from '../../utils/currency';

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Failed to fetch telemetry');
      }
    } catch (err) {
      setError('Network communication failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-accent font-bold">
            Administrative Operations Center
          </span>
          <h1 className="text-2xl font-extrabold text-brand-graphite mt-1">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Role: <span className="text-brand-graphite font-mono font-bold">{user?.role || 'admin'}</span> | Centralized commerce, stock alerts, and campaign telemetry.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-brand-border text-brand-graphite hover:text-brand-accent hover:border-brand-accent transition-colors"
            title="Refresh telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-accent' : ''}`} />
          </button>
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-softGray border border-brand-border text-brand-graphite hover:border-brand-accent hover:text-brand-accent transition-all"
          >
            Manage Catalog
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm transition-all"
          >
            View Orders
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-brand-muted mb-3">
            <span className="text-xs font-semibold">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-brand-graphite">
            {isLoading ? '...' : formatBDT(stats?.orders?.revenue || 0)}
          </div>
          <p className="text-[11px] text-brand-muted mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">{stats?.orders?.total || 0} Total Orders</span>
          </p>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-brand-muted mb-3">
            <span className="text-xs font-semibold">Pending / Processing</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-brand-graphite">
            {isLoading ? '...' : (stats?.orders?.pending || 0) + (stats?.orders?.processing || 0)}
          </div>
          <p className="text-[11px] text-brand-muted mt-1">
            COD & verified transactions awaiting dispatch
          </p>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-brand-muted mb-3">
            <span className="text-xs font-semibold">Active Products</span>
            <div className="w-8 h-8 rounded-lg bg-brand-softGray border border-brand-border flex items-center justify-center text-brand-accent">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-brand-graphite">
            {isLoading ? '...' : stats?.products?.active || 0}
          </div>
          <p className="text-[11px] text-brand-muted mt-1">
            {stats?.products?.featured || 0} Featured on storefront
          </p>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-brand-muted mb-3">
            <span className="text-xs font-semibold">System Health</span>
            <div className="w-8 h-8 rounded-lg bg-brand-softGray border border-brand-border flex items-center justify-center text-emerald-600">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 flex items-center gap-2">
            <span>ONLINE</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <p className="text-[11px] text-brand-muted mt-1">
            MySQL / MariaDB Connection Live
          </p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {stats?.lowStock && stats.lowStock.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Low Stock Alerts ({stats.lowStock.length} items &le; 5 units)</span>
            </div>
            <Link to="/admin/products" className="text-xs font-semibold text-brand-accent hover:underline">
              Manage in Catalog &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.lowStock.map((item) => (
              <div
                key={item.variant_id}
                className="bg-white border border-brand-border rounded-xl p-4 flex items-center justify-between shadow-sm"
              >
                <div>
                  <h4 className="text-xs font-bold text-brand-graphite line-clamp-1">{item.product_name}</h4>
                  <p className="text-[10px] text-brand-muted font-mono">{item.sku} ({item.variant_name})</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600">
                  {item.stock_quantity} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Stream */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-brand-graphite">Recent Orders</h3>
            <p className="text-xs text-brand-muted mt-0.5">Real-time incoming customer transactions</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-softGray border-b border-brand-border text-brand-muted font-mono uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-softGray/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brand-graphite">
                      {order.order_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-brand-graphite">{order.customer_name}</div>
                      <div className="text-[10px] text-brand-muted">{order.customer_phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono uppercase">{order.payment_method}</span>
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        order.payment_status === 'PAID' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-brand-softGray text-brand-muted'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-brand-accent">
                      {formatBDT(order.total_amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.order_status === 'DELIVERED'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : order.order_status === 'SHIPPED'
                          ? 'bg-blue-500/10 text-blue-600'
                          : order.order_status === 'CANCELLED'
                          ? 'bg-rose-500/10 text-rose-500'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/admin/orders?search=${order.order_number}`}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-softGray border border-brand-border text-brand-graphite hover:text-brand-accent transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-brand-muted">
            No customer orders recorded yet. Placing storefront orders will populate this view.
          </div>
        )}
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="bg-white border border-brand-border hover:border-brand-accent/50 rounded-2xl p-6 transition-all group flex flex-col justify-between shadow-sm hover:shadow-card-hover"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-softGray border border-brand-border flex items-center justify-center text-brand-accent mb-4 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-brand-graphite group-hover:text-brand-accent transition-colors">
              Product & Stock Control
            </h3>
            <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
              Create and edit robot catalog entries, modify prices, update inventory quantities, and toggle featured models.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-bold text-brand-accent">
            <span>Open Catalog Manager</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white border border-brand-border hover:border-brand-accent/50 rounded-2xl p-6 transition-all group flex flex-col justify-between shadow-sm hover:shadow-card-hover"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-softGray border border-brand-border flex items-center justify-center text-brand-accent mb-4 group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-brand-graphite group-hover:text-brand-accent transition-colors">
              Order Fulfillment Pipeline
            </h3>
            <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
              Process incoming customer orders, manage Cash on Delivery verifications, and advance shipments to courier.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-bold text-brand-accent">
            <span>Manage Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-white border border-brand-border hover:border-brand-accent/50 rounded-2xl p-6 transition-all group flex flex-col justify-between shadow-sm hover:shadow-card-hover"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-softGray border border-brand-border flex items-center justify-center text-brand-accent mb-4 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-brand-graphite group-hover:text-brand-accent transition-colors">
              Store & Hero Media Settings
            </h3>
            <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
              Configure hero video and image modes, audio toggle behavior defaults, Bangladesh shipping rates, and store alerts.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-bold text-brand-accent">
            <span>Configure Settings</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
