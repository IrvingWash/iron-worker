import { ILastFMCallSigner } from './last-fm-call-signer';
import { ILastFMCredentialStorage } from './last-fm-credential-storage';
import { HttpMethod, lastFMFetch } from './last-fm-fetch';
import { LastFMAlbumMethods, LastFMTrackMethods, LastFMUserMethods } from './last-fm-objects-and-constants.ts/last-fm-constants';
import { LastFMAlbum, LastFMRecentTracks } from './last-fm-objects-and-constants.ts/last-fm-objects';

export interface ILastFMTransport {
	getRecentTracks(): Promise<LastFMRecentTracks>;
	getAlbumInfo(artist: string, album: string): Promise<unknown>;
	scrobbleTrack(track: string, artist: string): Promise<void>;
	scrobbleAlbum(artist: string, album: string): Promise<void>;
}

interface LastFMTransportParams {
	apiKey: string;
	baseUrl: URL;
	credentialStorage: ILastFMCredentialStorage;
	callSigner: ILastFMCallSigner;
}

export class LastFMTransport {
	private _apiKey: string;
	private _baseUrl: URL;

	private _credentialStorage: ILastFMCredentialStorage;
	private _callSigner: ILastFMCallSigner;

	private _getRecentTracksUrl: URL;

	public constructor(params: LastFMTransportParams) {
		const {
			apiKey,
			baseUrl,
			credentialStorage,
			callSigner,
		} = params;

		this._apiKey = apiKey;
		this._baseUrl = baseUrl;

		this._credentialStorage = credentialStorage;
		this._callSigner = callSigner,

		this._getRecentTracksUrl = this._makeGetRecentTracksUrl();
	}

	public async getRecentTracks(): Promise<LastFMRecentTracks> {
		return await lastFMFetch<LastFMRecentTracks>(this._getRecentTracksUrl);
	}

	public async getAlbumInfo(artist: string, album: string): Promise<LastFMAlbum> {
		return await lastFMFetch<LastFMAlbum>(this._makeGetAlbumInfoUrl(artist, album));
	}

	public async scrobbleTrack(track: string, artist: string): Promise<void> {
		await lastFMFetch(this._makeScrobbleTrackUrl(track, artist), HttpMethod.Post);
	}

	public async scrobbleAlbum(artist: string, album: string): Promise<void> {
		const albumInfo = await this.getAlbumInfo(artist, album);

		for (const track of albumInfo.album.tracks.track) {
			await this.scrobbleTrack(track.name, albumInfo.album.artist);
		}
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

	private _makeGetAlbumInfoUrl(artist: string, album: string): URL {
		const getAlbumInfoUrl = new URL(this._baseUrl);

		getAlbumInfoUrl.searchParams.append('method', LastFMAlbumMethods.GetInfo);
		getAlbumInfoUrl.searchParams.append('artist', artist);
		getAlbumInfoUrl.searchParams.append('album', album);
		getAlbumInfoUrl.searchParams.append('api_key', this._apiKey);
		getAlbumInfoUrl.searchParams.append('format', 'json');

		return getAlbumInfoUrl;
	}

	private _makeScrobbleTrackUrl(track: string, artist: string): URL {
		const scrobbleTrackUrl = new URL(this._baseUrl);

		const timestamp = String(new Date().getTime() / 1000);
		const sessionKey = this._credentialStorage.load()?.session.key ?? '';

		scrobbleTrackUrl.searchParams.append('api_key', this._apiKey);
		scrobbleTrackUrl.searchParams.append('method', LastFMTrackMethods.Scrobble);
		scrobbleTrackUrl.searchParams.append('track', track);
		scrobbleTrackUrl.searchParams.append('artist', artist);
		scrobbleTrackUrl.searchParams.append('timestamp', timestamp);
		scrobbleTrackUrl.searchParams.append('sk', sessionKey);
		scrobbleTrackUrl.searchParams.append('format', 'json');

		scrobbleTrackUrl.searchParams.append('api_sig', this._callSigner.sign({
			api_key: this._apiKey,
			method: LastFMTrackMethods.Scrobble,
			track: track,
			artist: artist,
			timestamp,
			sk: sessionKey,
		}));

		return scrobbleTrackUrl;
	}
}
