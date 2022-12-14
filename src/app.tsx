import React from 'react';

import { ILastFM, LastFM } from './last-fm/last-fm';
import { ILastFMAuthorizationProvider } from './last-fm/last-fm-authorization-provider';
import { ILastFMCredentialStorage, LastFMCredentialStorage } from './last-fm/last-fm-credential-storage';
import { ILastFMTransport } from './last-fm/last-fm-transport';
import { RecentTracksControlContainer } from './recent-tracks/recent-tracks-control-container';
import { IRecentTracksViewModel, RecentTracksViewModel } from './recent-tracks/recent-tracks-view-model';
import { ScrobblerControlContainer } from './scrobbler/scrobbler-control-container';
import { IScrobblerViewModel, ScrobblerViewModel } from './scrobbler/scrobbler-view-model';

import { Header } from './ui-kit/header';

interface AppProps {}

interface AppState {
	isAuthenticated: boolean;
	isAuthorized: boolean;
	username: string | null;
}

export class App extends React.Component<AppProps, AppState> {
	private readonly _lastFMCredentialStorage: ILastFMCredentialStorage;

	private readonly _lastFM: ILastFM;

	private readonly _lastFMAuthorizationProvider: ILastFMAuthorizationProvider;
	private readonly _lastFMTransport: ILastFMTransport;

	private readonly _scrobblerModel: IScrobblerViewModel;
	private readonly _recentTracksModel: IRecentTracksViewModel;

	public constructor(props: AppProps) {
		super(props);

		this.state = {
			isAuthenticated: false,
			isAuthorized: false,
			username: null,
		};

		this._lastFMCredentialStorage = new LastFMCredentialStorage();

		this._lastFM = new LastFM(this._lastFMCredentialStorage);

		this._lastFMAuthorizationProvider = this._lastFM.getAuthorizationProvider();
		this._lastFMTransport = this._lastFM.getTransport();

		this._scrobblerModel = new ScrobblerViewModel(this._lastFMTransport);
		this._recentTracksModel = new RecentTracksViewModel(this._lastFMTransport);
	}

	public override componentDidMount(): void {
		this.setState({
			isAuthenticated: this._lastFMAuthorizationProvider.checkIsAuthenticated(),
			isAuthorized: this._lastFMAuthorizationProvider.checkIsAuthorized(),
			username: this._tryGetUsername(),
		});
	}

	public override render(): JSX.Element {
		return (
			<>
				<Header
					isAuthenticated={ this.state.isAuthenticated }
					isAuthorized={ this.state.isAuthorized }
					username={ this.state.username }
					authenticate={ this._authenticate }
					authorize={ this._authorize }
				/>
				{
					this.state.isAuthorized
						? <ScrobblerControlContainer model={ this._scrobblerModel } />
						: <p>You need to authorize to start scrobbling</p>
				}
				{
					this.state.isAuthorized
						? <RecentTracksControlContainer model={ this._recentTracksModel } />
						: null
				}
			</>
		);
	}

	private _authenticate = (): void => {
		this._lastFMAuthorizationProvider.authenticate();
	};

	private _authorize = async (): Promise<void> => {
		await this._lastFMAuthorizationProvider.authorize();

		this.setState({
			isAuthorized: this._lastFMAuthorizationProvider.checkIsAuthorized(),
			username: this._tryGetUsername(),
		});
	};

	private _tryGetUsername(): string | null {
		return this._lastFMCredentialStorage.load()?.session.name ?? null;
	}
}
