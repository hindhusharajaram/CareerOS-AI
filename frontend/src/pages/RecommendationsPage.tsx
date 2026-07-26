import React, { useEffect, useState } from 'react';
import { Sparkles, BookOpen, Layers, Lightbulb, Target } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, RecommendationData } from '../services/intelligenceService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { ProgressBar as Progress } from '../components/ui/Progress';

export default function RecommendationsPage(): React.ReactElement {
  const [recs, setRecs] = useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecs();
  }, []);

  const fetchRecs = async () => {
    setIsLoading(true);
    try {
      const data = await intelligenceService.getRecommendations();
      setRecs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      default: return 'success';
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Career Recommendations"
          subtitle="Explainable AI career recommendations with measurable confidence scores."
          badge="Intelligence Engine"
          icon={<Sparkles className="h-6 w-6" />}
        />

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard className="h-40" />
              <SkeletonCard className="h-40" />
            </div>
            <SkeletonCard className="h-96" />
          </div>
        ) : recs ? (
          <div className="space-y-6 animate-fade-up">
            {/* Roles & Domains */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard padding="lg" className="flex flex-col h-full hover:border-teal-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-6 shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                    <Target className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Recommended Roles</h3>
                </div>
                
                {recs.suitableRoles.length === 0 ? (
                  <EmptyState icon={<Target />} title="No roles yet" description="Add skills to get matches" className="py-8 flex-1" />
                ) : (
                  <div className="flex flex-wrap gap-2.5 flex-1 content-start">
                    {recs.suitableRoles.map((role, idx) => (
                      <span key={idx} className="px-4 py-2 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 text-sm font-semibold tracking-tight shadow-sm hover:bg-teal-500/20 transition-colors cursor-default">
                        {role}
                      </span>
                    ))}
                  </div>
                )}
              </GlassCard>

              <GlassCard padding="lg" className="flex flex-col h-full hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-6 shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Layers className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Target Domains</h3>
                </div>
                
                {recs.suitableDomains.length === 0 ? (
                  <EmptyState icon={<Layers />} title="No domains yet" description="Add projects to get matches" className="py-8 flex-1" />
                ) : (
                  <div className="flex flex-wrap gap-2.5 flex-1 content-start">
                    {recs.suitableDomains.map((dom, idx) => (
                      <span key={idx} className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-sm font-semibold tracking-tight shadow-sm hover:bg-indigo-500/20 transition-colors cursor-default">
                        {dom}
                      </span>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Recommendations List with Confidence Scores & Reason Banners */}
            <GlassCard padding="lg" className="flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <BookOpen className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Actionable Next Steps</h3>
                </div>
                <Badge variant="info">{recs.items.length} Actions</Badge>
              </div>

              {recs.items.length === 0 ? (
                <EmptyState
                  icon={<Lightbulb />}
                  title="No Recommendations"
                  description="Your profile is highly optimized. We don't have any new suggestions right now."
                />
              ) : (
                <div className="space-y-4">
                  {recs.items.map((item, idx) => (
                    <div key={idx} className="group p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 transition-all flex flex-col space-y-4 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: item.priority === 'HIGH' ? '#f43f5e' : item.priority === 'MEDIUM' ? '#f59e0b' : '#10b981' }}></div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="pl-2">
                          <Badge variant="default" className="mb-2">{item.category}</Badge>
                          <h4 className="text-lg font-bold text-white leading-tight">{item.title}</h4>
                        </div>
                        
                        <div className="flex items-center gap-3 shrink-0 pl-2 sm:pl-0">
                          <Badge variant={getPriorityVariant(item.priority)}>{item.priority} Priority</Badge>
                        </div>
                      </div>

                      <div className="w-24 sm:w-32 mr-2">
                         <div className="flex items-center justify-between text-xs font-bold mb-1">
                           <span className="text-slate-400">Impact</span>
                           <span className="text-white">{item.confidenceScore}%</span>
                         </div>
                         <Progress value={item.confidenceScore} color="indigo" size="sm" showValue={false} />
                      </div>

                      <div className="ml-2 mr-2 bg-blue-500/5 rounded-xl p-4 border border-blue-500/10 flex gap-3 text-sm">
                        <Lightbulb className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-slate-300 leading-relaxed font-medium">
                          <span className="text-slate-200 font-bold mr-2">Why?</span> 
                          {item.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
