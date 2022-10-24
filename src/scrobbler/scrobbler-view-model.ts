import { ILastFMTransport } from 'src/last-fm/last-fm-transport';

export interface IScrobblerViewModel {
	scrobbleAlbum(artist: string, album: string): Promise<void>;
}

export class ScrobblerViewModel implements IScrobblerViewModel {
	private _lastFMTransport: ILastFMTransport;

	public constructor(lastFMTransport: ILastFMTransport) {
		this._lastFMTransport = lastFMTransport;
	}

	public scrobbleAlbum = async (artist: string, album: string): Promise<void> => {
		await this._lastFMTransport.scrobbleAlbum(artist, album);
	};
}
