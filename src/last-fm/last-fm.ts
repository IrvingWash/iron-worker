import { ensureDefined } from 'src/utils/utils';
import { ILastFMAuthorizationProvider, LastFMAuthorizationProvider } from './last-fm-authorization-provider';

export class LastFM {
	public readonly authorizationProvider: ILastFMAuthorizationProvider;

	private readonly _apiKey = ensureDefined(process.env.API_KEY);
	private readonly _sharedSecret = ensureDefined(process.env.SHARED_SECRET);

	private readonly _baseUrl = new URL('http://ws.audioscrobbler.com/2.0/');
	private readonly _baseAuthorizationUrl = new URL('http://www.last.fm/api/auth/');

	public constructor() {
		this.authorizationProvider = new LastFMAuthorizationProvider({
			apiKey: this._apiKey,
			baseUrl: this._baseUrl,
			baseAuthorizationUrl: this._baseAuthorizationUrl,
		});
	}
}
