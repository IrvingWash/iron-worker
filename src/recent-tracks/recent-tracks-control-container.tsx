import React from 'react';

import { RecentTracks } from './recent-tracks';
import { IRecentTracksViewModel } from './recent-tracks-view-model';

interface RecentTracksControlContainerProps {
	model: IRecentTracksViewModel
}

export function RecentTracksControlContainer(props: RecentTracksControlContainerProps): JSX.Element {
	return (
		<RecentTracks getRecentTracks={ props.model.getRecentTracks } />
	);
}
