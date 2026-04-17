export const awwwardsCollectionUrl =
  "https://www.awwwards.com/Aprivity/collections/myfav/";

export type ExternalFavoriteStatus = "loading" | "success" | "error" | "empty";

export type ExternalFavoriteItem = {
  title: string;
  description: string;
  url: string;
  image?: string;
  externalUrl?: string;
};

export type AwwwardsFavoritesSuccessResponse = {
  status: "success";
  items: ExternalFavoriteItem[];
  sourceUrl: string;
  fetchedAt: string;
  isStale: boolean;
  message?: string;
};

export type AwwwardsFavoritesErrorResponse = {
  status: "error";
  items: [];
  sourceUrl: string;
  message: string;
  fetchedAt?: string;
};

export type AwwwardsFavoritesEmptyResponse = {
  status: "empty";
  items: [];
  sourceUrl: string;
  fetchedAt: string;
  message: string;
};

export type AwwwardsFavoritesResponse =
  | AwwwardsFavoritesSuccessResponse
  | AwwwardsFavoritesEmptyResponse
  | AwwwardsFavoritesErrorResponse;
