import { LastFMSession } from './last-fm-objects-and-constants.ts/last-fm-objects';

export interface ILastFMCredentialStorage {
	save(session: LastFMSession): void;
	load(): LastFMSession | null;
	clear(): void;
}

export class LastFMCredentialStorage implements ILastFMCredentialStorage {
	private readonly _storageKey = 'lastFMCredentials';

	public save(session: LastFMSession): void {
		localStorage.setItem(this._storageKey, JSON.stringify(session));
	}

	public load(): LastFMSession | null {
		const loadedValue = localStorage.getItem(this._storageKey);

		return loadedValue === null
			? null
			: JSON.parse(loadedValue);
	}

	public clear(): void {
		localStorage.removeItem(this._storageKey);
	}
}
