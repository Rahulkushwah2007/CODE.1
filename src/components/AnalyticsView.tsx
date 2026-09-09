import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Building2,
  Users,
  Bed,
  Sparkles,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { country, shelters, t } = useApp();

  const countryShelters = useMemo(() => shelters.filter(s => s.country === country), [shelters, country]);

  // Capacity vs Occupancy chart data
  const capacityData = countryShelters.map(s => ({
    name: s.name.length > 15 ? s.name.substring(0, 14) + '…' : s.name,
    Occupied: s.currentOccupancy,
    Available: s.availableBeds,
    Total: s.totalCapacity
  }));

  // Pie chart data
  const totalOccupied = countryShelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const totalAvailable = countryShelters.reduce((acc, s) => acc + s.availableBeds, 0);

  const pieData = [
    { name: 'People Sheltered', value: totalOccupied, color: '#f97316' },
    { name: 'Available Vacant Beds', value: totalAvailable, color: '#10b981' }
  ];

  // Resource status aggregate
  const resourceData = countryShelters.map(s => ({
    name: s.city,
    WaterL: s.resources.drinkingWater.available,
    Rations: s.resources.foodRations.available,
    Beds: s.resources.beds.available
  }));

  return (
    <div id="analytics-view" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 text-[#F8FAFC]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#334155] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              TACTICAL OPERATIONS ANALYTICS
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white mt-1">
            {t('analytics')} ({country === 'IND' ? 'India' : 'Nepal'})
          </h1>
        </div>
      </div>

      {/* Top Aggregates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Capacity vs Occupancy Bar Chart */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#F97316]" />
              <span>{t('capacityStatus')}</span>
            </h2>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1329', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="Occupied" fill="#f97316" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="Available" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aggregate Pie Ratio */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <span>{t('vacantBeds')}</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {Math.round((totalOccupied / ((totalOccupied + totalAvailable) || 1)) * 100)}% Used
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1329', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Resource Stockpile Chart */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>{t('resources')}</span>
          </h2>
        </div>

        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resourceData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B1329', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="WaterL" fill="#38bdf8" name={t('drinkingWater') + ' (L)'} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Rations" fill="#f59e0b" name={t('hotFood')} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Beds" fill="#10b981" name="Beds" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
