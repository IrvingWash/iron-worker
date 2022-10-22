import { ILastFMCallSigner } from './last-fm-call-signer';

export interface ILastFMAuthorizationProvider {
	authenticate(): void;
	authorize(): Promise<void>;
	checkIsAuthenticated(): boolean;
}

interface LastFMAuthorizationProviderParams {
	apiKey: string;
	baseUrl: URL;
	baseAuthenticationUrl: URL;
	callSigner: ILastFMCallSigner;
}

export class LastFMAuthorizationProvider {
	private _apiKey: string;

	private _baseUrl: URL;
	private _baseAuthenticationUrl: URL;

	private _callSigner: ILastFMCallSigner;

	private _authenticationToken: string | null = null;

	public constructor(params: LastFMAuthorizationProviderParams) {
		const {
			apiKey,
			baseUrl,
			baseAuthenticationUrl,
			callSigner,
		} = params;

		this._tryGetAuthenticationToken();

		this._apiKey = apiKey;

		this._baseUrl = baseUrl;
		this._baseAuthenticationUrl = baseAuthenticationUrl;

		this._callSigner = callSigner;
	}

	public authenticate(): void {
		window.open(this._makeAuthenticationUrl());
		window.close();
	}

	public async authorize(): Promise<void> {
		const authorizationUrl = this._makeAuthorizationUrl();

		await fetch(authorizationUrl);
	}

	public checkIsAuthenticated(): boolean {
		return Boolean(this._authenticationToken);
	}

	private _tryGetAuthenticationToken(): void {
		const token = new URL(window.location.href).searchParams.get('token');

		this._authenticationToken = token;
	}

	private _makeAuthenticationUrl(): URL {
		const authorizationUrl = new URL(this._baseAuthenticationUrl);
		authorizationUrl.searchParams.append('api_key', this._apiKey);
		authorizationUrl.searchParams.append('cb', window.location.href);

		return authorizationUrl;
	}

	private _makeAuthorizationUrl(): URL {
		if (this._authenticationToken === null) {
			throw new Error('User is not authenticated');
		}

		const authorizationUrl = new URL(this._baseUrl);

		authorizationUrl.searchParams.append('api_key', this._apiKey);
		authorizationUrl.searchParams.append('token', this._authenticationToken);
		authorizationUrl.searchParams.append('method', 'auth.getSession');
		authorizationUrl.searchParams.append('format', 'json');

		authorizationUrl.searchParams.append('api_sig', this._callSigner.sign({
			'api_key': this._apiKey,
			'token': this._authenticationToken,
			'method': 'auth.getSession',
		}));

		return authorizationUrl;
	}
}
