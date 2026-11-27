import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  Calendar as CalendarIcon,
  TrendingUp,
  Bell,
  Search,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckCircle2,
  Wrench,
  IndianRupee,
  Clock,
  User,
  Hash,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- MOCK DATA & DB CONFIG ---
const HYUNDAI_MODELS = ['Creta', 'Venue', 'i20', 'Verna', 'Tucson', 'Alcazar', 'Exeter', 'Aura'];

const FALLBACK_VEHICLES = [
  {
    id: 'V1',
    customerName: 'Aarav Sharma',
    contact: '+91 9876543210',
    model: 'Creta',
    engineNo: 'G4AL1234567',
    chassisNo: 'MAL1234567890ABCD',
    checkInDate: '2026-10-25',
    deadline: '2026-11-05',
    serviceHistory: ['2025-05-12', '2026-01-20'],
    parts: [
      { name: 'Engine Overhaul', price: 45000 },
      { name: 'Brake Pads', price: 2500 }
    ],
    totalCost: 47500,
    status: 'In Progress'
  },
  {
    id: 'V2',
    customerName: 'Priya Singh',
    contact: '+91 9876543211',
    model: 'i20',
    engineNo: 'G3AL9876543',
    chassisNo: 'MAL0987654321WXYZ',
    checkInDate: '2026-11-01',
    deadline: '2026-11-04',
    serviceHistory: ['2026-06-15'],
    parts: [
      { name: 'General Service', price: 4500 },
      { name: 'Air Filter', price: 800 }
    ],
    totalCost: 5300,
    status: 'Pending'
  },
  {
    id: 'V3',
    customerName: 'Neha Gupta',
    contact: '+91 9876543213',
    model: 'Venue',
    engineNo: 'G3BL5678901',
    chassisNo: 'MAL5678901234ASDF',
    checkInDate: '2026-11-02',
    deadline: '2026-11-03',
    serviceHistory: ['2025-11-02'],
    parts: [
      { name: 'Battery Replacement', price: 5500 }
    ],
    totalCost: 5500,
    status: 'Approaching Deadline'
  }
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('servesmart-vehicles');
      return saved ? JSON.parse(saved) : FALLBACK_VEHICLES;
    } catch {
      return FALLBACK_VEHICLES;
    }
  });
  const [toastMessage, setToastMessage] = useState(null);

  // Save changes in this browser so the demo works without a backend.
  useEffect(() => {
    try {
      localStorage.setItem('servesmart-vehicles', JSON.stringify(vehicles));
    } catch (err) {
      console.warn('Could not save vehicle data locally:', err);
    }
  }, [vehicles]);


  const updateVehicleStatus = (id, newStatus) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };


  const handleRegisterVehicle = (newVehicle) => {
    setVehicles(prev => [...prev, newVehicle]);
    return true;
  };


  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView vehicles={vehicles} navigateTo={setActiveTab} />;
      case 'vehicle-list':
        return <VehicleListView vehicles={vehicles} showToast={showToast} updateVehicleStatus={updateVehicleStatus} />;
      case 'register':
        return <RegisterVehicleView vehicles={vehicles} onRegister={handleRegisterVehicle} navigateTo={setActiveTab} showToast={showToast} />;
      case 'calendar':
        return <CalendarView vehicles={vehicles} />;
      case 'analytics':
        return <AnalyticsView vehicles={vehicles} />;
      default:
        return <DashboardView vehicles={vehicles} navigateTo={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
        <div className="p-6 flex items-center gap-3 bg-slate-950 border-b border-slate-800">
          <Wrench className="w-8 h-8 text-indigo-500" />
          <h1 className="text-xl font-bold text-white tracking-wide">Serve<span className="text-indigo-500">Smart</span></h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<Car />} label="Vehicle List" isActive={activeTab === 'vehicle-list'} onClick={() => setActiveTab('vehicle-list')} />
          <SidebarItem icon={<PlusCircle />} label="Register Vehicle" isActive={activeTab === 'register'} onClick={() => setActiveTab('register')} />
          <SidebarItem icon={<CalendarIcon />} label="Deadlines" isActive={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
          <SidebarItem icon={<TrendingUp />} label="Analytics" isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-center">
          &copy; 2026 Serve Smart
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold capitalize text-slate-800">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              A
            </div>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-auto p-8">
          {renderContent()}
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-8 right-8 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="text-green-400 w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SidebarItem({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'hover:bg-slate-800 hover:text-white'}`}
    >
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
      <span className="font-medium">{label}</span>
    </button>
  );
}

