import React from 'react';

import { ILastFM, LastFM } from './last-fm/last-fm';
import { ILastFMAuthorizationProvider } from './last-fm/last-fm-authorization-provider';
import { ILastFMCredentialStorage, LastFMCredentialStorage } from './last-fm/last-fm-credential-storage';
import { ILastFMTransport } from './last-fm/last-fm-transport';

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
				<button onClick={ this._scrobbleAlbum }>Scrobble Album</button>
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

	private _scrobbleAlbum = async (): Promise<void> => {
		await this._lastFMTransport.scrobbleAlbum('Castevet', 'Mounds Of Ash');
	};

	private _tryGetUsername(): string | null {
		return this._lastFMCredentialStorage.load()?.session.name ?? null;
	}
}
