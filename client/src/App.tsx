import { useState, useEffect, ReactNode } from 'react';
import { Mail, ShieldCheck, FileText, Settings, LayoutDashboard, Bell, Edit3, Save } from 'lucide-react';

interface Template {
  flow_step: string;
  label: string;
  subject: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  // Simulación de carga de plantillas (E05)
  useEffect(() => {
    if (activeTab === 'config') {
      // En un entorno real: fetch('/api/templates')
      setTemplates([
        { flow_step: 'aviso_inicial', label: '1. Aviso Inicial', subject: 'Actualización Siniestro' },
        { flow_step: 'cobertura_aprobada', label: '3.a Cobertura Aprobada', subject: 'Cobertura Aprobada' },
        { flow_step: 'fin_atencion', label: '9. Fin de Atención', subject: 'Garantía de Reparación' }
      ]);
    }
  }, [activeTab]);

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
        </nav>
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
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">AD</div>
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
            <div className="space-y-6">
              <div className="bg-[#16191f] border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Edit3 className="text-blue-500" size={20} />
                  Gestión de Plantillas de Correo
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {templates.map(t => (
                    <div key={t.flow_step} className="p-4 border border-gray-800 rounded-xl hover:bg-gray-800/50 transition-colors flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t.label}</p>
                        <p className="text-xs text-gray-400">Asunto: {t.subject}</p>
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
                        defaultValue="Estimado Sr. ..."
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancelar</button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                        <Save size={16} /> Guardar Cambios
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="bg-[#16191f] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Correos Recientes</h2>
              </div>
              <div className="divide-y divide-gray-800">
                <EmailRow sender="rimac_notificaciones@rimac.com.pe" subject="AVISO DE SINIESTRO - Placa ABC-123" time="Hace 12 min" status="detectado" />
                <EmailRow sender="seguros_lider@lider.com" subject="Aprobación de cobertura - EXP-2024" time="Hace 2 horas" status="aprobado" />
              </div>
            </div>
          )}
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
