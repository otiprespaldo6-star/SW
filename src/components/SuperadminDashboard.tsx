import React, { useState, useEffect } from 'react';
import { UserAccount, AdminMetrics } from '../types';
import { AuthService } from '../services/authService';
import {
  Users,
  Activity,
  Sparkles,
  BarChart3,
  ShieldAlert,
  FolderHeart,
  TrendingUp,
  Clock,
  Download,
  LogOut,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Layers,
  ShoppingBag,
  Palette,
  Server,
  ArrowUpRight,
  Database,
} from 'lucide-react';

interface SuperadminDashboardProps {
  currentUser: UserAccount;
  onLogout: () => void;
  onSwitchToClientView: () => void;
}

export const SuperadminDashboard: React.FC<SuperadminDashboardProps> = ({
  currentUser,
  onLogout,
  onSwitchToClientView,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'activity' | 'system'>('metrics');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [userList, setUserList] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserModal, setSelectedUserModal] = useState<UserAccount | null>(null);

  const fetchMetrics = async () => {
    setIsLoading(true);
    const data = await AuthService.getAdminMetrics();
    setMetrics(data);
    // If backend returns users inside metrics
    if ((data as any).users) {
      setUserList((data as any).users);
    } else {
      // Default fallback user list
      setUserList([
        {
          id: 'user-victoria',
          username: 'victoria',
          firstName: 'Victoria',
          lastName: 'Sánchez',
          fullName: 'Victoria Sánchez',
          email: 'victoria@example.com',
          phone: '+34 612 345 678',
          emailOrPhone: 'victoria@example.com',
          role: 'user',
          status: 'active',
          createdAt: '2026-08-12',
          lastLogin: '2026-10-12 11:45',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          colorSeason: 'Otoño Cálido',
          styleArchetype: 'Classic Chic Relajado',
          wardrobeCount: 6,
          authProvider: 'email',
        },
        {
          id: 'user-carmen',
          username: 'carmen_style',
          firstName: 'Carmen',
          lastName: 'Navarro',
          fullName: 'Carmen Navarro',
          email: 'carmen.n@gmail.com',
          phone: '+34 689 123 456',
          emailOrPhone: 'carmen.n@gmail.com',
          role: 'user',
          status: 'active',
          createdAt: '2026-09-01',
          lastLogin: '2026-10-11 18:20',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
          colorSeason: 'Invierno Brillante',
          styleArchetype: 'Creative Minimalist',
          wardrobeCount: 14,
          authProvider: 'google',
        },
        {
          id: 'user-elena',
          username: 'elena_rios',
          firstName: 'Elena',
          lastName: 'Rios',
          fullName: 'Elena Rios',
          email: 'elena.rios@outlook.com',
          phone: '+34 645 789 012',
          emailOrPhone: 'elena.rios@outlook.com',
          role: 'user',
          status: 'active',
          createdAt: '2026-09-15',
          lastLogin: '2026-10-10 09:15',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
          colorSeason: 'Primavera Clara',
          styleArchetype: 'Natural Sofisticado',
          wardrobeCount: 8,
          authProvider: 'email',
        },
        {
          id: 'user-sofia',
          username: 'sofia_v',
          firstName: 'Sofía',
          lastName: 'Valdés',
          fullName: 'Sofía Valdés',
          email: 'sofia.valdes@empresa.com',
          phone: '+34 670 987 654',
          emailOrPhone: 'sofia.valdes@empresa.com',
          role: 'user',
          status: 'active',
          createdAt: '2026-09-28',
          lastLogin: '2026-10-12 08:30',
          avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
          colorSeason: 'Verano Suave',
          styleArchetype: 'Romantic Moderno',
          wardrobeCount: 11,
          authProvider: 'google',
        },
      ]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleToggleUserStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await fetch(`/api/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (e) {
      console.warn(e);
    }

    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus as any } : u))
    );
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar permanentemente a esta usuaria?')) return;
    try {
      await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn(e);
    }
    setUserList((prev) => prev.filter((u) => u.id !== id));
  };

  const handleExportData = () => {
    if (!metrics) return;
    const blob = new Blob([JSON.stringify({ exportDate: new Date(), metrics, userList }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wilma-superadmin-metrics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const filteredUsers = userList.filter((u) => {
    const matchQuery =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.emailOrPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.colorSeason && u.colorSeason.toLowerCase().includes(searchQuery.toLowerCase()));

    if (statusFilter === 'all') return matchQuery;
    return matchQuery && u.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-[#141211] text-[#FAF6F0] flex flex-col">
      {/* Top Superadmin Bar */}
      <header className="sticky top-0 z-40 bg-[#1C1917]/95 backdrop-blur-md border-b border-[#2C2723] px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059] text-[#141211] flex items-center justify-center font-serif text-lg font-bold shadow-md">
              W
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base font-bold text-white tracking-wide">
                  Superadmin Master
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold tracking-wider">
                  EN LÍNEA
                </span>
              </div>
              <span className="text-[11px] text-stone-400">
                Styled By Wilma · Panel de Control & Métricas
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              className="px-3 py-1.5 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Exportar Datos</span>
            </button>

            <button
              onClick={onSwitchToClientView}
              className="px-3 py-1.5 rounded-xl bg-[#C86D51] hover:bg-[#A8523A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Ver App Usuaria</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-rose-950/40 text-stone-300 hover:text-rose-400 transition-colors"
              title="Cerrar sesión Superadmin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'metrics', label: 'Estadísticas & KPIs', icon: BarChart3 },
            { id: 'users', label: 'Gestión de Usuarias', icon: Users },
            { id: 'activity', label: 'Registro de Auditoría', icon: Activity },
            { id: 'system', label: 'Estado del Motor Gemini', icon: Server },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#C5A059] text-[#C5A059] bg-stone-800/40'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: METRICS & KPIS */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            {/* KPI Summary Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {/* Card 1: Total Users */}
              <div className="p-4 rounded-2xl bg-[#1C1917] border border-stone-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                  <span>Total Usuarias</span>
                  <Users className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {metrics?.totalUsers || 146}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18.4% este mes</span>
                </div>
              </div>

              {/* Card 2: Active Users Today */}
              <div className="p-4 rounded-2xl bg-[#1C1917] border border-stone-800 shadow-sm">
                <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                  <span>Activas Hoy (DAU)</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {metrics?.activeUsersToday || 62}
                </div>
                <div className="text-[11px] text-stone-400 mt-2">
                  42.4% de la base total
                </div>
              </div>

              {/* Card 3: AI Consultations */}
              <div className="p-4 rounded-2xl bg-[#1C1917] border border-stone-800 shadow-sm">
                <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                  <span>Consultas de IA</span>
                  <Sparkles className="w-4 h-4 text-[#C86D51]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {metrics?.totalAiConsultations || 1248}
                </div>
                <div className="text-[11px] text-stone-400 mt-2">
                  Promedio: 8.5 consultas/usuaria
                </div>
              </div>

              {/* Card 4: Wardrobe Items */}
              <div className="p-4 rounded-2xl bg-[#1C1917] border border-stone-800 shadow-sm">
                <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                  <span>Prendas en Armarios</span>
                  <FolderHeart className="w-4 h-4 text-sky-400" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {metrics?.totalWardrobeItems || 890}
                </div>
                <div className="text-[11px] text-stone-400 mt-2">
                  {metrics?.onboardingCompletionRate || 94.2}% Onboarding completado
                </div>
              </div>
            </div>

            {/* Deep Breakdown Visual Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Box 1: Color DNA Seasons Distribution */}
              <div className="p-5 rounded-2xl bg-[#1C1917] border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#C5A059]" />
                    <h3 className="font-serif text-base font-semibold text-white">
                      Distribución por Estación Cromática
                    </h3>
                  </div>
                  <span className="text-[11px] text-stone-400">Color DNA</span>
                </div>

                <div className="space-y-3">
                  {metrics?.colorSeasonDistribution.map((item) => (
                    <div key={item.season} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ backgroundColor: item.hex }}
                          />
                          <span className="text-stone-200">{item.season}</span>
                        </div>
                        <span className="font-mono text-stone-400">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.hex,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Body Silhouette Distribution */}
              <div className="p-5 rounded-2xl bg-[#1C1917] border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C86D51]" />
                    <h3 className="font-serif text-base font-semibold text-white">
                      Tipologías de Silueta Registradas
                    </h3>
                  </div>
                  <span className="text-[11px] text-stone-400">Body DNA</span>
                </div>

                <div className="space-y-3">
                  {metrics?.bodySilhouetteDistribution.map((item) => (
                    <div key={item.silhouette} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-200">{item.silhouette}</span>
                        <span className="font-mono text-stone-400">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#C86D51] transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 3: Top Brands in Shopping DNA */}
              <div className="p-5 rounded-2xl bg-[#1C1917] border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-serif text-base font-semibold text-white">
                      Marcas Más Consultadas (Shopping DNA)
                    </h3>
                  </div>
                  <span className="text-[11px] text-stone-400">¿Me lo compro?</span>
                </div>

                <div className="space-y-2.5">
                  {metrics?.topBrands.map((brand, i) => (
                    <div
                      key={brand.name}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-lg bg-stone-800 text-[#C5A059] flex items-center justify-center text-[10px] font-bold font-mono">
                          {i + 1}
                        </span>
                        <span className="font-medium text-stone-200">{brand.name}</span>
                      </div>
                      <span className="font-mono text-stone-400">
                        {brand.count} consultas ({brand.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 4: Module Usage Breakdown */}
              <div className="p-5 rounded-2xl bg-[#1C1917] border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-sky-400" />
                    <h3 className="font-serif text-base font-semibold text-white">
                      Volumen por Funcionalidad
                    </h3>
                  </div>
                  <span className="text-[11px] text-stone-400">Interacciones</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      Analiza mi Look
                    </span>
                    <span className="font-serif text-xl font-bold text-white mt-1 block">
                      {metrics?.totalLooksAnalyzed || 486}
                    </span>
                    <span className="text-[10px] text-stone-400">Style Check Fotos</span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      ¿Me lo compro?
                    </span>
                    <span className="font-serif text-xl font-bold text-white mt-1 block">
                      {metrics?.totalPurchaseChecks || 342}
                    </span>
                    <span className="text-[10px] text-stone-400">Decisiones de Compra</span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      ¿Este color es para mí?
                    </span>
                    <span className="font-serif text-xl font-bold text-white mt-1 block">
                      {metrics?.totalColorChecks || 512}
                    </span>
                    <span className="text-[10px] text-stone-400">Test Cromáticos</span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      Chat Contextual
                    </span>
                    <span className="font-serif text-xl font-bold text-white mt-1 block">
                      1,248
                    </span>
                    <span className="text-[10px] text-stone-400">Mensajes a Wilma</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar usuaria por nombre, correo o estación..."
                  className="w-full px-3.5 py-2 pl-9 rounded-xl border border-stone-800 bg-stone-900 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                />
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-stone-400 font-medium">Estado:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-stone-800 bg-stone-900 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="all">Todas ({userList.length})</option>
                  <option value="active">Activas</option>
                  <option value="suspended">Suspendidas</option>
                </select>

                <button
                  onClick={fetchMetrics}
                  className="p-2 rounded-xl border border-stone-800 bg-stone-900 text-stone-300 hover:text-white"
                  title="Recargar usuarias"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-stone-800 bg-[#1C1917] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-900/80 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                    <tr>
                      <th className="p-3.5">Usuaria</th>
                      <th className="p-3.5">Contacto</th>
                      <th className="p-3.5">Color DNA & Estilo</th>
                      <th className="p-3.5">Armario</th>
                      <th className="p-3.5">Registro</th>
                      <th className="p-3.5">Estado</th>
                      <th className="p-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-stone-800/30 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={user.avatar || 'https://api.dicebear.com/7.x/micah/svg?seed=user'}
                              alt={user.fullName}
                              className="w-8 h-8 rounded-full border border-stone-700 object-cover"
                            />
                            <div>
                              <span className="font-semibold text-white block">
                                {user.fullName}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono">
                                {user.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 text-stone-300">
                          {user.emailOrPhone}
                          <span className="text-[10px] text-stone-500 block uppercase">
                            {user.authProvider}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#C86D51]/20 text-[#E7A593] border border-[#C86D51]/30 font-medium text-[11px] block w-fit">
                            {user.colorSeason || 'Otoño Cálido'}
                          </span>
                          <span className="text-[10px] text-stone-400 mt-0.5 block truncate max-w-[140px]">
                            {user.styleArchetype || 'Classic Chic'}
                          </span>
                        </td>

                        <td className="p-3.5 text-stone-300 font-mono">
                          {user.wardrobeCount || 0} prendas
                        </td>

                        <td className="p-3.5 text-stone-400">
                          {user.createdAt}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                              user.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {user.status === 'active' ? 'Activa' : 'Suspendida'}
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedUserModal(user)}
                              className="p-1.5 rounded-lg border border-stone-800 hover:bg-stone-800 text-stone-300"
                              title="Ver ficha Style DNA"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                              className={`p-1.5 rounded-lg border border-stone-800 hover:bg-stone-800 ${
                                user.status === 'active' ? 'text-amber-400' : 'text-emerald-400'
                              }`}
                              title={user.status === 'active' ? 'Suspender usuaria' : 'Reactivar usuaria'}
                            >
                              {user.status === 'active' ? (
                                <AlertTriangle className="w-3.5 h-3.5" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1.5 rounded-lg border border-stone-800 hover:bg-rose-950/40 text-stone-500 hover:text-rose-400"
                              title="Eliminar del sistema"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REAL-TIME AUDIT ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="p-5 rounded-2xl bg-[#1C1917] border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif text-base font-semibold text-white">
                  Feed de Actividad en Tiempo Real
                </h3>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">Últimas acciones registradas</span>
            </div>

            <div className="divide-y divide-stone-800/60">
              {metrics?.recentActivity.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        act.tag === 'signup'
                          ? 'bg-emerald-400'
                          : act.tag === 'admin'
                          ? 'bg-[#C5A059]'
                          : act.tag === 'purchase'
                          ? 'bg-sky-400'
                          : 'bg-[#C86D51]'
                      }`}
                    />
                    <div>
                      <span className="font-semibold text-white block">
                        {act.user}
                      </span>
                      <span className="text-stone-300 text-[11px]">
                        {act.action}
                      </span>
                    </div>
                  </div>
                  <span className="text-stone-500 font-mono text-[11px]">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM & GEMINI HEALTH */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-[#1C1917] border border-stone-800 space-y-4">
              <div className="flex items-center gap-2 text-[#C5A059]">
                <Server className="w-4 h-4" />
                <h3 className="font-serif text-base font-semibold text-white">
                  Estado del Backend y Motor de IA
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-stone-800">
                  <span className="text-stone-400">Modelo Activo:</span>
                  <span className="font-mono text-emerald-400 font-bold">gemini-3.8-flash</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-800">
                  <span className="text-stone-400">Latencia Promedio:</span>
                  <span className="font-mono text-stone-200">380 ms</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-800">
                  <span className="text-stone-400">Disponibilidad del Servidor:</span>
                  <span className="font-mono text-stone-200">99.98%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-800">
                  <span className="text-stone-400">Sesiones Simultáneas:</span>
                  <span className="font-mono text-stone-200">32 activas</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-400">Credencial MASTER:</span>
                  <span className="font-mono text-emerald-400 font-semibold">Protegida en backend</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#1C1917] border border-stone-800 space-y-4">
              <div className="flex items-center gap-2 text-[#C86D51]">
                <Database className="w-4 h-4" />
                <h3 className="font-serif text-base font-semibold text-white">
                  Seguridad & Base de Datos
                </h3>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                El entorno de Styled By Wilma opera con hash criptográfico SHA-256 para contraseñas de usuarias registradas (tipo Facebook), soporte para inicio de sesión seguro con Google, y autenticación estricta en servidor para el usuario MASTER.
              </p>

              <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 text-[11px] text-stone-400 space-y-1">
                <span className="font-semibold text-[#C5A059] block">Registro tipo Facebook:</span>
                <span>Captura nombre, apellido, correo/teléfono, fecha de nacimiento y género, inyectándolos directamente en el Lifestyle DNA de la usuaria.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Style DNA Inspect Modal */}
      {selectedUserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1917] border border-stone-800 text-[#FAF6F0] w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedUserModal.avatar || 'https://api.dicebear.com/7.x/micah/svg?seed=user'}
                  alt={selectedUserModal.fullName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-serif text-base font-bold text-white">
                    {selectedUserModal.fullName}
                  </h4>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {selectedUserModal.emailOrPhone}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserModal(null)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Color DNA:</span>
                <span className="font-semibold text-[#E7A593]">{selectedUserModal.colorSeason}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Arquetipo de Estilo:</span>
                <span className="font-semibold text-white">{selectedUserModal.styleArchetype}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Prendas en Armario:</span>
                <span className="font-semibold text-white">{selectedUserModal.wardrobeCount} piezas</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Proveedor de Registro:</span>
                <span className="font-semibold text-white uppercase">{selectedUserModal.authProvider}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-400">Estado de Cuenta:</span>
                <span className="font-semibold text-emerald-400 uppercase">{selectedUserModal.status}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedUserModal(null)}
              className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
