import React from 'react';
import { ILastFM, LastFM } from './last-fm/last-fm';
import { ILastFMAuthorizationProvider } from './last-fm/last-fm-authorization-provider';

interface AppProps {}

interface AppState {
	isAuthenticated: boolean;
	isAuthorized: boolean;
}

export class App extends React.Component<AppProps, AppState> {
	private readonly _lastFM: ILastFM;
	private readonly _lastFMAuthorizationProvider: ILastFMAuthorizationProvider;

	public constructor(props: AppProps) {
		super(props);

		this.state = {
			isAuthenticated: false,
			isAuthorized: false,
		};

		this._lastFM = new LastFM();
		this._lastFMAuthorizationProvider = this._lastFM.getAuthorizationProvider();
	}

	public override componentDidMount(): void {
		this.setState({ isAuthenticated: this._lastFMAuthorizationProvider.checkIsAuthenticated() });
	}

	public override componentDidUpdate(): void {
		this.setState({ isAuthorized: this._lastFMAuthorizationProvider.checkIsAuthorized() });
	}

	public override render(): JSX.Element {
		return (
			<div>
				{
					!this.state.isAuthenticated
					&& !this.state.isAuthorized
					&& <button onClick={ this._authenticate }>Authenticate</button>
				}
				{
					this.state.isAuthenticated
					&& !this.state.isAuthorized
					&& <button onClick={ this._authorize }>Authorize</button>
				}
			</div>
		);
	}

	private _authenticate = (): void => {
		this._lastFMAuthorizationProvider.authenticate();
	};

	private _authorize = async (): Promise<void> => {
		await this._lastFMAuthorizationProvider.authorize();
	};
}
