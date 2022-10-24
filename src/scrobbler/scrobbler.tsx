import React, { useState } from 'react';

import * as s from './scrobbler.scss';

interface ScrobblerProps {
	scrobbleAlbum(artist: string, album: string): Promise<void>;
}

export function Scrobbler(props: ScrobblerProps): JSX.Element {
	const {
		scrobbleAlbum,
	} = props;

	const [artist, setArtist] = useState('');
	const [album, setAlbum] = useState('');
	const [isScrobbling, setIsScrobbling] = useState(false);
	const [scrobbled, setScrobbled] = useState(false);

	return (
		<form onSubmit={ handleScrobble} className={ s.scrobbler }>
			<h2>Scrobble album:</h2>
			<input
				className={ s.scrobblerControl }
				type='text'
				value={ artist }
				placeholder='Artist'
				required
				onChange={ handleArtistInput }
			/>
			<input
				className={ s.scrobblerControl }
				type='text'
				value={ album }
				placeholder='Album'
				required
				onChange={ handleAlbumInput }
			/>
			<button
				className={ s.scrobblerControl }
				type='submit'
			>
				Scrobble
			</button>
			{ isScrobbling && <p>Scrobbling...</p>}
			{ scrobbled && <p>Scrobbled</p> }
		</form>
	);

	function handleArtistInput(event: React.ChangeEvent<HTMLInputElement>): void {
		setScrobbled(false);
		setArtist(event.target.value);
	}

	function handleAlbumInput(event: React.ChangeEvent<HTMLInputElement>): void {
		setScrobbled(false);
		setAlbum(event.target.value);
	}

	async function handleScrobble(event: React.FormEvent): Promise<void> {
		setIsScrobbling(true);

		event.preventDefault();

		await scrobbleAlbum(artist, album);

		setScrobbled(true);

		setIsScrobbling(false);
	}
}
