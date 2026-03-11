import API from "../../lib/api";

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url = "", method = "GET", body, params, headers }) => {
    try {
      const result = await API({
        url: baseUrl + url,
        method,
        data: body,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
