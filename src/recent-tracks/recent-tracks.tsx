import React, { useEffect, useState } from 'react';

import { LastFMRecentTracks } from 'src/last-fm/last-fm-objects-and-constants.ts/last-fm-objects';
import { Track } from './track';

import * as s from './recent-tracks.scss';

interface RecentTracksProps {
	getRecentTracks(): Promise<LastFMRecentTracks>
}

export function RecentTracks(props: RecentTracksProps): JSX.Element {
	const [recentTracks, setRecentTracks] = useState<LastFMRecentTracks | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		getRecentTracks();
	}, []);

	return (
		<div className={ s.recentTracks }>
			<h3>{
				isLoading
					? 'Loading recent tracks...'
					: 'Recent tracks:'
			}</h3>

			<button className={ s.updateButton } onClick={ getRecentTracks }>Update</button>

			<ul>
				{ makeTracks() }
			</ul>
		</div>
	);

	async function getRecentTracks(): Promise<void> {
		setIsLoading(true);

		setRecentTracks(await props.getRecentTracks());

		setIsLoading(false);
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
