import { Project } from '../types';

const STORAGE_KEY = 'freehub_projects';

export const storage = {
  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get projects from storage:', error);
      return [];
    }
  },

  saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save projects to storage:', error);
    }
  },

  addProject(project: Project): void {
    const projects = this.getProjects();
    projects.unshift(project);
    this.saveProjects(projects);
  },

  updateProject(url: string, updates: Partial<Project>): void {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.url === url);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      this.saveProjects(projects);
    }
  },

  deleteProject(url: string): void {
    const projects = this.getProjects();
    const filtered = projects.filter((p) => p.url !== url);
    this.saveProjects(filtered);
  },

  getProjectByUrl(url: string): Project | undefined {
    const projects = this.getProjects();
    return projects.find((p) => p.url === url);
  },
};
