import React, { useEffect, useState } from 'react';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  Brain,
  Award,
  Compass,
  Zap,
  Lock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AICopilotExplanation } from '../services/aiService';
import { studentService, DashboardSummaryData } from '../services/studentService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';

const topics = [
  { id: 'CAREER_SCORE', label: 'Career Score', subtitle: '0–1000 Rating', icon: Award, color: 'from-[#2E4CFF] to-indigo-600' },
  { id: 'ATS_SCORE', label: 'ATS Resume', subtitle: 'Optimization', icon: FileText, color: 'from-blue-600 to-[#2E4CFF]' },
  { id: 'SKILL_GAP', label: 'Skill Gap', subtitle: 'Role Alignment', icon: Brain, color: 'from-indigo-600 to-purple-600' },
  { id: 'ELIGIBILITY', label: 'Eligibility', subtitle: 'Placement Fit', icon: ShieldCheck, color: 'from-[#2E4CFF] to-[#1A34C7]' },
  { id: 'ROADMAP', label: '90-Day Plan', subtitle: 'Execution', icon: Compass, color: 'from-sky-500 to-indigo-600' },
];

export default function CareerCopilotPage(): React.ReactElement {
  const [topic, setTopic] = useState('CAREER_SCORE');
  const [explanation, setExplanation] = useState<AICopilotExplanation | null>(null);
  const [dashboard, setDashboard] = useState<DashboardSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [topic]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dashData, expData] = await Promise.all([
        studentService.getDashboard().catch(() => null),
        aiService.explainTopic(topic).catch(() => null),
      ]);

      if (dashData) setDashboard(dashData);
      if (expData) setExplanation(expData);
    } catch {
      // Error handled silently
    } finally {
      setIsLoading(false);
    }
  };

  const completionPercentage = dashboard?.completionPercentage ?? 4;
  const skillsCount = dashboard?.skillsCount ?? 0;
  const projectsCount = dashboard?.projectsCount ?? 0;
  const isLowData = completionPercentage < 30 || (skillsCount === 0 && projectsCount === 0);

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <SectionHeader
          title="AI Career Copilot"
          subtitle="Explainability engine grounded in your verified profile, skills, score index, and target roles"
          badge="AI Suite"
          icon={<Bot className="h-6 w-6 text-[#2E4CFF]" />}
        />

        {/* Topic Selector — Always visible and clickable */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {topics.map((t) => {
            const Icon = t.icon;
            const isActive = topic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`group relative overflow-hidden p-4 rounded-2xl border text-sm font-bold transition-all duration-200 flex flex-col items-center gap-2.5 shadow-sm ${
                  isActive
                    ? 'border-[#2E4CFF] text-content-primary ring-2 ring-[#2E4CFF]/20 bg-surface-card'
                    : 'bg-surface-card text-content-secondary border-surface-border hover:text-content-primary hover:border-[#2E4CFF]/40'
                }`}
              >
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-10`} />
                )}
                <div
                  className={`relative h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-[#2E4CFF] text-white shadow-md'
                      : 'bg-surface-hover group-hover:bg-surface-hover/80 text-content-secondary'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="relative text-center">
                  <p className={`text-xs font-bold ${isActive ? 'text-[#2E4CFF]' : ''}`}>{t.label}</p>
                  <p className={`text-[10px] mt-0.5 ${isActive ? 'text-content-secondary' : 'text-content-muted'}`}>
                    {t.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <SkeletonCard className="h-44" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SkeletonCard className="h-48" />
              <SkeletonCard className="h-48" />
            </div>
          </div>
        ) : isLowData ? (
          /* ===== LOW-DATA STATE (< 30% PROFILE COMPLETION) ===== */
          <div className="rounded-3xl border border-surface-border bg-surface-card p-8 shadow-sm space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="warning" size="sm" dot>
                      Data Readiness Alert
                    </Badge>
                    <span className="text-xs font-bold text-content-muted font-mono">
                      Profile at {completionPercentage}%
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-content-primary">
                    Add Profile Data to Unlock AI Analysis
                  </h3>
                </div>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#2E4CFF] text-white font-semibold text-xs shadow-sm hover:bg-[#2E4CFF]/90 transition-all shrink-0 w-full sm:w-auto"
              >
                <span>Complete Profile Flight Plan</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Progress Threshold Indicator */}
            <div className="p-5 rounded-2xl bg-surface-hover border border-surface-border space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-content-secondary flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-[#2E4CFF]" />
                  Profile Completion Index
                </span>
                <span className="font-mono font-bold text-[#2E4CFF]">
                  {completionPercentage}% / 30% Required Threshold
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-surface-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#2E4CFF] transition-all duration-500"
                  style={{ width: `${Math.min(100, (completionPercentage / 30) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Your profile is currently at <strong className="text-content-primary">{completionPercentage}%</strong> completion ({skillsCount} skills, {projectsCount} projects). AI Career Copilot requires at least 30% completion to calculate explainable score breakdowns and tailored recommendations.
              </p>
            </div>

            {/* What Will Be Unlocked */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-content-muted uppercase tracking-wider">
                Features Unlocked at 30% Profile Completion:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-surface-border bg-surface-hover/50 space-y-1">
                  <p className="text-xs font-bold text-content-primary flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-[#2E4CFF]" />
                    Explainable 0–1000 Score
                  </p>
                  <p className="text-[11px] text-content-secondary">
                    Weighted 4-pillar calculation derived from your verified projects and skills.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-surface-border bg-surface-hover/50 space-y-1">
                  <p className="text-xs font-bold text-content-primary flex items-center gap-1.5">
                    <Brain className="h-4 w-4 text-[#2E4CFF]" />
                    Skill Gap Alignment
                  </p>
                  <p className="text-[11px] text-content-secondary">
                    Real-time market comparisons highlighting missing high-impact technical competencies.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-surface-border bg-surface-hover/50 space-y-1">
                  <p className="text-xs font-bold text-content-primary flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-[#2E4CFF]" />
                    90-Day Sprint Actions
                  </p>
                  <p className="text-[11px] text-content-secondary">
                    Prioritized weekly execution roadmap to maximize placement eligibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : explanation ? (
          /* ===== FULL-DATA STATE (>= 30% PROFILE COMPLETION) ===== */
          <div className="space-y-5 animate-fade-in">
            {/* Explanation Banner */}
            <div className="rounded-3xl border border-[#2E4CFF]/20 bg-gradient-to-r from-surface-card via-[#2E4CFF]/5 to-surface-card p-8 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 h-32 w-32 bg-[#2E4CFF]/10 blur-[50px] rounded-full" />
              <div className="relative space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="indigo" size="md" dot>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Explainable AI Output
                  </Badge>
                  <Badge variant="default" size="sm">
                    {explanation.topic}
                  </Badge>
                </div>
                <p className="text-base font-bold text-content-primary leading-relaxed">
                  {explanation.explanationText}
                </p>
                <p className="text-xs text-content-muted italic font-mono">
                  {explanation.groundedContextSummary}
                </p>
              </div>
            </div>

            {/* Takeaways & Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Takeaways */}
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-[#2E4CFF]" />
                  <h4 className="text-sm font-bold text-content-primary">Key Intelligence Takeaways</h4>
                </div>
                <div className="space-y-2.5">
                  {explanation.keyTakeaways.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-[#2E4CFF]/8 border border-[#2E4CFF]/15"
                    >
                      <div className="h-5 w-5 rounded-full bg-[#2E4CFF]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-[#2E4CFF]" />
                      </div>
                      <span className="text-xs text-content-primary font-medium leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Actions */}
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-[#2E4CFF]" />
                  <h4 className="text-sm font-bold text-content-primary">Immediate High-Impact Actions</h4>
                </div>
                <div className="space-y-2.5">
                  {explanation.immediateActionItems.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-[#2E4CFF]/8 border border-[#2E4CFF]/15"
                    >
                      <div className="h-5 w-5 rounded-full bg-[#2E4CFF]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <ChevronRight className="h-3 w-3 text-[#2E4CFF]" />
                      </div>
                      <span className="text-xs text-content-primary font-medium leading-relaxed">
                        {act}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
