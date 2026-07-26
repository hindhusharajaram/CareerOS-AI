import React, { useEffect, useState } from 'react';
import { ShieldCheck, Clock, HardDrive, Cpu, RefreshCw, Check, Activity, CheckCircle2, Terminal, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { observabilityService, ObservabilityDashboard } from '../services/observabilityService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard, StatCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonStatGrid, SkeletonCard } from '../components/ui/Skeleton';
import { ProgressBar as Progress } from '../components/ui/Progress';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

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
      toast.error('Failed to fetch observability telemetry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    setResolvingId(alertId);
    try {
      await observabilityService.resolveAlert(alertId);
      fetchData();
      toast.success('Alert resolved successfully');
    } catch (err) {
      toast.error('Failed to resolve alert.');
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Observability Monitor"
          subtitle="Real-time health probes, hardware metrics, alerts, and distributed tracing."
          badge="Production Systems"
          icon={<Activity className="h-6 w-6" />}
          action={
            <Button
              onClick={fetchData}
              isLoading={isLoading}
              variant="outline"
              icon={<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Sync Telemetry
            </Button>
          }
        />

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonStatGrid cols={4} />
            <SkeletonCard className="h-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard className="h-[400px]" />
              <SkeletonCard className="h-[400px]" />
            </div>
          </div>
        ) : dashboard ? (
          <div className="space-y-6 animate-fade-up">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                title="System Status"
                value={dashboard.healthSummary.status}
                subtitle="Probes Operational"
                icon={<CheckCircle2 className="h-5 w-5" />}
                color="emerald"
                trend={0}
              />
              <StatCard
                title="JVM Heap Used"
                value={`${dashboard.healthSummary.systemMetrics.jvmUsedMemoryMb}MB`}
                subtitle={`Max: ${dashboard.healthSummary.systemMetrics.jvmMaxMemoryMb}MB`}
                icon={<Cpu className="h-5 w-5" />}
                color="indigo"
              />
              <StatCard
                title="Avg Latency"
                value={`${dashboard.apiAverageLatencyMs.toFixed(1)}ms`}
                subtitle="Distributed Tracing"
                icon={<Activity className="h-5 w-5" />}
                color="purple"
              />
              <StatCard
                title="Event Pipeline"
                value={`${dashboard.eventConsumerSuccessRate.toFixed(1)}%`}
                subtitle="Async Success Rate"
                icon={<Terminal className="h-5 w-5" />}
                color="indigo"
              />
            </div>

            {/* Infrastructure Hardware & Runtime Telemetry */}
            <GlassCard padding="lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <HardDrive className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">Infrastructure & Runtime Telemetry</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-inner relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Cpu className="h-20 w-20 text-cyan-400" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Processors</p>
                    <p className="text-2xl font-black text-white font-mono mb-4">{dashboard.healthSummary.systemMetrics.availableProcessors} Cores</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium mb-2">
                        <span className="text-slate-400">System Load</span>
                        <span className="text-cyan-400 font-mono">{dashboard.healthSummary.systemMetrics.systemLoadAverage?.toFixed(2) || '0.15'}</span>
                      </div>
                      <Progress value={((dashboard.healthSummary.systemMetrics.systemLoadAverage || 0.15) / dashboard.healthSummary.systemMetrics.availableProcessors) * 100} color="indigo" size="sm" showValue={false} />
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-inner relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="h-20 w-20 text-indigo-400" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Active Threads</p>
                    <p className="text-2xl font-black text-white font-mono mb-4">{dashboard.liveMetrics?.threadCount || 24}</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium mb-2">
                        <span className="text-slate-400">JVM Free Memory</span>
                        <span className="text-indigo-400 font-mono">{dashboard.healthSummary.systemMetrics.jvmFreeMemoryMb} MB</span>
                      </div>
                      <Progress value={100 - (dashboard.healthSummary.systemMetrics.heapUsagePercentage || 0)} color="purple" size="sm" showValue={false} />
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-inner relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <HardDrive className="h-20 w-20 text-amber-400" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Disk Storage</p>
                    <p className="text-2xl font-black text-white font-mono mb-4">
                      {dashboard.healthSummary.systemMetrics.usedDiskGb || 12} <span className="text-base text-slate-500 font-sans">/ {dashboard.healthSummary.systemMetrics.totalDiskGb || 256} GB</span>
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400">Used Capacity</span>
                        <span className="text-amber-400 font-mono">{(((dashboard.healthSummary.systemMetrics.usedDiskGb || 12) / (dashboard.healthSummary.systemMetrics.totalDiskGb || 256)) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={((dashboard.healthSummary.systemMetrics.usedDiskGb || 12) / (dashboard.healthSummary.systemMetrics.totalDiskGb || 256)) * 100} color="amber" size="sm" showValue={false} />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subsystem Component Probes */}
              <GlassCard padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Subsystem Probes</h3>
                  </div>
                  <Badge variant="emerald">Online</Badge>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(dashboard.healthSummary.components || {}).map(([comp, status]) => (
                    <div key={comp} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between group hover:bg-slate-800/60 transition-colors">
                      <span className="text-sm font-semibold text-slate-300 uppercase font-mono tracking-tight">{comp}</span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5 shadow-inner">
                        <CheckCircle2 className="h-4 w-4" /> {status}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Active Alerts */}
              <GlassCard padding="lg" className="flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">System Alerts</h3>
                  </div>
                  {dashboard.activeAlerts.length > 0 && (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  )}
                </div>
                
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] custom-scrollbar pr-2">
                  {dashboard.activeAlerts.length === 0 ? (
                    <EmptyState
                      icon={<ShieldCheck />}
                      title="No Active Alerts"
                      description="All systems are operating normally."
                      className="py-12"
                    />
                  ) : (
                    dashboard.activeAlerts.map((alert) => (
                      <div key={alert.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-4">
                          <span className={`text-[10px] font-bold font-mono px-2 py-1 rounded-md border tracking-wider uppercase ${
                            alert.alertLevel === 'CRITICAL'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {alert.alertLevel} • {alert.sourceModule}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 bg-slate-950 px-2 py-1 rounded">
                            <Clock className="h-3 w-3" /> {new Date(alert.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-200 font-medium leading-relaxed">{alert.message}</p>
                        {!alert.isResolved && (
                          <div className="flex justify-end pt-2 border-t border-slate-800/60 mt-1">
                            <button
                              onClick={() => handleResolveAlert(alert.id)}
                              disabled={resolvingId === alert.id}
                              className="text-[11px] font-bold tracking-wider uppercase text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                            >
                              <Check className="h-3.5 w-3.5" />
                              {resolvingId === alert.id ? 'Resolving...' : 'Mark Resolved'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Audit Log Activity */}
            <GlassCard padding="lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Terminal className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">Immutable Audit Trail</h3>
              </div>
              
              <div className="space-y-3">
                {dashboard.recentAuditLogs.length === 0 ? (
                  <EmptyState
                    icon={<Terminal />}
                    title="No Audit Logs"
                    description="System audit trail is currently empty."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400 font-mono">
                      <thead className="text-xs uppercase bg-slate-900/80 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-xl">Timestamp</th>
                          <th className="px-4 py-3">Action</th>
                          <th className="px-4 py-3">Resource</th>
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3 rounded-tr-xl text-right">Trace ID</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {dashboard.recentAuditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="px-4 py-3 text-xs whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-xs border border-emerald-500/20">
                                {log.action}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-300 font-semibold">{log.resource}</td>
                            <td className="px-4 py-3 text-slate-500">{log.userId || 'System'}</td>
                            <td className="px-4 py-3 text-indigo-400 text-right text-xs truncate max-w-[120px]" title={log.traceId}>
                              {log.traceId || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
