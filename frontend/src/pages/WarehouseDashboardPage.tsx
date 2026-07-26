import React, { useEffect, useState } from 'react';
import { Database, Play, CheckCircle2, RefreshCw, Layers, HardDrive } from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { warehouseService, WarehouseSummary } from '../services/warehouseService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard, StatCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SkeletonStatGrid, SkeletonCard } from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import AnimatedCounter from '../components/ui/AnimatedCounter';

export default function WarehouseDashboardPage(): React.ReactElement {
  const [summary, setSummary] = useState<WarehouseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningEtl, setIsRunningEtl] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const data = await warehouseService.getSummary();
      setSummary(data);
    } catch (err) {
      toast.error('Failed to load warehouse data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerEtl = async () => {
    setIsRunningEtl(true);
    const toastId = toast.loading('Initializing ETL Pipeline...');
    try {
      await warehouseService.triggerEtl();
      await fetchSummary();
      toast.success('ETL Pipeline execution completed successfully', { id: toastId });
    } catch (err) {
      toast.error('ETL Pipeline execution failed', { id: toastId });
    } finally {
      setIsRunningEtl(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Data Warehouse"
          subtitle="Star Schema dimensional modeling, ETL lineage pipelines, and data quality metrics."
          badge="Data Engineering"
          icon={<Database className="h-6 w-6" />}
          action={
            <Button
              onClick={handleTriggerEtl}
              isLoading={isRunningEtl}
              variant="primary"
              icon={<Play className="h-4 w-4" />}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-none shadow-lg shadow-purple-500/20"
            >
              Trigger ETL Job
            </Button>
          }
        />

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonStatGrid cols={4} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard className="h-80" />
              <SkeletonCard className="h-80" />
            </div>
          </div>
        ) : summary ? (
          <div className="space-y-6 animate-fade-up">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                title="Data Quality"
                value={`${summary.latestDataQualityScore}%`}
                subtitle="Assertions Passed"
                icon={<CheckCircle2 className="h-5 w-5" />}
                color="emerald"
                trend={0}
              />
              <StatCard
                title="ETL Status"
                value={summary.etlStatus}
                subtitle={`${summary.totalEtlJobsExecuted} Jobs Completed`}
                icon={<RefreshCw className="h-5 w-5" />}
                color="indigo"
              />
              <StatCard
                title="Fact Records"
                value={summary.totalFactRecords.toString()}
                subtitle="Populated Facts"
                icon={<HardDrive className="h-5 w-5" />}
                color="purple"
              />
              <StatCard
                title="Dimension Records"
                value={summary.totalDimensionRecords.toString()}
                subtitle="Synced Dimensions"
                icon={<Layers className="h-5 w-5" />}
                color="indigo"
              />
            </div>

            {/* Fact & Dimension Table Distributions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fact Tables */}
              <GlassCard padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <HardDrive className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Fact Tables Lineage</h3>
                  </div>
                  <Badge variant="purple">{Object.keys(summary.factTableCounts || {}).length} Tables</Badge>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(summary.factTableCounts || {}).map(([table, count]) => (
                    <div key={table} className="group p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 hover:border-purple-500/30 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="h-4 w-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                        <span className="text-sm font-semibold text-slate-200 font-mono tracking-tight">{table}</span>
                      </div>
                      <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 shadow-inner flex items-baseline gap-1">
                        <AnimatedCounter target={count} /> rows
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Dimension Tables */}
              <GlassCard padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Layers className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Dimension Tables Lineage</h3>
                  </div>
                  <Badge variant="indigo">{Object.keys(summary.dimensionTableCounts || {}).length} Tables</Badge>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(summary.dimensionTableCounts || {}).map(([table, count]) => (
                    <div key={table} className="group p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-sm font-semibold text-slate-200 font-mono tracking-tight">{table}</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 shadow-inner flex items-baseline gap-1">
                        <AnimatedCounter target={count} /> rows
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Pipeline Health Status Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 shadow-lg shadow-emerald-500/5 group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                     <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">ETL Pipeline & Data Quality Status</h4>
                    <p className="text-sm text-emerald-100/70 font-medium mt-1">{summary.pipelineHealthStatus}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner">
                    SYSTEM ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
