import { LastFMImageSize } from './last-fm-constants';

export interface LastFMSession {
	session: {
		key: string;
		name: string;
		subscriber: number;
	}
}

export interface LastFMRecentTracks {
	recenttracks: {
		track: LastFMTrack[];
	};
}

export interface LastFMTrack {
	album: LastFMTrackCommonField;
	artist: LastFMTrackCommonField;
	date: LastFMDate;
	image: LastFMImage[];
	mbid: string;
	name: string;
	streamable: string;
	url: string,
}

export interface LastFMTrackCommonField {
	'#text': string;
	mbid: string;
}

export interface LastFMDate {
	'#text': string;
	uts: string;
}

export interface LastFMImage {
	'#text': string;
	size: LastFMImageSize
}
