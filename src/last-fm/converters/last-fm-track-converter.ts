import { ITrack } from 'src/objects';
import { LastFMRecentTracks } from '../last-fm-objects-and-constants.ts/last-fm-objects';

export function convertLastFMRecentTracks(lastFMRecentTracks: LastFMRecentTracks): ITrack[] {
	return lastFMRecentTracks.recenttracks.track.map((track) => ({
		artist: track.artist['#text'],
		album: track.album['#text'],
		title: track.name,
		date: track.date['#text'],
		id: track.mbid,
	}));
}
