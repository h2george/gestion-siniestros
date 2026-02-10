import { useState, useEffect, ReactNode } from 'react';
import { Mail, ShieldCheck, FileText, Settings, LayoutDashboard, Bell, Edit3, Save, Plus, Trash2, LogOut, Users } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const API_URL = 'http://localhost:3005/api';

interface Template {
  id: number;
  flow_step: string;
  label: string;
  subject: string;
}

interface Mailbox {
  id: number;
  email: string;
  alias_for?: string;
  status: string;
}

interface UserData {
  id: number;
  email: string;
  full_name: string;
  role: string;
  active: boolean;
  last_login?: string;
}

function App() {
  const { user, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data States
  const [templates, setTemplates] = useState<Template[]>([]);
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  // User Management State
  const [users, setUsers] = useState<UserData[]>([]);
  const [newUser, setNewUser] = useState({ full_name: '', email: '', password: '', role: 'analyst' });

  // Automation Rules State
  const [rules, setRules] = useState<any[]>([]);
  const [newRule, setNewRule] = useState({ keyword: '', event_type: 'new_claim', template_id: 1 });

  // New Mailbox State
  const [newMailbox, setNewMailbox] = useState({ email: '', alias_for: '' });

  // Fetch Data on Tab Change
  useEffect(() => {
    if (!token) return;

    const headers = { 'Authorization': `Bearer ${token}` };

    if (activeTab === 'config') {
      // Fetch Templates
      fetch(`${API_URL}/templates`, { headers })
        .then(res => res.json())
        .then(data => setTemplates(data))
        .catch(err => console.error('Error loading templates:', err));

      // Fetch Mailboxes
      fetch(`${API_URL}/settings/mailboxes`, { headers })
        .then(res => res.json())
        .then(data => setMailboxes(data))
        .catch(err => console.error('Error loading mailboxes:', err));

      // Fetch Rules
      fetch(`${API_URL}/rules`, { headers })
        .then(res => res.json())
        .then(data => setRules(data))
        .catch(err => console.error('Error loading rules:', err));
    }

    if (activeTab === 'users') {
      fetch(`${API_URL}/users`, { headers })
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error('Error loading users:', err));
    }
  }, [activeTab, token]);

  const handleAddMailbox = async () => {
    if (!newMailbox.email) return;
    try {
      await fetch(`${API_URL}/settings/mailboxes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newMailbox)
      });
      // Reload
      const res = await fetch(`${API_URL}/settings/mailboxes`, { headers: { 'Authorization': `Bearer ${token}` } });
      setMailboxes(await res.json());
      setNewMailbox({ email: '', alias_for: '' });
    } catch (error) {
      console.error('Error adding mailbox:', error);
    }
  };

  const handleDeleteMailbox = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este buzón?')) return;
    try {
      await fetch(`${API_URL}/settings/mailboxes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMailboxes(mailboxes.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting mailbox:', error);
    }
  };

  const handleAddRule = async () => {
    if (!newRule.keyword) return;
    try {
      await fetch(`${API_URL}/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newRule)
      });
      const res = await fetch(`${API_URL}/rules`, { headers: { 'Authorization': `Bearer ${token}` } });
      setRules(await res.json());
      setNewRule({ keyword: '', event_type: 'new_claim', template_id: 1 });
    } catch (error) {
      console.error('Error adding rule:', error);
    }
  };

  const handleDeleteRule = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar esta regla?')) return;
    try {
      await fetch(`${API_URL}/rules/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRules(rules.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.full_name) return;
    try {
      await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newUser)
      });
      // Reload
      const res = await fetch(`${API_URL}/users`, { headers: { 'Authorization': `Bearer ${token}` } });
      setUsers(await res.json());
      setNewUser({ full_name: '', email: '', password: '', role: 'analyst' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f1115] text-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#16191f] border-r border-gray-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Siniestros AI</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <NavItem
            icon={<Mail size={20} />}
            label="Buzón de Entrada"
            active={activeTab === 'mailbox'}
            onClick={() => setActiveTab('mailbox')}
          />
          <NavItem
            icon={<FileText size={20} />}
            label="Siniestros"
            active={activeTab === 'claims'}
            onClick={() => setActiveTab('claims')}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Configuración"
            active={activeTab === 'config'}
            onClick={() => setActiveTab('config')}
          />
          {user?.role === 'admin' && (
            <NavItem
              icon={<Users size={20} />}
              label="Usuarios"
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            />
          )}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg w-full transition-colors">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[#16191f]/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#16191f]"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">{user?.full_name}</p>
                <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                {user?.full_name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Pendientes de Clasificación" value="12" subValue="+3 hoy" color="blue" />
              <StatCard title="Siniestros Detectados" value="48" subValue="+8 esta semana" color="indigo" />
              <StatCard title="Coberturas Aprobadas" value="24" subValue="92% efectividad" color="emerald" />
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-8">

              {/* Sección de Buzones */}
              <div className="bg-[#16191f] border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Mail className="text-indigo-500" size={20} />
                  Buzones Monitoreados
                </h2>
                <div className="mb-4 flex gap-2">
                  <input
                    type="email"
                    placeholder="nuevo@correo.com"
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm flex-1 outline-none focus:border-blue-500"
                    value={newMailbox.email}
                    onChange={e => setNewMailbox({ ...newMailbox, email: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Alias (opcional)"
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm w-48 outline-none focus:border-blue-500"
                    value={newMailbox.alias_for}
                    onChange={e => setNewMailbox({ ...newMailbox, alias_for: e.target.value })}
                  />
                  <button onClick={handleAddMailbox} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Plus size={16} /> Agregar
                  </button>
                </div>

                <div className="space-y-2">
                  {(mailboxes || []).map(mb => (
                    <div key={mb.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                      <div>
                        <p className="font-medium text-sm">{mb.email}</p>
                        {mb.alias_for && <p className="text-xs text-gray-500">Alias de: {mb.alias_for}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${mb.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-gray-700 text-gray-400 border-gray-600'}`}>
                          {mb.status}
                        </span>
                        <button onClick={() => handleDeleteMailbox(mb.id)} className="text-red-400 hover:text-red-300 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!mailboxes || mailboxes.length === 0) && <p className="text-gray-500 text-sm italic">No hay buzones configurados.</p>}
                </div>
              </div>

              {/* Sección de Reglas de Automatización */}
              <div className="bg-[#16191f] border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-500" size={20} />
                  Reglas de Automatización
                </h2>

                <div className="mb-4 flex flex-wrap gap-2 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs text-gray-500 mb-1">Si el asunto/remitente contiene:</label>
                    <input
                      type="text"
                      placeholder="Ej: Pacífico, Rimac..."
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={newRule.keyword}
                      onChange={e => setNewRule({ ...newRule, keyword: e.target.value })}
                    />
                  </div>
                  <div className="w-[200px]">
                    <label className="block text-xs text-gray-500 mb-1">Y el evento es:</label>
                    <select
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={newRule.event_type}
                      onChange={e => setNewRule({ ...newRule, event_type: e.target.value })}
                    >
                      <option value="new_claim">Nuevo Siniestro</option>
                      <option value="coverage_approved">Cobertura Aprobada</option>
                      <option value="coverage_rejected">Rechazo de Cobertura</option>
                    </select>
                  </div>
                  <div className="w-[250px]">
                    <label className="block text-xs text-gray-500 mb-1">Usar plantilla:</label>
                    <select
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={newRule.template_id}
                      onChange={e => setNewRule({ ...newRule, template_id: parseInt(e.target.value) })}
                    >
                      {(templates || []).map(t => (
                        <option key={t.flow_step} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button onClick={handleAddRule} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 h-[38px]">
                    <Plus size={16} /> Agregar Regla
                  </button>
                </div>

                <div className="space-y-2">
                  {(rules || []).map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">"{rule.keyword}"</span>
                        <span className="text-gray-500">→</span>
                        <span className="text-gray-300 font-medium">
                          {rule.event_type === 'new_claim' && 'Nuevo Siniestro'}
                          {rule.event_type === 'coverage_approved' && 'Cobertura Aprobada'}
                          {rule.event_type === 'coverage_rejected' && 'Rechazo Cobertura'}
                        </span>
                        <span className="text-gray-500">→</span>
                        <span className="text-blue-400">{rule.template_label || 'Plantilla desconocida'}</span>
                      </div>
                      <button onClick={() => handleDeleteRule(rule.id)} className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {(!rules || rules.length === 0) && <p className="text-gray-500 text-sm italic">No hay reglas definidas.</p>}
                </div>
              </div>

              {/* Sección de Plantillas */}
              <div className="bg-[#16191f] border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Edit3 className="text-blue-500" size={20} />
                  Gestión de Plantillas de Correo
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {(templates || []).map(t => (
                    <div key={t.flow_step} className="p-4 border border-gray-800 rounded-xl hover:bg-gray-800/50 transition-colors flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t.label}</p>
                        <p className="text-xs text-gray-400 truncate max-w-md">Asunto: {t.subject}</p>
                      </div>
                      <button
                        onClick={() => setEditingTemplate(t)}
                        className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-xs transition-colors"
                      >
                        Editar Plantilla
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {editingTemplate && (
                <div className="bg-[#16191f] border border-blue-500/30 rounded-2xl p-6 shadow-2xl animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Editando: {editingTemplate.label}</h3>
                    <button onClick={() => setEditingTemplate(null)} className="text-gray-500 hover:text-white">Cerrar</button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Asunto del Correo</label>
                      <input
                        type="text"
                        defaultValue={editingTemplate.subject}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Cuerpo (Formato Masculino)</label>
                      <textarea
                        rows={6}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none custom-scrollbar"
                        defaultValue="Cargando..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {
            activeTab === 'users' && user?.role === 'admin' && (
              <div className="bg-[#16191f] border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="text-blue-500" size={20} />
                  Gestión de Usuarios
                </h2>

                <div className="mb-6 flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Nombre Completo"
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] outline-none focus:border-blue-500"
                    value={newUser.full_name}
                    onChange={e => setNewUser({ ...newUser, full_name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] outline-none focus:border-blue-500"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] outline-none focus:border-blue-500"
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  <select
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="analyst">Analista</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Plus size={16} /> Crear
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-800">
                  <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-gray-900/50 uppercase text-xs font-semibold text-gray-500">
                      <tr>
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Rol</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-200">{u.full_name}</td>
                          <td className="px-4 py-3">{u.email}</td>
                          <td className="px-4 py-3 capitalize">{u.role}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${u.active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                              {u.active ? 'ACTIVO' : 'INACTIVO'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => handleDeleteUser(u.id)} className="text-red-400 hover:text-red-300 p-1" title="Eliminar usuario">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500 italic">
                            No hay usuarios registrados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }

          {
            activeTab === 'dashboard' && (
              <div className="bg-[#16191f] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Correos Recientes</h2>
                </div>
                <div className="divide-y divide-gray-800">
                  <EmailRow sender="rimac_notificaciones@rimac.com.pe" subject="AVISO DE SINIESTRO - Placa ABC-123" time="Hace 12 min" status="detectado" />
                  <EmailRow sender="seguros_lider@lider.com" subject="Aprobación de cobertura - EXP-2024" time="Hace 2 horas" status="aprobado" />
                </div>
              </div>
            )
          }
        </div>
      </main>
    </div>
  );
}

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${active ? 'bg-blue-600/10 text-blue-500 font-medium' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
        }`}>
      {icon}
      <span>{label}</span>
      {active && <div className="ml-auto w-1 h-4 bg-blue-500 rounded-full"></div>}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subValue: string;
  color: 'blue' | 'indigo' | 'emerald';
}

function StatCard({ title, value, subValue, color }: StatCardProps) {
  const colors = {
    blue: 'border-blue-500/20 bg-blue-500/5',
    indigo: 'border-indigo-500/20 bg-indigo-500/5',
    emerald: 'border-emerald-500/20 bg-emerald-500/5',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colors[color]} backdrop-blur-sm shadow-sm transition-transform hover:scale-[1.02]`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold">{value}</span>
        <span className={`text-xs ${color === 'emerald' ? 'text-emerald-500' : 'text-blue-500'}`}>{subValue}</span>
      </div>
    </div>
  );
}

interface EmailRowProps {
  sender: string;
  subject: string;
  time: string;
  status: 'detectado' | 'pendiente' | 'aprobado';
}

function EmailRow({ sender, subject, time, status }: EmailRowProps) {
  const statusConfig = {
    detectado: { label: 'Nuevo Siniestro', class: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    pendiente: { label: 'Análisis IA', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    aprobado: { label: 'Cobertura', class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  };

  return (
    <div className="p-4 hover:bg-gray-800/50 transition-colors flex items-center justify-between cursor-pointer group">
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm truncate">{sender}</span>
          <span className="text-xs text-gray-500">• {time}</span>
        </div>
        <p className="text-sm text-gray-400 truncate group-hover:text-gray-200 transition-colors">{subject}</p>
      </div>
      <div className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold border ${statusConfig[status].class}`}>
        {statusConfig[status].label}
      </div>
    </div>
  );
}

export default App;
