export const enum HttpMethod {
	Get = 'GET',
	Post = 'POST',
}

export async function lastFMFetch<T>(url: URL, method: HttpMethod = HttpMethod.Get, body?: object): Promise<T> {
	const response = await fetch(
		url,
		{
			method,
			body: JSON.stringify(body),
		}
	);

	return await response.json();
}
