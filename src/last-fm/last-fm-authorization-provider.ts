export interface ILastFMAuthorizationProvider {
	authorize(): void;
}

interface LastFMAuthorizationProviderParams {
	apiKey: string;
	baseUrl: URL;
	baseAuthorizationUrl: URL;
}

export class LastFMAuthorizationProvider {
	private _apiKey: string;

	private _baseUrl: URL;
	private _baseAuthorizationUrl: URL;

	public constructor(params: LastFMAuthorizationProviderParams) {
		const {
			apiKey,
			baseUrl,
			baseAuthorizationUrl,
		} = params;

		this._apiKey = apiKey;

		this._baseUrl = baseUrl;
		this._baseAuthorizationUrl = baseAuthorizationUrl;
	}

	public authorize(): void {
		window.open(this._makeAuthorizationUrl());
		window.close();
	}

	private _makeAuthorizationUrl(): URL {
		const authorizationUrl = new URL(this._baseAuthorizationUrl);
		authorizationUrl.searchParams.append('api_key', this._apiKey);
		authorizationUrl.searchParams.append('cb', window.location.href);

		return authorizationUrl;
	}
}
