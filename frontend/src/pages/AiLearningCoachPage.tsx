import React, { useEffect, useState } from 'react';
import { Compass, BookOpen, Clock, Calendar, ArrowRight, Layers } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AILearningPlan } from '../services/aiService';

export default function AiLearningCoachPage(): React.ReactElement {
  const [plan, setPlan] = useState<AILearningPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    setIsLoading(true);
    try {
      const data = await aiService.generateLearningPlan();
      setPlan(data);
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
            <Compass className="h-6 w-6 text-teal-400" />
            AI Learning Coach & Study Schedule
          </h2>
          <p className="text-xs text-slate-400 mt-1">Generates daily study routines and technology learning sequences tailored to your target role</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          </div>
        ) : plan ? (
          <div className="space-y-8">
            {/* Tech Sequence */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-teal-400 flex items-center gap-2">
                <Layers className="h-4 w-4" /> Recommended Technology Learning Sequence
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {plan.technologySequence.map((tech, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-4 py-2 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-bold font-mono">
                      {tech}
                    </span>
                    {idx < plan.technologySequence.length - 1 && <ArrowRight className="h-4 w-4 text-slate-600" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Daily Schedule */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-400" />
                Weekly Study Plan Routine
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.weeklyPlan.map((day, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 uppercase font-mono">{day.day}</span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-teal-400" /> {day.durationMinutes} Mins
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{day.topic}</h4>
                    <p className="text-xs text-slate-400">{day.activity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-400" /> Recommended Learning Resources
              </h3>
              <div className="space-y-2">
                {plan.recommendedResources.map((res, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 font-medium">
                    📖 {res}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
