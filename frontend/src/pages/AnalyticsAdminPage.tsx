import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Server, BarChart2 } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { analyticsService, AnalyticsSummary } from '../services/analyticsService';

export default function AnalyticsAdminPage(): React.ReactElement {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const data = await analyticsService.getSummary();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-indigo-400" />
            Event-Driven Analytics Admin Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">Real-time processing telemetry, event queue health, and user activity metrics</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : summary ? (
          <div className="space-y-8">
            {/* Master Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold text-slate-400 uppercase">Total Event Volume</p>
                <h3 className="text-3xl font-black text-white mt-1">{summary.totalEventsLogged}</h3>
                <p className="text-[11px] text-indigo-400 mt-1 font-mono">Immutable Events Logged</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold text-slate-400 uppercase">Consumer Success Rate</p>
                <h3 className="text-3xl font-black text-emerald-400 mt-1">{summary.successRatePercentage.toFixed(1)}%</h3>
                <p className="text-[11px] text-emerald-400 mt-1 font-mono">Async Consumers Healthy</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold text-slate-400 uppercase">Avg Event Latency</p>
                <h3 className="text-3xl font-black text-purple-400 mt-1">{summary.averageLatencyMs.toFixed(1)} <span className="text-sm font-normal text-slate-500">ms</span></h3>
                <p className="text-[11px] text-purple-400 mt-1 font-mono">Non-Blocking Transport</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold text-slate-400 uppercase">Daily Active Users</p>
                <h3 className="text-3xl font-black text-white mt-1">{summary.dailyActiveUsers}</h3>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">WAU: {summary.weeklyActiveUsers} | MAU: {summary.monthlyActiveUsers}</p>
              </div>
            </div>

            {/* Top Feature Usage & System Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature Usage Distribution */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-indigo-400" /> Top Platform Event Types Logged
                </h3>
                <div className="space-y-3">
                  {Object.entries(summary.topFeatures || {}).map(([feat, count]) => (
                    <div key={feat} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 font-mono">{feat}</span>
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                        {count} events
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health Flags */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="h-5 w-5 text-emerald-400" /> Platform Event System Health
                </h3>
                <div className="space-y-3">
                  {summary.systemHealthFlags.map((flag, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
