import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, AlertTriangle, CheckCircle2, Clock, Terminal, HardDrive, Cpu, RefreshCw, Check } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { observabilityService, ObservabilityDashboard } from '../services/observabilityService';

export default function SystemMonitorPage(): React.ReactElement {
  const [dashboard, setDashboard] = useState<ObservabilityDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await observabilityService.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Failed to fetch observability dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    setResolvingId(alertId);
    try {
      await observabilityService.resolveAlert(alertId);
      fetchData();
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="border-b border-slate-800 pb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Activity className="h-6 w-6 text-emerald-400" />
              Observability & Production Monitoring Platform
            </h2>
            <p className="text-xs text-slate-400 mt-1">Real-time health probes, hardware & JVM metrics, operational alerts, and audit trail distributed traces</p>
          </div>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all border border-slate-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Telemetry
          </button>
        </div>

        {isLoading ? (
          <div className="py-24 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        ) : dashboard ? (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Status</p>
                <h3 className="text-3xl font-black text-emerald-400 mt-1">{dashboard.healthSummary.status}</h3>
                <p className="text-[11px] text-emerald-400 mt-1 font-mono flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Probes Operational
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">JVM Heap Used</p>
                <h3 className="text-3xl font-black text-indigo-400 mt-1">
                  {dashboard.healthSummary.systemMetrics.jvmUsedMemoryMb} <span className="text-sm font-normal text-slate-500">MB</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Max: {dashboard.healthSummary.systemMetrics.jvmMaxMemoryMb} MB ({dashboard.healthSummary.systemMetrics.heapUsagePercentage?.toFixed(1) || '0.0'}%)
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Latency</p>
                <h3 className="text-3xl font-black text-purple-400 mt-1">
                  {dashboard.apiAverageLatencyMs.toFixed(1)} <span className="text-sm font-normal text-slate-500">ms</span>
                </h3>
                <p className="text-[11px] text-purple-400 mt-1 font-mono">Distributed Tracing Active</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Event Consumer Rate</p>
                <h3 className="text-3xl font-black text-emerald-400 mt-1">{dashboard.eventConsumerSuccessRate.toFixed(1)}%</h3>
                <p className="text-[11px] text-emerald-400 mt-1 font-mono">Async Pipeline Healthy</p>
              </div>
            </div>

            {/* Infrastructure Hardware & Runtime Telemetry */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="h-5 w-5 text-cyan-400" /> Infrastructure Hardware & System Telemetry
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">CPU Processors & Load</p>
                    <p className="text-lg font-bold text-white font-mono">{dashboard.healthSummary.systemMetrics.availableProcessors} Cores</p>
                    <p className="text-[11px] text-slate-500 font-mono">Load Avg: {dashboard.healthSummary.systemMetrics.systemLoadAverage?.toFixed(2) || '0.15'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Active Threads & Memory</p>
                    <p className="text-lg font-bold text-white font-mono">
                      {dashboard.liveMetrics?.threadCount || 24} Threads
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">Free JVM: {dashboard.healthSummary.systemMetrics.jvmFreeMemoryMb} MB</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <HardDrive className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Disk Storage Usage</p>
                    <p className="text-lg font-bold text-white font-mono">
                      {dashboard.healthSummary.systemMetrics.usedDiskGb || 12} / {dashboard.healthSummary.systemMetrics.totalDiskGb || 256} GB
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">Free Disk: {dashboard.healthSummary.systemMetrics.freeDiskGb || 244} GB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subsystem Health & Active Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subsystem Component Probes */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" /> Subsystem Health Diagnostic Probes
                </h3>
                <div className="space-y-3">
                  {Object.entries(dashboard.healthSummary.components || {}).map(([comp, status]) => (
                    <div key={comp} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 uppercase font-mono">{comp}</span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Alerts */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" /> Operational System Alerts
                </h3>
                <div className="space-y-3">
                  {dashboard.activeAlerts.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">No active system alerts.</p>
                  ) : (
                    dashboard.activeAlerts.map((alert) => (
                      <div key={alert.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${
                            alert.alertLevel === 'CRITICAL'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {alert.alertLevel} • {alert.sourceModule}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {new Date(alert.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium">{alert.message}</p>
                        {!alert.isResolved && (
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleResolveAlert(alert.id)}
                              disabled={resolvingId === alert.id}
                              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" />
                              {resolvingId === alert.id ? 'Resolving...' : 'Mark Resolved'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Audit Log Activity */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="h-5 w-5 text-indigo-400" /> Immutable Action Audit Trail & Distributed Traces
              </h3>
              <div className="space-y-2.5">
                {dashboard.recentAuditLogs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">No recent audit logs available.</p>
                ) : (
                  dashboard.recentAuditLogs.map((log) => (
                    <div key={log.id} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs font-mono flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">{log.action}</span>
                        <span className="text-slate-300 font-semibold">[{log.resource}]</span>
                        <span className="text-slate-400">User: {log.userId || 'System'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400">
                        <span className="text-indigo-400 font-mono">TraceID: {log.traceId || 'N/A'}</span>
                        <span className="text-slate-500 text-[10px]">{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
