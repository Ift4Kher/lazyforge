import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin' || user.role === 'catalog_manager' || user.role === 'order_manager') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillAdmin = () => {
    setEmail('admin@lazyforge.com');
    setPassword('LazyForgeAdmin2026!');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-white">
      <div className="max-w-md w-full bg-white border border-brand-border rounded-3xl p-8 shadow-card-hover space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-softGray border border-brand-accent/30 mx-auto flex items-center justify-center shadow-sm">
            <Lock className="w-6 h-6 text-brand-accent" />
          </div>
          <h2 className="text-2xl font-extrabold text-brand-graphite">Sign In to LazyForge</h2>
          <p className="text-xs text-brand-muted">
            Access your order history or administrative control dashboard
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-graphite mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@lazyforge.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent text-sm text-brand-graphite placeholder-brand-muted focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-brand-graphite">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-brand-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent text-sm text-brand-graphite placeholder-brand-muted focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Register CTA */}
        <div className="pt-4 border-t border-brand-border/60 text-center">
          <p className="text-xs text-brand-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-accent hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        {/* Demo Quick-Fill Button */}
        <div className="pt-2 border-t border-brand-border/60 text-center">
          <p className="text-[11px] text-brand-muted mb-2">Development / Audit Quick Access:</p>
          <button
            type="button"
            onClick={handleFillAdmin}
            className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-brand-softGray border border-brand-border text-brand-accent hover:bg-brand-accentSubtle transition-colors flex items-center justify-center space-x-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Use Default Master Admin Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
}
