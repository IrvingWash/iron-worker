import { ensureDefined } from 'src/utils/utils';
import { ILastFMAuthorizationProvider, LastFMAuthorizationProvider } from './last-fm-authorization-provider';
import { ILastFMCallSigner, LastFMCallSigner } from './last-fm-call-signer';

export interface ILastFM {
	authorizationProvider: ILastFMAuthorizationProvider;
}

export class LastFM implements ILastFM {
	public readonly authorizationProvider: ILastFMAuthorizationProvider;

	private readonly _apiKey = ensureDefined(process.env.API_KEY);
	private readonly _sharedSecret = ensureDefined(process.env.SHARED_SECRET);

	private readonly _baseUrl = new URL('http://ws.audioscrobbler.com/2.0/');
	private readonly _baseAuthenticationUrl = new URL('http://www.last.fm/api/auth/');

	private readonly _callSigner: ILastFMCallSigner;

	public constructor() {
		this._callSigner = new LastFMCallSigner({ sharedSecret: this._sharedSecret });

		this.authorizationProvider = new LastFMAuthorizationProvider({
			apiKey: this._apiKey,
			baseUrl: this._baseUrl,
			baseAuthenticationUrl: this._baseAuthenticationUrl,
			callSigner: this._callSigner,
		});
	}
}
