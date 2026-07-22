import React, { useEffect, useState } from 'react';
import { FolderGit2, Plus, Trash2, Github, ExternalLink, AlertCircle } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, ProjectItem } from '../services/studentService';

export default function ProjectsPage(): React.ReactElement {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

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
    setError('');
    try {
      const list = await studentService.getProjects();
      setProjects(list);
    } catch (err) {
      setError('Could not fetch projects.');
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
    } catch (err) {
      setError('Failed to add project.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await studentService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError('Failed to delete project.');
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-purple-400" />
            Projects Portfolio
          </h2>
          <p className="text-xs text-slate-400 mt-1">Showcase your software projects and tech stack for recruiter matching</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Add Project Form */}
        <form onSubmit={handleAdd} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-purple-400" />
            Add New Project
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Project Title</label>
              <input
                type="text"
                required
                placeholder="e.g. CareerOS AI Intelligence Engine"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe the architecture, problem solved, and key features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Technologies Used (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. React, Spring Boot, PostgreSQL, TailwindCSS"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">GitHub Link</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Live Demo Link</label>
                <input
                  type="url"
                  placeholder="https://myproject.com"
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isAdding}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 transition duration-300 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {isAdding ? 'Adding...' : 'Add Project'}
            </button>
          </div>
        </form>

        {/* Projects List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Your Projects ({projects.length})</h3>
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            </div>
          ) : projects.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-slate-900/30 rounded-3xl border border-slate-800">
              <FolderGit2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No projects added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="flex flex-col justify-between p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md space-y-4">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-lg font-bold text-white">{proj.title}</h4>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{proj.description}</p>
                  </div>

                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.split(',').map((tech, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 border-t border-slate-800/80 pt-3 text-xs">
                    {proj.githubLink && (
                      <a href={proj.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-white transition">
                        <Github className="h-3.5 w-3.5" /> Repository
                      </a>
                    )}
                    {proj.liveLink && (
                      <a href={proj.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition">
                        <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                      </a>
                    )}
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