// 1. Dashboard View
function DashboardView({ vehicles, navigateTo }) {
  const stats = useMemo(() => {
    const active = vehicles.length;
    const approaching = vehicles.filter(v => v.status === 'Approaching Deadline' || new Date(v.deadline) < new Date(new Date().setDate(new Date().getDate() + 2))).length;
    const totalRevenue = vehicles.reduce((sum, v) => sum + v.totalCost, 0);
    return { active, approaching, totalRevenue };
  }, [vehicles]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Vehicles in Service" value={stats.active} icon={<Car className="w-8 h-8 text-blue-500" />} bgColor="bg-blue-50" />
        <StatCard title="Approaching Deadlines" value={stats.approaching} icon={<Clock className="w-8 h-8 text-red-500" />} bgColor="bg-red-50" />
        <StatCard title="Projected Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} icon={<IndianRupee className="w-8 h-8 text-emerald-500" />} bgColor="bg-emerald-50" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Recent Service Entries</h3>
          <button onClick={() => navigateTo('vehicle-list')} className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 border-b border-slate-100 text-sm">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Model</th>
                <th className="pb-3 font-medium">Check-In</th>
                <th className="pb-3 font-medium">Deadline</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.slice(-5).reverse().map(v => (
                <tr key={v.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-4 font-medium text-slate-700">{v.customerName}</td>
                  <td className="py-4">{v.model}</td>
                  <td className="py-4 text-slate-500">{v.checkInDate}</td>
                  <td className="py-4 font-medium text-slate-700">{v.deadline}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      v.status === 'Done' ? 'bg-green-100 text-green-700' :
                      v.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      v.status === 'Approaching Deadline' ? 'bg-red-100 text-red-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
      <div className={`p-4 rounded-lg ${bgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

// 2. Vehicle List View
function VehicleListView({ vehicles, showToast, updateVehicleStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModel, setFilterModel] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = v.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            v.engineNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            v.chassisNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModel = filterModel === 'All' || v.model === filterModel;
      return matchesSearch && matchesModel;
    });
  }, [vehicles, searchTerm, filterModel]);

  const handleNotify = (e, vehicle) => {
    e.stopPropagation();
    if (vehicle.status === 'Done') {
      showToast(`Notification sent: Please ask ${vehicle.customerName} to pick up their vehicle!`);
    } else {
      showToast(`Notification sent successfully to ${vehicle.customerName}!`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by customer, engine or chassis no..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          value={filterModel}
          onChange={(e) => setFilterModel(e.target.value)}
        >
          <option value="All">All Models</option>
          {HYUNDAI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
            <tr>
              <th className="p-4 font-semibold">Customer Details</th>
              <th className="p-4 font-semibold">Vehicle & Model</th>
              <th className="p-4 font-semibold">Timeline</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">No vehicles found matching criteria.</td>
              </tr>
            ) : (
              filteredVehicles.map(v => (
                <React.Fragment key={v.id}>
                  <tr 
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                    onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
                  >
                    <td className="p-4">
                      <p className="font-medium text-slate-800">{v.customerName}</p>
                      <p className="text-xs text-slate-500 mt-1">{v.contact}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-indigo-600">{v.model}</p>
                      <p className="text-xs text-slate-500 mt-1 font-mono">{v.engineNo}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm"><span className="text-slate-500">In:</span> {v.checkInDate}</p>
                      <p className="text-sm font-medium text-slate-800 mt-1"><span className="text-slate-500">Out:</span> {v.deadline}</p>
                    </td>
                    <td className="p-4">
                      <select 
                        value={v.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateVehicleStatus(v.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-3 py-1 rounded-full text-xs font-semibold outline-none cursor-pointer border transition-colors ${
                          v.status === 'Done' ? 'bg-green-100 text-green-700 border-green-200' :
                          v.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          v.status === 'Approaching Deadline' ? 'bg-red-100 text-red-700 border-red-200' : 
                          'bg-blue-100 text-blue-700 border-blue-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Approaching Deadline">Approaching Deadline</option>
                        <option value="Done">Done</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <button 
                          onClick={(e) => handleNotify(e, v)}
                          className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                          title="Notify Customer"
                        >
                          <Bell className="w-4 h-4" /> Notify
                        </button>
                        {expandedId === v.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded View Details */}
                  {expandedId === v.id && (
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <td colSpan="5" className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Tracking Details */}
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                              <Hash className="w-4 h-4 text-indigo-500" /> Vehicle Tracking
                            </h4>
                            <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3 shadow-sm">
                              <div className="flex justify-between border-b border-slate-100 pb-2">
                                <span className="text-slate-500 text-sm">Engine Number</span>
                                <span className="font-mono text-slate-800 font-medium">{v.engineNo}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 pb-2">
                                <span className="text-slate-500 text-sm">Chassis Number</span>
                                <span className="font-mono text-slate-800 font-medium">{v.chassisNo}</span>
                              </div>
                              <div className="pt-2">
                                <span className="text-slate-500 text-sm block mb-2">Service History Dates</span>
                                <div className="flex flex-wrap gap-2">
                                  {v.serviceHistory.length > 0 ? v.serviceHistory.map((date, idx) => (
                                    <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded border border-indigo-100">
                                      {date}
                                    </span>
                                  )) : <span className="text-sm text-slate-400 italic">No past history recorded.</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Expenditure & Parts */}
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                              <Wrench className="w-4 h-4 text-emerald-500" /> Quotation & Replaced Parts
                            </h4>
                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <ul className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2">
                                {v.parts.map((p, idx) => (
                                  <li key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                                    <span className="text-slate-700">{p.name}</span>
                                    <span className="font-medium text-slate-800">₹{p.price.toLocaleString('en-IN')}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                                <span className="font-bold text-slate-800">Total Expenditure</span>
                                <span className="font-bold text-emerald-600 text-lg">₹{v.totalCost.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 3. Register Vehicle View (Quotation Builder)
function RegisterVehicleView({ vehicles, onRegister, navigateTo, showToast }) {
  const [formData, setFormData] = useState({
    customerName: '',
    contact: '',
    model: HYUNDAI_MODELS[0],
    engineNo: '',
    chassisNo: '',
    checkInDate: new Date().toISOString().split('T')[0],
    deadline: ''
  });
  
  const [parts, setParts] = useState([]);
  const [newPartName, setNewPartName] = useState('');
  const [newPartPrice, setNewPartPrice] = useState('');

  const totalCost = parts.reduce((sum, p) => sum + p.price, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addPart = () => {
    if (!newPartName.trim() || !newPartPrice) return;
    setParts([...parts, { name: newPartName, price: Number(newPartPrice) }]);
    setNewPartName('');
    setNewPartPrice('');
  };

  const removePart = (index) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.engineNo || !formData.chassisNo || !formData.deadline) {
      showToast("Please fill all required vehicle and customer fields.");
      return;
    }

    const newVehicle = {
      id: `V${vehicles.length + 1}-${Date.now()}`,
      ...formData,
      serviceHistory: [], 
      parts: [...parts],
      totalCost: totalCost,
      status: 'In Progress'
    };

    const success = await onRegister(newVehicle);
    
    if (success === false) {
      showToast("Vehicle registered locally (Backend unreachable)!");
    } else {
      showToast("Vehicle registered and saved to database successfully!");
    }
    
    navigateTo('vehicle-list');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User className="text-indigo-500 w-5 h-5"/> Customer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Rahul Sharma" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                <input required type="text" name="contact" value={formData.contact} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="+91..." />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Car className="text-indigo-500 w-5 h-5"/> Vehicle Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Car Model</label>
                <select name="model" value={formData.model} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  {HYUNDAI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div></div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Engine Number</label>
                <input required type="text" name="engineNo" value={formData.engineNo} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-mono" placeholder="Engine No." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chassis Number</label>
                <input required type="text" name="chassisNo" value={formData.chassisNo} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-mono" placeholder="Chassis No." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Check-in Date</label>
                <input required type="date" name="checkInDate" value={formData.checkInDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Deadline</label>
                <input required type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Quotation Builder */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Wrench className="text-emerald-500 w-5 h-5"/> Quotation Builder
          </h3>
          
          <div className="flex-1 overflow-y-auto mb-6 border border-slate-100 rounded-lg bg-slate-50 p-3">
            {parts.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-8 italic">No parts added yet. Add items below to build the quote.</p>
            ) : (
              <ul className="space-y-3">
                {parts.map((p, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-500">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                    <button type="button" onClick={() => removePart(idx)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <input 
              type="text" 
              placeholder="Part / Component Name" 
              value={newPartName} 
              onChange={e => setNewPartName(e.target.value)} 
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Price (₹)" 
                value={newPartPrice} 
                onChange={e => setNewPartPrice(e.target.value)} 
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button 
                type="button" 
                onClick={addPart}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap"
              >
                Add Item
              </button>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-200">
              <span className="text-lg font-semibold text-slate-600">Grand Total</span>
              <span className="text-2xl font-bold text-emerald-600">₹{totalCost.toLocaleString('en-IN')}</span>
            </div>
            
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-bold transition-all shadow-md active:scale-[0.98]">
              Register & Save Quotation
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// 4. Calendar / Deadlines View
function CalendarView({ vehicles }) {
  // We use November 2026 as the default date to match the placeholder data context
  const [currentDate, setCurrentDate] = useState(new Date('2026-11-01')); 

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Array containing null for empty offset days, and numbers for actual days
  const days = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    if (i < firstDay) return null;
    return i - firstDay + 1;
  });

  const getDeadlinesForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return vehicles.filter(v => v.deadline === dateStr);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-indigo-500" /> Service Deadlines
        </h3>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="text-lg font-semibold text-slate-800 w-40 text-center">{monthName}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
      
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-200 gap-px grid grid-cols-7">
        {weekDays.map(day => (
          <div key={day} className="bg-slate-50 py-3 text-center text-sm font-semibold text-slate-600">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          const dayDeadlines = getDeadlinesForDay(day);
          const isToday = day && new Date().toISOString().split('T')[0] === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          return (
            <div key={index} className={`bg-white min-h-[120px] p-2 transition-colors hover:bg-slate-50 ${isToday ? 'bg-indigo-50/30' : ''}`}>
              {day && (
                <>
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-2 ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}>
                    {day}
                  </span>
                  <div className="space-y-1">
                    {dayDeadlines.map(v => (
                      <div key={v.id} className="bg-red-50 border border-red-100 text-red-700 px-2 py-1.5 rounded text-xs truncate shadow-sm" title={`${v.model} - ${v.customerName}`}>
                        <span className="font-bold">{v.model}</span> • {v.customerName}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 5. Analytics View
function AnalyticsView({ vehicles }) {
  const modelStats = useMemo(() => {
    const stats = {};
    HYUNDAI_MODELS.forEach(m => {
      stats[m] = { model: m, revenue: 0, partsMap: {}, topComponent: 'N/A', topExpense: 0 };
    });

    vehicles.forEach(v => {
      if(stats[v.model]) {
        stats[v.model].revenue += v.totalCost;
        v.parts.forEach(p => {
          stats[v.model].partsMap[p.name] = (stats[v.model].partsMap[p.name] || 0) + p.price;
        });
      }
    });

    // Calculate top component for each model
    Object.values(stats).forEach(stat => {
      let maxCost = 0;
      let topPartName = 'N/A';
      for (const [part, cost] of Object.entries(stat.partsMap)) {
        if (cost > maxCost) {
          maxCost = cost;
          topPartName = part;
        }
      }
      stat.topComponent = topPartName;
      stat.topExpense = maxCost;
    });

    return Object.values(stats).filter(s => s.revenue > 0);
  }, [vehicles]);

  const rankedExpenses = useMemo(() => {
    const partsArr = [];
    vehicles.forEach(v => {
      v.parts.forEach(p => {
        const existing = partsArr.find(item => item.part === p.name && item.model === v.model);
        if (existing) {
          existing.total += p.price;
        } else {
          partsArr.push({ part: p.name, model: v.model, total: p.price });
        }
      });
    });
    // Sort descending by total expense
    return partsArr.sort((a, b) => b.total - a.total);
  }, [vehicles]);

  const pieData = modelStats.map(s => ({ name: s.model, value: s.revenue }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top Cards for Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue by Model</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="model" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Revenue Share</h3>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Component Expense Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="text-indigo-500 w-5 h-5" /> Highest Component Expenses per Model
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modelStats.map((stat, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 p-5 rounded-lg flex flex-col">
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">{stat.model}</span>
              <p className="text-slate-600 text-sm mb-1">Top Expense Category:</p>
              <p className="font-semibold text-slate-800 text-lg mb-3 break-words">{stat.topComponent}</p>
              <div className="mt-auto border-t border-slate-200 pt-3 flex justify-between items-center">
                <span className="text-xs text-slate-500">Max Spend</span>
                <span className="font-bold text-emerald-600">₹{stat.topExpense.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
          {modelStats.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-500 italic">
              No revenue data available to compute expenses.
            </div>
          )}
        </div>
      </div>

      {/* Component Expense Analysis - Ranked List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-indigo-500 w-5 h-5" /> Ranked Component Expenses
          </h3>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Overall Rankings</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-600 text-sm">
                <th className="py-4 pl-6 pr-4 font-semibold w-16 text-center">Rank</th>
                <th className="py-4 px-4 font-semibold">Component / Part Replaced</th>
                <th className="py-4 px-4 font-semibold">Car Model</th>
                <th className="py-4 px-6 font-semibold text-right">Total Amount Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankedExpenses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-500 italic">
                    No expense data available.
                  </td>
                </tr>
              ) : (
                rankedExpenses.map((expense, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 pl-6 pr-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                        ${idx === 0 ? 'bg-amber-100 text-amber-700' : 
                          idx === 1 ? 'bg-slate-200 text-slate-700' : 
                          idx === 2 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'}`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-800">
                      {expense.part}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {expense.model}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-emerald-600">
                      ₹{expense.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}