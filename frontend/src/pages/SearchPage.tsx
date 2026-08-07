import React, { useState } from 'react';
import { Search, Cpu, FolderGit2, Award, Briefcase, GraduationCap, ChevronRight, X } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { searchService, SearchResultData } from '../services/searchService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

export default function SearchPage(): React.ReactElement {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    try {
      const data = await searchService.search(query.trim());
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setHasSearched(false);
  };

  const hasResults = results && (
    results.matchingSkills.length > 0 ||
    results.matchingProjects.length > 0 ||
    results.matchingExperience.length > 0 ||
    results.matchingCertificates.length > 0 ||
    results.matchingEducation.length > 0
  );

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <SectionHeader
          title="Universal Search Engine"
          subtitle="Search across your entire profile: skills, projects, experience, and credentials."
          badge="Global Search"
          icon={<Search className="h-6 w-6" />}
        />

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-emerald-500" />
            <input
              type="text"
              placeholder="Search keywords (e.g. React, Python, OpenAI, Stanford, AWS)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-3xl border border-surface-border bg-surface-card py-5 pl-16 pr-32 text-base text-content-primary placeholder-content-muted focus:border-emerald-500 focus:outline-none backdrop-blur-xl shadow-2xl transition-all"
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-2 text-content-muted hover:text-content-primary rounded-full hover:bg-surface-hover transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="space-y-6 pt-4">
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-60" />
          </div>
        )}

        {/* No Results State */}
        {!isSearching && hasSearched && !hasResults && (
          <EmptyState
            icon={<Search />}
            title={`No results found for "${query}"`}
            description="We couldn't find anything matching your search. Try different keywords or check your spelling."
            className="mt-8"
          />
        )}

        {/* Initial Empty State */}
        {!isSearching && !hasSearched && (
          <div className="pt-12 text-center text-content-muted flex flex-col items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-surface-card flex items-center justify-center mb-4 border border-surface-border">
              <Search className="h-8 w-8 text-emerald-500 opacity-50" />
            </div>
            <p className="text-base font-medium text-content-secondary">Enter a keyword to search your profile</p>
            <p className="text-sm mt-2 max-w-sm">Find specific technologies you've used, companies you've worked at, or projects you've built.</p>
          </div>
        )}

        {/* Results View */}
        {!isSearching && results && hasResults && (
          <div className="space-y-6 pt-4 animate-fade-up">
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="text-sm font-bold text-content-muted uppercase tracking-wider">Search Results</h3>
              <Badge variant="emerald">
                {results.matchingSkills.length + results.matchingProjects.length + results.matchingExperience.length + results.matchingCertificates.length + results.matchingEducation.length} Matches
              </Badge>
            </div>

            {/* Skills */}
            {results.matchingSkills.length > 0 && (
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Cpu className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-content-primary">Matching Skills</h3>
                  <Badge variant="emerald" className="ml-auto">{results.matchingSkills.length}</Badge>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {results.matchingSkills.map((sk) => (
                    <span key={sk.id} className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 dark:text-emerald-300 border border-emerald-500/20 text-sm font-semibold flex items-center gap-2">
                      {sk.skillName}
                      <span className="text-[10px] uppercase font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-500">{sk.proficiency}</span>
                    </span>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Projects */}
            {results.matchingProjects.length > 0 && (
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                    <FolderGit2 className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-content-primary">Matching Projects</h3>
                  <Badge variant="emerald" className="ml-auto">{results.matchingProjects.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.matchingProjects.map((p) => (
                    <div key={p.id} className="group p-4 rounded-2xl bg-surface-card border border-surface-border hover:bg-surface-hover hover:border-teal-500/30 transition-all cursor-pointer flex justify-between items-start">
                      <div>
                        <p className="text-base font-bold text-content-primary">{p.title}</p>
                        <p className="text-sm text-content-secondary line-clamp-2 mt-1.5 leading-relaxed">{p.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-content-muted group-hover:text-teal-400 transition-colors shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Experience */}
            {results.matchingExperience.length > 0 && (
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Briefcase className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Matching Experience</h3>
                  <Badge variant="amber" className="ml-auto">{results.matchingExperience.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.matchingExperience.map((e) => (
                    <div key={e.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 hover:border-amber-500/30 transition-all flex items-center justify-between group cursor-pointer">
                      <div>
                        <p className="text-base font-bold text-white">{e.company}</p>
                        <p className="text-sm font-semibold text-amber-400 mt-0.5">{e.role}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Certificates */}
            {results.matchingCertificates.length > 0 && (
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Matching Certificates</h3>
                  <Badge variant="emerald" className="ml-auto">{results.matchingCertificates.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.matchingCertificates.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 hover:border-emerald-500/30 transition-all flex items-center justify-between group cursor-pointer">
                      <div>
                        <p className="text-base font-bold text-white">{c.title}</p>
                        <p className="text-sm font-medium text-emerald-400 mt-1 uppercase tracking-wider text-[10px]">{c.provider}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Education */}
            {results.matchingEducation.length > 0 && (
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <GraduationCap className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Matching Education</h3>
                  <Badge variant="default" className="ml-auto">{results.matchingEducation.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.matchingEducation.map((e) => (
                    <div key={e.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 hover:border-blue-500/30 transition-all flex flex-col group cursor-pointer">
                      <p className="text-base font-bold text-white">{e.degree}</p>
                      <p className="text-sm font-semibold text-blue-400 mt-0.5">{e.institution}</p>
                      <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                         <span>{e.startYear} - {e.endYear}</span>
                         <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
