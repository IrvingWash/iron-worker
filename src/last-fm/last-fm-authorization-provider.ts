export interface ILastFMAuthorizationProvider {
	authenticate(): void;
	checkIsAuthenticated(): boolean;
}

interface LastFMAuthorizationProviderParams {
	apiKey: string;
	baseUrl: URL;
	baseAuthenticationUrl: URL;
}

export class LastFMAuthorizationProvider {
	private _apiKey: string;

	private _baseUrl: URL;
	private _baseAuthenticationUrl: URL;

	public constructor(params: LastFMAuthorizationProviderParams) {
		const {
			apiKey,
			baseUrl,
			baseAuthenticationUrl,
		} = params;

		this._apiKey = apiKey;

		this._baseUrl = baseUrl;
		this._baseAuthenticationUrl = baseAuthenticationUrl;
	}

	public authenticate(): void {
		window.open(this._makeAuthenticationUrl());
		window.close();
	}

	public checkIsAuthenticated(): boolean {
		const currentUrl = new URL(window.location.href);

		return Boolean(currentUrl.searchParams.get('token'));
	}

	private _makeAuthenticationUrl(): URL {
		const authorizationUrl = new URL(this._baseAuthenticationUrl);
		authorizationUrl.searchParams.append('api_key', this._apiKey);
		authorizationUrl.searchParams.append('cb', window.location.href);

		return authorizationUrl;
	}
}
