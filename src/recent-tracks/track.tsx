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
			<p className={ s.artist }>Artist: { props.artist }</p>
			<p className={ s.album }>Album: { props.album }</p>
			<p className={ s.title }>Title: { props.title }</p>
		</div>
	);
}
