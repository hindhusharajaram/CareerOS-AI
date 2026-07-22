import React, { useEffect, useState } from 'react';
import { Compass, Calendar } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, CareerRoadmapData, RoadmapTask } from '../services/intelligenceService';

export default function RoadmapPage(): React.ReactElement {
  const [roadmap, setRoadmap] = useState<CareerRoadmapData | null>(null);
  const [activeTab, setActiveTab] = useState<'30' | '60' | '90'>('30');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    setIsLoading(true);
    try {
      const data = await intelligenceService.getRoadmap();
      setRoadmap(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTasks = (): RoadmapTask[] => {
    if (!roadmap) return [];
    if (activeTab === '30') return roadmap.day30Roadmap;
    if (activeTab === '60') return roadmap.day60Roadmap;
    return roadmap.day90Roadmap;
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Compass className="h-6 w-6 text-purple-400" />
              Career Roadmap Generator
            </h2>
            <p className="text-xs text-slate-400 mt-1">Structured 30-Day, 60-Day, and 90-Day weekly action items for {roadmap?.targetRole || 'Target Role'}</p>
          </div>

          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('30')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === '30' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setActiveTab('60')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === '60' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              60 Days
            </button>
            <button
              onClick={() => setActiveTab('90')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === '90' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              90 Days
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              {activeTab}-Day Execution Timeline
            </h3>

            <div className="space-y-4">
              {getTasks().map((task, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-4 transition hover:border-purple-500/40">
                  <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 font-bold text-xs border border-purple-500/20">
                    {task.week}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-white">{task.title}</h4>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                        {task.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
