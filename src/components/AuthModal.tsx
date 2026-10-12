import React, { useState } from 'react';
import { UserAccount } from '../types';
import { AuthService } from '../services/authService';
import { PasswordRecoveryModal } from './PasswordRecoveryModal';
import {
  X,
  Mail,
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Calendar,
  Sparkles,
  HelpCircle,
  Phone,
  AtSign,
  Smartphone,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount) => void;
  initialMode?: 'login' | 'register' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>(initialMode);

  // 3 Login Options State: 'username' | 'email' | 'phone'
  const [loginMethod, setLoginMethod] = useState<'username' | 'email' | 'phone'>('username');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin Master form state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Facebook-style Register form state (with username, email and phone)
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [birthDay, setBirthDay] = useState('14');
  const [birthMonth, setBirthMonth] = useState('09');
  const [birthYear, setBirthYear] = useState('1994');
  const [gender, setGender] = useState<'Femenino' | 'Masculino' | 'Personalizado' | 'Prefiero no decir'>('Femenino');

  // Recovery modal
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Handle Facebook-style Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || (!email.trim() && !phone.trim()) || !registerPassword) {
      setError('Por favor completa todos los campos requeridos (Nombre, Apellidos, Correo o Teléfono y Contraseña).');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await AuthService.register({
      username: username.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      emailOrPhone: email.trim() || phone.trim(),
      password: registerPassword,
      birthDate: { day: birthDay, month: birthMonth, year: birthYear },
      gender,
    });

    setIsLoading(false);
    if (res.success && res.user) {
      onAuthSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Error al crear la cuenta.');
    }
  };

  // 2. Handle Login (via selected option: username, email or phone)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      setError('Por favor ingresa tus credenciales.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await AuthService.login(loginIdentifier.trim(), loginPassword, loginMethod);
    setIsLoading(false);

    if (res.success && res.user) {
      onAuthSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Credenciales inválidas.');
    }
  };

  // 3. Handle MASTER Superadmin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await AuthService.adminLogin(adminUsername.trim(), adminPassword.trim());
    setIsLoading(false);

    if (res.success && res.user) {
      onAuthSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Credenciales de Superadmin incorrectas.');
    }
  };

  // 4. Handle Google One-Click
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const res = await AuthService.googleLogin();
    setIsLoading(false);
    if (res.success && res.user) {
      onAuthSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FBF9F5] w-full sm:max-w-md max-h-[92vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl border border-[#E8DEC9] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#EBE3D5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1C1917] text-[#C5A059] flex items-center justify-center font-serif text-base italic shadow-xs">
              W
            </div>
            <div>
              <span className="font-serif text-base font-semibold text-stone-900 block leading-tight">
                Styled By Wilma
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">
                {mode === 'register' ? 'Registro Tipo Facebook' : mode === 'admin' ? 'Acceso Superadmin' : 'Acceso de Usuaria'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#EBE3D5] bg-[#F4EFE6]/60 p-1">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              mode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              mode === 'register' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Registrarte
          </button>
          <button
            onClick={() => { setMode('admin'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 ${
              mode === 'admin' ? 'bg-[#1C1917] text-[#C5A059] shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* GOOGLE AUTH BUTTON (Available in login & register) */}
          {mode !== 'admin' && (
            <>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold transition-all flex items-center justify-center gap-2.5 shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuar con Google</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-[11px] text-stone-400 font-medium">o con tus credenciales</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>
            </>
          )}

          {/* MODE 1: FACEBOOK STYLE REGISTRATION (With Username, Email and Phone) */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight">
                  Crear una cuenta nueva
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Es rápido y fácil. Aprende tu Style DNA en minutos.
                </p>
              </div>

              {/* First Name & Last Name (Facebook Grid) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">Nombre</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Nombre"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">Apellidos</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Apellidos"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Unique Username */}
              <div>
                <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">
                  Nombre de Usuario (para ingresar)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    placeholder="ej. @victoria_style o carmen99"
                    className="w-full px-3 py-2 pl-8 rounded-xl border border-stone-200 bg-white text-xs font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                  <AtSign className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">Correo Electrónico</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@correo.com"
                      className="w-full px-3 py-2 pl-8 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">Teléfono Móvil</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+34 600..."
                      className="w-full px-3 py-2 pl-8 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">Contraseña</label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Contraseña nueva (mínimo 6 caracteres)"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Birthday (Facebook Style Selectors) */}
              <div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-700 mb-1">
                  <span>Fecha de nacimiento</span>
                  <span title="Para calibrar tu Lifestyle DNA" className="cursor-help">
                    <HelpCircle className="w-3 h-3 text-stone-400" />
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="px-2 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:border-[#C5A059]"
                  >
                    {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="px-2 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:border-[#C5A059]"
                  >
                    {[
                      { v: '01', l: 'Ene' },
                      { v: '02', l: 'Feb' },
                      { v: '03', l: 'Mar' },
                      { v: '04', l: 'Abr' },
                      { v: '05', l: 'May' },
                      { v: '06', l: 'Jun' },
                      { v: '07', l: 'Jul' },
                      { v: '08', l: 'Ago' },
                      { v: '09', l: 'Sep' },
                      { v: '10', l: 'Oct' },
                      { v: '11', l: 'Nov' },
                      { v: '12', l: 'Dic' },
                    ].map((m) => (
                      <option key={m.v} value={m.v}>
                        {m.l}
                      </option>
                    ))}
                  </select>

                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="px-2 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:border-[#C5A059]"
                  >
                    {Array.from({ length: 70 }, (_, i) => String(2010 - i)).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender */}
              <div>
                <span className="text-[11px] font-semibold text-stone-700 block mb-1">
                  Género
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Femenino', 'Masculino', 'Personalizado'].map((g) => (
                    <label
                      key={g}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        gender === g
                          ? 'border-[#C86D51] bg-[#C86D51]/10 text-[#A44C32] font-semibold'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <span>{g}</span>
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === g}
                        onChange={() => setGender(g as any)}
                        className="accent-[#C86D51] ml-1"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-stone-400 leading-tight">
                Al hacer clic en Registrarte, aceptas nuestras Condiciones y Política de Privacidad de Styled By Wilma.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#00a400] hover:bg-[#008f00] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Registrarte</span>}
              </button>
            </form>
          )}

          {/* MODE 2: USER LOGIN (3 OPCIONES DE INGRESO) */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <span className="text-[11px] font-bold text-stone-700 block mb-1.5 uppercase tracking-wider">
                  Elige cómo deseas ingresar:
                </span>

                {/* 3 OPTIONS SELECTOR */}
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#EFE8DC]/80 border border-[#E0D5C3]">
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('username'); setLoginIdentifier(''); }}
                    className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                      loginMethod === 'username'
                        ? 'bg-white text-[#1C1917] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <AtSign className="w-3.5 h-3.5 text-[#C86D51]" />
                    <span className="truncate">Usuario</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLoginMethod('email'); setLoginIdentifier(''); }}
                    className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                      loginMethod === 'email'
                        ? 'bg-white text-[#1C1917] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-[#556B2F]" />
                    <span className="truncate">Correo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLoginMethod('phone'); setLoginIdentifier(''); }}
                    className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                      loginMethod === 'phone'
                        ? 'bg-white text-[#1C1917] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="truncate">Teléfono</span>
                  </button>
                </div>
              </div>

              {/* DYNAMIC INPUT ACCORDING TO OPTION */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {loginMethod === 'username' && 'Nombre de Usuario'}
                  {loginMethod === 'email' && 'Correo Electrónico'}
                  {loginMethod === 'phone' && 'Número de Teléfono Móvil'}
                </label>
                <div className="relative">
                  <input
                    type={loginMethod === 'email' ? 'email' : loginMethod === 'phone' ? 'tel' : 'text'}
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={
                      loginMethod === 'username'
                        ? 'ej. @victoria o victoria'
                        : loginMethod === 'email'
                        ? 'ejemplo@correo.com'
                        : '+34 600... o 612345678'
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs pl-9 focus:outline-none focus:border-[#C5A059]"
                  />
                  {loginMethod === 'username' && <AtSign className="w-4 h-4 text-stone-400 absolute left-3 top-3" />}
                  {loginMethod === 'email' && <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />}
                  {loginMethod === 'phone' && <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />}
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsRecoveryOpen(true)}
                    className="text-[11px] text-[#C86D51] hover:underline font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs pl-9 focus:outline-none focus:border-[#C5A059]"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#1C1917] hover:bg-black text-[#FAF6F0] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" /> : <span>Iniciar Sesión</span>}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-xs text-stone-600 hover:text-stone-900 font-medium"
                >
                  ¿No tienes una cuenta? <span className="text-[#C86D51] font-semibold">Regístrate gratis</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: MASTER SUPERADMIN LOGIN */}
          {mode === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-3 bg-[#1C1917] text-[#FAF6F0] p-4 rounded-2xl border border-[#3E3833]">
              <div className="flex items-center gap-2 text-[#C5A059]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-serif text-base font-bold text-white">
                  Acceso Superadmin Autorizado
                </h3>
              </div>
              <p className="text-[11px] text-stone-300">
                Credenciales validadas exclusivamente del lado servidor en el backend.
              </p>

              <div>
                <label className="text-[11px] font-semibold text-stone-300 block mb-1">
                  Nombre de Usuario Master
                </label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Usuario Superadmin"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-white text-xs font-mono focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-300 block mb-1">
                  Clave Maestra (Backend)
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-white text-xs font-mono focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#C5A059] hover:bg-[#B48C36] text-[#1C1917] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#1C1917]" />
                ) : (
                  <span>Ingresar a Panel Superadmin</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Password Recovery Sub-Modal */}
      <PasswordRecoveryModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
        onSuccess={() => {
          setIsRecoveryOpen(false);
          setMode('login');
        }}
      />
    </div>
  );
};
