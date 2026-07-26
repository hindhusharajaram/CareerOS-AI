import React, { useEffect, useState } from 'react';
import { FolderGit2, Plus, Trash2, Github, ExternalLink, Code2, Server, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, ProjectItem } from '../services/studentService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function ProjectsPage(): React.ReactElement {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [liveLink, setLiveLink] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const list = await studentService.getProjects();
      setProjects(list);
    } catch (err) {
      toast.error('Could not fetch projects.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setIsAdding(true);
    try {
      const created = await studentService.addProject({
        title,
        description,
        technologies,
        githubLink,
        liveLink
      });
      setProjects((prev) => [created, ...prev]);
      setTitle('');
      setDescription('');
      setTechnologies('');
      setGithubLink('');
      setLiveLink('');
      toast.success('Project added successfully');
    } catch (err) {
      toast.error('Failed to add project.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await studentService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Project deleted');
    } catch (err) {
      toast.error('Failed to delete project.');
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Project Portfolio"
          subtitle="Showcase your software engineering projects, architecture decisions, and tech stack."
          badge="Portfolio"
          icon={<FolderGit2 className="h-6 w-6" />}
        />

        {/* Add Project Form */}
        <GlassCard padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Plus className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-lg font-bold text-white">Add New Project</h3>
          </div>
          
          <form onSubmit={handleAdd} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Title</label>
                <div className="relative">
                  <FolderGit2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Microservices E-Commerce Platform"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:bg-slate-900 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Architecture & Features</label>
                <div className="relative">
                  <Server className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the problem solved, architecture used, and key features built..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:bg-slate-900 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Technologies Used</label>
                <div className="relative">
                  <Code2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. React, Spring Boot, PostgreSQL, Docker (comma separated)"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:bg-slate-900 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">GitHub Repository</label>
                <div className="relative">
                  <Github className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:bg-slate-900 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Demo URL</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="url"
                    placeholder="https://myproject.com"
                    value={liveLink}
                    onChange={(e) => setLiveLink(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:bg-slate-900 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button
                type="submit"
                disabled={isAdding || !title || !description}
                isLoading={isAdding}
                variant="primary"
                icon={<Plus className="h-4 w-4" />}
                className="w-full sm:w-auto mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-none text-white shadow-lg shadow-purple-500/20"
              >
                Save Project
              </Button>
            </div>
          </form>
        </GlassCard>

        {/* Projects List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-purple-400" />
              Your Projects
            </h3>
            <Badge variant="purple">{projects.length} Projects</Badge>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className="h-48" />)}
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              icon={<FolderGit2 />}
              title="No projects added yet"
              description="Build your engineering portfolio to stand out to hiring managers."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {projects.map((proj) => (
                <div key={proj.id} className="group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900/80 hover:border-purple-500/30 transition-all duration-300 card-interactive overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h4 className="text-lg font-bold text-white leading-tight">{proj.title}</h4>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-5">
                      {proj.description}
                    </p>
                  </div>

                  <div className="relative mt-auto">
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {proj.technologies.split(',').map((tech, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t border-slate-800/60 text-xs font-semibold">
                      {proj.githubLink && (
                        <a href={proj.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
                          <Github className="h-4 w-4" /> Code
                        </a>
                      )}
                      {proj.liveLink && (
                        <a href={proj.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors">
                          <ExternalLink className="h-4 w-4" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
