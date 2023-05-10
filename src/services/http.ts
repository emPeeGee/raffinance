const apiUrl = process.env.REACT_APP_API_URL;
const authUrl = process.env.REACT_APP_AUTH_URL;

interface GetRequest {
  url: string;
  token?: string | null;
}

interface PostRequest<T> {
  url: string;
  body?: T;
  auth?: boolean;
  token?: string | null;
}

interface DeleteRequest {
  url: string;
  auth?: boolean;
  token?: string | null;
}

async function handleErrors<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject((await response.json()) as T);
  }

  return (await response.json()) as T;
}

export const api = {
  get: <K>({ url, token }: GetRequest) =>
    fetch(`${apiUrl}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token ? `Bearer ${token}` : ''}`
      }
    }).then((response) => handleErrors<K>(response)),

  post: <T, K>({ url, body, token, auth = false }: PostRequest<T>) =>
    fetch(`${auth ? authUrl : apiUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token ? `Bearer ${token}` : ''}`
      },
      body: JSON.stringify(body)
    }).then((response) => handleErrors<K>(response)),

  put: <T, K>({ url, body, token, auth = false }: PostRequest<T>) =>
    fetch(`${auth ? authUrl : apiUrl}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token ? `Bearer ${token}` : ''}`
      },
      body: JSON.stringify(body)
    }).then((response) => handleErrors<K>(response)),

  delete: <K>({ url, token, auth = false }: DeleteRequest) =>
    fetch(`${auth ? authUrl : apiUrl}${url}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token ? `Bearer ${token}` : ''}`
      }
    }).then((response) => handleErrors<K>(response))
};
