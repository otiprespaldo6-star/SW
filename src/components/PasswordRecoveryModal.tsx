import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import { X, KeyRound, Mail, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PasswordRecoveryModal: React.FC<PasswordRecoveryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError('Ingresa tu correo o teléfono.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await AuthService.requestPasswordRecovery(emailOrPhone.trim());
    setIsLoading(false);

    if (res.success) {
      if (res.demoCode) {
        setDemoCodeHint(res.demoCode);
        setCode(res.demoCode); // Auto-fill for friction-free testing
      }
      setStep('verify');
    } else {
      setError(res.error || 'No se pudo procesar la solicitud.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !newPassword) {
      setError('Por favor completa el código y la nueva contraseña.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await AuthService.resetPassword(emailOrPhone.trim(), code.trim(), newPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(res.message || 'Contraseña actualizada con éxito.');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setError(res.error || 'Código incorrecto o expirado.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FBF9F5] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-[#E8DEC9] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EBE3D5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1C1917] text-[#C5A059] flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-base font-semibold text-stone-900 block leading-tight">
                Recuperar Contraseña
              </span>
              <span className="text-[11px] text-stone-500">
                {step === 'request' ? 'Paso 1: Identificación' : 'Paso 2: Código y Nueva Clave'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                Ingresa tu correo electrónico o número de celular registrado. Te enviaremos un código de seguridad para verificar tu identidad.
              </p>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Correo o Número de Teléfono
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="ejemplo@correo.com o +34 600..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs pl-9 focus:outline-none focus:border-[#C5A059]"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#1C1917] hover:bg-black text-[#FAF6F0] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                ) : (
                  <>
                    <span>Enviar Código de Seguridad</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-3">
              {demoCodeHint && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <span className="font-semibold block">Código de verificación enviado:</span>
                  <span className="font-mono text-base font-bold tracking-widest text-[#A44C32]">
                    {demoCodeHint}
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Código de 6 dígitos
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm font-mono tracking-widest text-center focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu nueva contraseña"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#C86D51] hover:bg-[#A8523A] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span>Actualizar Contraseña</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('request')}
                className="w-full text-center text-xs text-stone-500 hover:text-stone-800 mt-1"
              >
                Volver a solicitar código
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
