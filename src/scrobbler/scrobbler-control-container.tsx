import React from 'react';

import { Scrobbler } from './scrobbler';
import { IScrobblerViewModel } from './scrobbler-view-model';

interface ScrobblerControlContainerProps {
	model: IScrobblerViewModel;
}

export function ScrobblerControlContainer(props: ScrobblerControlContainerProps): JSX.Element {
	return (
		<Scrobbler
			scrobbleAlbum={ props.model.scrobbleAlbum }
		/>
	);
}
