import { ILastFMCallSigner } from './last-fm-call-signer';
import { ILastFMCredentialStorage } from './last-fm-credential-storage';
import { lastFMFetch } from './last-fm-fetch';
import { LastFMSessionMethods } from './last-fm-objects-and-constants.ts/last-fm-constants';
import { LastFMSession } from './last-fm-objects-and-constants.ts/last-fm-objects';

export interface ILastFMAuthorizationProvider {
	authenticate(): void;
	authorize(): Promise<void>;
	checkIsAuthenticated(): boolean;
	checkIsAuthorized(): boolean;
}

interface LastFMAuthorizationProviderParams {
	apiKey: string;
	baseUrl: URL;
	baseAuthenticationUrl: URL;
	callSigner: ILastFMCallSigner;
	credentialStorage: ILastFMCredentialStorage;
}

export class LastFMAuthorizationProvider {
	private readonly _apiKey: string;

	private readonly _baseUrl: URL;
	private readonly _baseAuthenticationUrl: URL;

	private readonly _callSigner: ILastFMCallSigner;
	private readonly _credentialStorage: ILastFMCredentialStorage;

	private _authenticationToken: string | null = null;

	public constructor(params: LastFMAuthorizationProviderParams) {
		const {
			apiKey,
			baseUrl,
			baseAuthenticationUrl,
			callSigner,
			credentialStorage,
		} = params;

		this._tryGetAuthenticationToken();

		this._apiKey = apiKey;

		this._baseUrl = baseUrl;
		this._baseAuthenticationUrl = baseAuthenticationUrl;

		this._callSigner = callSigner;
		this._credentialStorage = credentialStorage;
	}

	public authenticate(): void {
		window.open(this._makeAuthenticationUrl());
		window.close();
	}

	public async authorize(): Promise<void> {
		const authorizationUrl = this._makeAuthorizationUrl();

		const session = await lastFMFetch<LastFMSession>(authorizationUrl);

		if (session.session == undefined) {
			throw new Error('Unauthorized');
		}

		this._credentialStorage.save(session);
	}

	public checkIsAuthenticated(): boolean {
		return Boolean(this._authenticationToken);
	}

	public checkIsAuthorized(): boolean {
		return this._credentialStorage.load() !== null
			? true
			: false;
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
		authorizationUrl.searchParams.append('method', LastFMSessionMethods.GetSession);
		authorizationUrl.searchParams.append('format', 'json');

		authorizationUrl.searchParams.append('api_sig', this._callSigner.sign({
			'api_key': this._apiKey,
			'token': this._authenticationToken,
			'method': 'auth.getSession',
		}));

		return authorizationUrl;
	}
}
