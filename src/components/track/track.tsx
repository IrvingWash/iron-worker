import React from 'react';
import { ITrack } from 'src/objects';

interface TrackProps extends ITrack { }

export function Track(props: TrackProps): JSX.Element {
	const {
		title,
		artist,
		album,
	} = props;

	return (
		<div className='track'>
			<p>Title: { title }</p>
			<p>Artist: { artist }</p>
			<p>Album: { album }</p>
		</div>
	);
}
