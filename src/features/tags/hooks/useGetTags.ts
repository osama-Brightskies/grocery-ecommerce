import { useQuery } from "@tanstack/react-query";
import { getTagsApi } from "../api/get-tags.api";

export const useGetTags = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["tags", page, pageSize],
    queryFn: () => getTagsApi(page, pageSize),
  });
};