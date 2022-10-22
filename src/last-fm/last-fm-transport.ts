import { ILastFMCredentialStorage } from './last-fm-credential-storage';
import { lastFMFetch } from './last-fm-fetch';
import { LastFMUserMethods } from './last-fm-objects-and-constants.ts/last-fm-constants';
import { LastFMRecentTracks } from './last-fm-objects-and-constants.ts/last-fm-objects';

export interface ILastFMTransport {
	getRecentTracks(): Promise<LastFMRecentTracks>
}

interface LastFMTransportParams {
	apiKey: string;
	baseUrl: URL;
	credentialStorage: ILastFMCredentialStorage;
}

export class LastFMTransport {
	private _apiKey: string;
	private _baseUrl: URL;

	private _credentialStorage: ILastFMCredentialStorage;

	private _getRecentTracksUrl: URL;

	public constructor(params: LastFMTransportParams) {
		const {
			apiKey,
			baseUrl,
			credentialStorage,
		} = params;

		this._apiKey = apiKey;
		this._baseUrl = baseUrl;

		this._credentialStorage = credentialStorage;

		this._getRecentTracksUrl = this._makeGetRecentTracksUrl();
	}

	public async getRecentTracks(): Promise<LastFMRecentTracks> {
		return await lastFMFetch<LastFMRecentTracks>(this._getRecentTracksUrl);
	}

	private _makeGetRecentTracksUrl(): URL {
		const getRecentTracksUrl = new URL(this._baseUrl);

		// Make util functions
		getRecentTracksUrl.searchParams.append('method', LastFMUserMethods.GetRecentTracks);
		getRecentTracksUrl.searchParams.append('user', this._credentialStorage.load()?.session.name ?? '');
		getRecentTracksUrl.searchParams.append('api_key', this._apiKey);
		getRecentTracksUrl.searchParams.append('format', 'json');

		return getRecentTracksUrl;
	}
}
