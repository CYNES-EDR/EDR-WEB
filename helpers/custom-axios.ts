/**
 * Sends a DELETE request using Axios.
 *
 * @param url - The URL to send the request to.
 * @param token - Optional token for authorization.
 * @returns A promise that resolves to the response data.
 */
const customAxiosDelete = async <T>(
  url: string,
  token?: string
): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const responseData: T = await response.json();
    return responseData;
  } catch (error: any) {
    console.error(error?.message);
    return "Error" as T;
  }
};
const customAxiosPut = async <T>(
  url: string,
  data?: any,
  token?: string
): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: data ? JSON.stringify(data) : "",
    });

    const responseData: T = await response.json();
    return responseData;
  } catch (error: any) {
    console.error(error?.message);
    return error?.message as T;
  }
};
/**
 * Sends a POST request using Axios.
 *
 * @param url - The URL to send the request to.
 * @param data - Optional data payload for the request.
 * @param token - Optional token for authorization.
 * @returns A promise that resolves to the response data.
 */

const customAxiosPost = async <T>(
  url: string,
  data?: any,
  token?: string
): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: data ? JSON.stringify(data) : "",
    });

    const responseData: T = await response.json();
    return responseData;
  } catch (error: any) {
    console.error(error);
    return error?.message as T;
  }
};

/**
 * Sends a GET request using Axios.
 *
 * @param url - The URL to send the request to.
 * @param params - Optional query parameters for the request.
 * @param cache - Optional cache configuration for the request.
 * @returns A promise that resolves to the response data.
 */
const customAxiosGet = async <T>(
  url: string,
  params?: any,
  token?: string,
  cache?: Object
): Promise<T> => {
  try {
    if (params) {
      const queryString = Object.keys(params)
        .map(
          (key) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
        )
        .join("&");
      url = `${url}?${queryString}`;
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const responseData: T = await response.json();
    return responseData;
  } catch (error: any) {
    console.error(error?.message);
    return error?.message as T;
  }
};

export default customAxiosPost;

export { customAxiosDelete, customAxiosGet, customAxiosPost, customAxiosPut };
