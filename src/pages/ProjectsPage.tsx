import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { ProjectList } from '../components/projects/ProjectList';
import { CreateProjectDialog } from '../components/projects/CreateProjectDialog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Search, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function ProjectsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        {/* <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-3xl font-display font-bold">Projects</h1>
            <p className="mt-2 text-primary-100">
              Manage and track all your ongoing projects in one place.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2">
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute inset-0 bg-gradient-to-l from-white/20" />
          </div>
        </div> */}

        {/* Search and Filters */}
        <Card variant="glass" className="p-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 rounded-lg border border-surface-200 bg-white pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-surface-700 dark:bg-surface-800"
                >
                  <option value="all">All Status</option>
                  <option value="PLANNED">Planned</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>
        </Card>

        {/* Project List */}
        <ProjectList searchQuery={searchQuery} statusFilter={statusFilter} />

        {/* Create Project Dialog */}
        <CreateProjectDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
        />
      </div>
    </Layout>
  );
}