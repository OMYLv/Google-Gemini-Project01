import { Activity, TrendingUp, Award } from 'lucide-react';

export default function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        <div className="relative card bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white border-2 border-blue-400/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">Total Processed</p>
              <p className="text-5xl font-black mt-2 drop-shadow-lg">{stats.totalProcessed}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-xl">
              <Activity className="w-10 h-10 animate-pulse" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        <div className="relative card bg-gradient-to-br from-red-600 via-red-500 to-pink-500 text-white border-2 border-red-400/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-semibold uppercase tracking-wider">Critical Alerts</p>
              <p className="text-5xl font-black mt-2 drop-shadow-lg">{stats.criticalAlerts}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-xl">
              <TrendingUp className="w-10 h-10 animate-bounce-slow" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        <div className="relative card bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 text-white border-2 border-green-400/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-semibold uppercase tracking-wider">Avg Confidence</p>
              <p className="text-5xl font-black mt-2 drop-shadow-lg">
                {(stats.avgConfidence * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-xl">
              <Award className="w-10 h-10 animate-wiggle" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
