import { LastFMRecentTracks } from 'src/last-fm/last-fm-objects-and-constants.ts/last-fm-objects';
import { ILastFMTransport } from 'src/last-fm/last-fm-transport';

export interface IRecentTracksViewModel {
	getRecentTracks(): Promise<LastFMRecentTracks>;
}

export class RecentTracksViewModel implements IRecentTracksViewModel {
	private _lastFMTransport: ILastFMTransport;

	public constructor(lastFMTransport: ILastFMTransport) {
		this._lastFMTransport = lastFMTransport;
	}

	public getRecentTracks = async (): Promise<LastFMRecentTracks> => {
		return await this._lastFMTransport.getRecentTracks();
	};
}
