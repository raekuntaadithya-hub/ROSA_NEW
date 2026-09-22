import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/store/useAppStore';
import type { UserRole } from '@/types';
import { Activity, Lock, Mail, Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('dr.mitchell@clinicalatlas.demo');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('surgeon');
  const { login } = useAuthStore();
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    setLocation('/dashboard');
  };

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: 'surgeon', label: 'Surgeon', desc: 'Full access to planning & review' },
    { value: 'radiologist', label: 'Radiologist', desc: 'Imaging & segmentation review' },
    { value: 'robotic_technician', label: 'Robotic Technician', desc: 'System monitoring & calibration' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-[55%] items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <div className="relative z-10 max-w-lg px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
              <Activity className="h-7 w-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Clinical Atlas</h1>
              <p className="text-sm text-blue-300">Prototype v1.0</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            AI-Assisted Knee Reconstruction & Planning
          </h2>
          <p className="text-blue-200/80 text-base leading-relaxed mb-8">
            Automatic knee bone segmentation and 3D reconstruction framework for ROSA-assisted total knee arthroplasty pre-operative planning.
          </p>

          <div className="space-y-4">
            {[
              'Automated CT bone segmentation',
              'Patient-specific 3D reconstruction',
              'Interactive anatomical visualization',
              'Pre-operative planning support',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                </div>
                <span className="text-sm text-blue-100">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3">
            <div className="flex items-center gap-2 text-amber-300/90 text-xs">
              <Shield className="h-3.5 w-3.5" />
              <span className="font-medium">Academic Research Prototype</span>
            </div>
            <p className="text-[11px] text-blue-200/60 mt-1">
              Not for clinical diagnosis, treatment decisions, or robotic control.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex w-full lg:w-[45%] items-center justify-center bg-white px-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Clinical Atlas</h1>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 mb-8">Sign in to your clinical workspace</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="clinician@hospital.edu"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Clinical Role</label>
              <div className="space-y-2">
                {roles.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      role === r.value
                        ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-200'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={role === r.value}
                      onChange={() => setRole(r.value)}
                      className="sr-only"
                    />
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      role === r.value ? 'border-blue-500' : 'border-slate-300'
                    }`}>
                      {role === r.value && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{r.label}</p>
                      <p className="text-xs text-slate-400">{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
            >
              Sign In to Clinical Atlas
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Secure clinical workspace · Prototype authentication
          </p>
        </div>
      </div>
    </div>
  );
}
