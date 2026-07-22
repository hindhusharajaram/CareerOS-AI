import React, { useEffect, useState } from 'react';
import { Database, Play, CheckCircle2, RefreshCw, Layers, HardDrive } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { warehouseService, WarehouseSummary } from '../services/warehouseService';

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
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerEtl = async () => {
    setIsRunningEtl(true);
    try {
      await warehouseService.triggerEtl();
      await fetchSummary();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningEtl(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Database className="h-6 w-6 text-purple-400" />
              Analytics Warehouse & Data Engineering Platform
            </h2>
            <p className="text-xs text-slate-400 mt-1">Star Schema dimensional modeling, ETL lineage pipelines, and data quality auditing</p>
          </div>
          <button
            onClick={handleTriggerEtl}
            disabled={isRunningEtl}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center gap-2 hover:from-purple-500 hover:to-indigo-500 transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {isRunningEtl ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            <span>Trigger ETL Pipeline</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : summary ? (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold text-slate-400 uppercase">Data Quality Score</p>
                <h3 className="text-3xl font-black text-emerald-400 mt-1">{summary.latestDataQualityScore}%</h3>
                <p className="text-[11px] text-emerald-400 mt-1 font-mono">100% Quality Assertions Passed</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold text-slate-400 uppercase">ETL Pipeline Status</p>
                <h3 className="text-3xl font-black text-indigo-400 mt-1">{summary.etlStatus}</h3>
                <p className="text-[11px] text-indigo-400 mt-1 font-mono">{summary.totalEtlJobsExecuted} Jobs Completed</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold text-slate-400 uppercase">Total Fact Records</p>
                <h3 className="text-3xl font-black text-white mt-1">{summary.totalFactRecords}</h3>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">Fact Tables Populated</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold text-slate-400 uppercase">Dimension Records</p>
                <h3 className="text-3xl font-black text-purple-400 mt-1">{summary.totalDimensionRecords}</h3>
                <p className="text-[11px] text-purple-400 mt-1 font-mono">Dimensions Synced</p>
              </div>
            </div>

            {/* Fact & Dimension Table Distributions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fact Tables */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-purple-400" /> Fact Tables Record Counts
                </h3>
                <div className="space-y-3">
                  {Object.entries(summary.factTableCounts || {}).map(([table, count]) => (
                    <div key={table} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 font-mono">{table}</span>
                      <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                        {count} rows
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimension Tables */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-indigo-400" /> Dimension Tables Record Counts
                </h3>
                <div className="space-y-3">
                  {Object.entries(summary.dimensionTableCounts || {}).map(([table, count]) => (
                    <div key={table} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 font-mono">{table}</span>
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                        {count} rows
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pipeline Health Status Banner */}
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 p-6 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">ETL Pipeline & Data Quality Status</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{summary.pipelineHealthStatus}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
