import React from 'react';
import { ITrack } from 'src/objects';
import { Track } from '../track/track';

interface TrackListProps {
	tracks: ITrack[];
}

export function TrackList(props: TrackListProps): JSX.Element {
	const { tracks } = props;

	return (
		<ul>
			{ makeTracks() }
		</ul>
	);

	function makeTracks(): JSX.Element[] {
		return tracks.map((track) => (
			<Track
				title={ track.title }
				artist={ track.artist }
				album={ track.album }
			/>
		));
	}
}
