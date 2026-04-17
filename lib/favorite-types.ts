export type FavoriteSource = "awwwards" | "github";

export type FavoriteSourceStatus = "success" | "empty" | "error";

export type UnifiedFavoriteItem = {
  id: string;
  source: FavoriteSource;
  title: string;
  description: string;
  href: string;
  image?: string;
  tags: string[];
  meta: {
    sourceLabel: string;
    domain?: string;
    owner?: string;
    repo?: string;
    language?: string;
    homepage?: string;
  };
  stats?: {
    stars?: number;
    forks?: number;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type FavoriteSourceState = {
  status: FavoriteSourceStatus;
  isStale: boolean;
  message?: string;
  updatedAt?: string;
};

export type FavoritesCounts = {
  awwwards: number;
  github: number;
  total: number;
};

export type FavoritesGroups = {
  awwwards: UnifiedFavoriteItem[];
  github: UnifiedFavoriteItem[];
};

export type UnifiedFavoritesResponse = {
  status: FavoriteSourceStatus;
  all: UnifiedFavoriteItem[];
  groups: FavoritesGroups;
  counts: FavoritesCounts;
  sources: Record<FavoriteSource, FavoriteSourceState>;
  updatedAt: string;
};
