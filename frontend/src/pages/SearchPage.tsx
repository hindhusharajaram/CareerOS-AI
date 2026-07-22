import React, { useState } from 'react';
import { Search, Cpu, FolderGit2, Award, Briefcase, GraduationCap } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { searchService, SearchResultData } from '../services/searchService';

export default function SearchPage(): React.ReactElement {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultData | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const data = await searchService.search(query.trim());
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Search className="h-6 w-6 text-indigo-400" />
            Universal Search Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">Search across your skills, projects, technologies, experience, and credentials</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-4 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search keywords (e.g. React, Python, OpenAI, Stanford, AWS)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 py-3.5 pl-12 pr-28 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none backdrop-blur-md shadow-xl"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white hover:from-indigo-500 hover:to-purple-500 transition disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Results View */}
        {results && (
          <div className="space-y-6">
            {/* Skills */}
            {results.matchingSkills.length > 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-indigo-400" /> Matching Skills ({results.matchingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {results.matchingSkills.map((sk) => (
                    <span key={sk.id} className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium">
                      {sk.skillName} • <span className="text-[10px] uppercase font-mono">{sk.proficiency}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {results.matchingProjects.length > 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-purple-400" /> Matching Projects ({results.matchingProjects.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.matchingProjects.map((p) => (
                    <div key={p.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <p className="text-sm font-bold text-white">{p.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {results.matchingExperience.length > 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-amber-400" /> Matching Experience ({results.matchingExperience.length})
                </h3>
                <div className="space-y-2">
                  {results.matchingExperience.map((e) => (
                    <div key={e.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">{e.company}</p>
                        <p className="text-xs text-indigo-400">{e.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates */}
            {results.matchingCertificates.length > 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-400" /> Matching Certificates ({results.matchingCertificates.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.matchingCertificates.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <p className="text-sm font-bold text-white">{c.title}</p>
                      <p className="text-xs text-emerald-400 mt-0.5">{c.provider}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {results.matchingEducation.length > 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-400" /> Matching Education ({results.matchingEducation.length})
                </h3>
                <div className="space-y-2">
                  {results.matchingEducation.map((e) => (
                    <div key={e.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <p className="text-sm font-bold text-white">{e.degree} - {e.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
