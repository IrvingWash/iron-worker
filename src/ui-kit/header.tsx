import React from 'react';

import * as s from './header.scss';

interface HeaderProps {
	isAuthenticated: boolean;
	isAuthorized: boolean;
	username: string | null;

	authenticate(): void;
	authorize(): Promise<void>;
}

export function Header(props: HeaderProps): JSX.Element {
	const {
		isAuthenticated,
		isAuthorized,
		username,
		authenticate,
		authorize,
	} = props;

	return (
		<header className={ s.header }>
			<div>Hard Scrobbler</div>
			<div>
				{ !isAuthenticated && !isAuthorized && <button onClick={ authenticate }>Authenticate</button> }
				{ isAuthorized && <button onClick={ authorize }>Authorize</button> }
				<h4>{ username }</h4>
			</div>
		</header>
	);
}
