import React from 'react';
import { LastFM } from './last-fm/last-fm';

export class App extends React.Component {
	private _lastFM = new LastFM();

	public override render(): JSX.Element {
		return (
			<div>
				<button onClick={ this._authorize }>Authorize</button>
			</div>
		);
	}

	private _authorize = (): void => {
		this._lastFM.authorizationProvider.authorize();
	};
}
