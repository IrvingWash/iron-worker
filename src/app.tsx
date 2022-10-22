import React from 'react';
import { ILastFM, LastFM } from './last-fm/last-fm';

interface AppProps {}

interface AppState {
	isAuthenticated: boolean
}

export class App extends React.Component<AppProps, AppState> {
	private _lastFM: ILastFM;

	public constructor(props: AppProps) {
		super(props);

		this.state = {
			isAuthenticated: false,
		};

		this._lastFM = new LastFM();
	}

	public override componentDidMount(): void {
		this.setState({ isAuthenticated: this._lastFM.authorizationProvider.checkIsAuthenticated() });
	}

	public override render(): JSX.Element {
		return (
			<div>
				{ !this.state.isAuthenticated && <button onClick={ this._authenticate }>Authenticate</button> }
				<button onClick={ this._authorize }>Authorize</button>
			</div>
		);
	}

	private _authenticate = (): void => {
		this._lastFM.authorizationProvider.authenticate();
	};

	private _authorize = async (): Promise<void> => {
		await this._lastFM.authorizationProvider.authorize();
	};
}
