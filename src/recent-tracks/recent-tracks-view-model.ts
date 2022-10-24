import { convertLastFMRecentTracks } from 'src/last-fm/converters/last-fm-track-converter';
import { ILastFMTransport } from 'src/last-fm/last-fm-transport';
import { ITrack } from 'src/objects';

export interface IRecentTracksViewModel {
	getRecentTracks(): Promise<ITrack[]>;
}

export class RecentTracksViewModel implements IRecentTracksViewModel {
	private _lastFMTransport: ILastFMTransport;

	public constructor(lastFMTransport: ILastFMTransport) {
		this._lastFMTransport = lastFMTransport;
	}

	public getRecentTracks = async (): Promise<ITrack[]> => {
		return convertLastFMRecentTracks(await this._lastFMTransport.getRecentTracks());
	};
}
