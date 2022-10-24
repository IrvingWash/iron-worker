import React from 'react';

import * as s from './track.scss';

interface TrackProps {
	artist: string;
	album: string;
	title: string;
}

export function Track(props: TrackProps): JSX.Element {

	return (
		<div className={ s.track }>
			<p>Artist: { props.artist }</p>
			<p>Album: { props.album }</p>
			<p>Title: { props.title }</p>
		</div>
	);
}
