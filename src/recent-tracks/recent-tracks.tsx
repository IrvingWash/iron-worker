import React, { useEffect, useState } from 'react';

import { LastFMRecentTracks } from 'src/last-fm/last-fm-objects-and-constants.ts/last-fm-objects';
import { Track } from './track';

import * as s from './recent-tracks.scss';

interface RecentTracksProps {
	getRecentTracks(): Promise<LastFMRecentTracks>
}

export function RecentTracks(props: RecentTracksProps): JSX.Element {
	const [recentTracks, setRecentTracks] = useState<LastFMRecentTracks | null>(null);

	useEffect(() => {
		getRecentTracks();
	}, []);

	return (
		<div className={ s.recentTracks }>
			<h3>{
				recentTracks === null
					? 'Loading recent tracks...'
					: 'Recent tracks:'
			}</h3>
			<ul>
				{ makeTracks() }
			</ul>
		</div>
	);

	async function getRecentTracks(): Promise<void> {
		setRecentTracks(await props.getRecentTracks());
	}

	function makeTracks(): JSX.Element[] {
		if (recentTracks === null) {
			return [];
		}

		return recentTracks.recenttracks.track.map((track) => {
			return (
				<li key={ track.mbid + track.date['#text'] }>
					<Track
						artist={ track.artist['#text'] }
						album={ track.album['#text'] }
						title={ track.name }
					/>
				</li>
			);
		});
	}
}
