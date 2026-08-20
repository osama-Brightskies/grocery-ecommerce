export interface Tag {
  slug: string;
  name: string;
}

export interface GetTagsParams {
  PageNumber?: number;
  PageSize?: number;
}