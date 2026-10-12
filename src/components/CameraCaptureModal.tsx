import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  RotateCcw,
  X,
  Check,
  AlertCircle,
  SwitchCamera,
  Sparkles,
  Upload,
  RefreshCw,
  Video,
} from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string) => void;
  title?: string;
  subtitle?: string;
  defaultFacingMode?: 'user' | 'environment';
  aspectRatioHint?: 'portrait' | 'square';
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = 'Tomar Fotografía con la Cámara',
  subtitle = 'Compatible con cámara frontal y trasera en móvil, y webcam en PC / Laptop',
  defaultFacingMode = 'environment',
  aspectRatioHint = 'portrait',
}) => {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(defaultFacingMode);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera when opened or when facingMode changes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setPermissionError(null);
      return;
    }

    startCamera(facingMode);

    // Check available devices to see if switch button makes sense
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoInputs = devices.filter((d) => d.kind === 'videoinput');
          setHasMultipleCameras(videoInputs.length > 1);
        })
        .catch(() => {});
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startCamera = async (mode: 'user' | 'environment') => {
    stopCamera();
    setPermissionError(null);
    setIsInitializing(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador o dispositivo no soporta acceso directo a la cámara.');
      }

      // Constraints with optimal resolution for mobile and laptops
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 1920 },
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch((err) => {
          console.warn('Video play warning:', err);
        });
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError(
          'Permiso de cámara denegado. Por favor haz clic en el icono del candado en la barra de direcciones de tu navegador y selecciona "Permitir cámara", luego recarga o reintenta.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionError(
          'No se detectó ninguna cámara disponible en tu dispositivo (PC, Laptop o Celular).'
        );
      } else {
        setPermissionError(
          err.message || 'No fue posible iniciar la cámara. Puedes subir una foto desde tu galería.'
        );
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const toggleCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, mirror image for natural selfie feel
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  // Fallback upload file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCapturedImage(result);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#1C1917] w-full sm:max-w-md h-[92vh] sm:h-[680px] rounded-t-3xl sm:rounded-3xl border border-stone-800 flex flex-col overflow-hidden shadow-2xl relative text-white">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-800 flex items-center justify-between z-20 bg-[#1C1917]/90 backdrop-blur-md shrink-0">
          <div>
            <h3 className="font-serif text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#C5A059]" />
              <span>{title}</span>
            </h3>
            <p className="text-[10px] text-stone-400 mt-0.5 truncate max-w-[280px]">
              {subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            /* Preview of captured photo */
            <div className="w-full h-full relative flex items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Foto capturada"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-400 border border-emerald-500/40">
                ✓ Fotografía lista
              </div>
            </div>
          ) : permissionError ? (
            /* Permission error state */
            <div className="p-6 text-center space-y-4 max-w-sm">
              <div className="w-14 h-14 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-white">
                  Permiso de Cámara Requerido
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed mt-2">
                  {permissionError}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => startCamera(facingMode)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white text-stone-900 hover:bg-stone-100 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Volver a Intentar Permiso</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Subir desde Galería o Archivo</span>
                </button>
              </div>
            </div>
          ) : (
            /* Live Camera Stream */
            <div className="w-full h-full relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Viewfinder Framing Guidelines */}
              <div className="absolute inset-8 border border-white/25 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-[#C5A059]" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-[#C5A059]" />
                </div>
                <div className="text-center">
                  <span className="bg-black/60 px-3 py-1 rounded-full text-[10px] font-medium text-stone-300 tracking-wider uppercase backdrop-blur-xs">
                    {facingMode === 'user' ? 'Cámara Frontal · Selfie' : 'Cámara Trasera · Prenda / Look'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-[#C5A059]" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-[#C5A059]" />
                </div>
              </div>

              {/* Camera Mode Flip Switch (Floating top-right) */}
              <button
                onClick={toggleCamera}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-lg transition-transform active:rotate-180"
                title="Cambiar entre cámara frontal y trasera"
              >
                <SwitchCamera className="w-5 h-5 text-[#C5A059]" />
              </button>
            </div>
          )}
        </div>

        {/* Hidden File Input for fallback */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture={facingMode === 'environment' ? 'environment' : 'user'}
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Shutter / Confirmation Bar */}
        <div className="p-5 border-t border-stone-800 bg-[#1C1917] shrink-0 z-20">
          {capturedImage ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleRetake}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-xs font-semibold text-stone-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Repetir Foto</span>
              </button>

              <button
                onClick={handleConfirm}
                className="flex-1 py-3 px-4 rounded-xl bg-[#C5A059] hover:bg-[#B89246] text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Usar Esta Foto</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              {/* Left: Gallery button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                title="Elegir foto de la galería"
              >
                <Upload className="w-5 h-5" />
              </button>

              {/* Center: Big Shutter Button */}
              <button
                onClick={capturePhoto}
                disabled={Boolean(permissionError) || isInitializing}
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-transparent hover:bg-white/10 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                title="Tomar Foto"
              >
                <div className="w-12 h-12 rounded-full bg-white transition-transform active:scale-90" />
              </button>

              {/* Right: Flip camera button */}
              <button
                onClick={toggleCamera}
                disabled={Boolean(permissionError)}
                className="p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors disabled:opacity-40"
                title={
                  facingMode === 'user'
                    ? 'Cambiar a cámara trasera'
                    : 'Cambiar a cámara frontal'
                }
              >
                <SwitchCamera className="w-5 h-5 text-[#C5A059]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
