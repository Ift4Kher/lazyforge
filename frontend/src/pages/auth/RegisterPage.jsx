import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        password: formData.password,
      });

      navigate(redirectPath);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-brand-border/80 rounded-3xl p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-[#0066FF]/30 mx-auto flex items-center justify-center shadow-xs">
            <User className="w-6 h-6 text-[#0066FF]" />
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#0066FF] font-bold">
            NEW NODE INITIALIZATION
          </div>
          <h2 className="text-2xl font-black font-orbitron text-brand-graphite tracking-wide">
            CREATE FORGE ACCOUNT
          </h2>
          <p className="text-xs text-brand-muted">
            Join the robotics collective to manage hardware orders and support tickets
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
            <label className="block text-xs font-mono font-bold text-brand-graphite mb-1.5">
              FULL NAME <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Asif Mahmud"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-brand-border text-xs text-brand-graphite placeholder-brand-muted focus:border-[#0066FF] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-brand-graphite mb-1.5">
              EMAIL ADDRESS <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-brand-border text-xs text-brand-graphite placeholder-brand-muted focus:border-[#0066FF] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-brand-graphite mb-1.5">
              MOBILE NUMBER (BD)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="017XXXXXXXX"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-brand-border text-xs font-mono text-brand-graphite placeholder-brand-muted focus:border-[#0066FF] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-brand-graphite mb-1.5">
              PASSWORD <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-brand-border text-xs text-brand-graphite placeholder-brand-muted focus:border-[#0066FF] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-brand-graphite mb-1.5">
              CONFIRM PASSWORD <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-brand-border text-xs text-brand-graphite placeholder-brand-muted focus:border-[#0066FF] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl font-bold font-orbitron text-xs tracking-wider bg-[#0066FF] text-white hover:bg-[#0052CC] shadow-md disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            <span>{isSubmitting ? 'CREATING NODE...' : 'INITIALIZE ACCOUNT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-brand-border/60 text-center">
          <p className="text-xs text-brand-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#0066FF] hover:underline font-mono">
              Authorize Session
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
