import { ProjectCard } from "@/components/project-card";
import type { GitHubRepository } from "@/lib/github";

type ProjectsGridProps = {
  repositories: GitHubRepository[];
};

export function ProjectsGrid({ repositories }: ProjectsGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {repositories.map((repository, index) => (
        <ProjectCard key={repository.id} repository={repository} index={index} />
      ))}
    </div>
  );
}
