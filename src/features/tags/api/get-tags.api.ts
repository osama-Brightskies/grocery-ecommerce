import axios from "axios";

export async function getTagsApi(page = 1, pageSize = 1000) {
  const response = await axios.get("https://63.183.213.35:5223/api/tags", {
    params: { PageNumber: page, PageSize: pageSize },
  });
  return response.data;
}