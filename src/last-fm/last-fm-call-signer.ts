import { Md5 } from 'ts-md5';

export interface ILastFMCallSigner {
	sign(params: Record<string, string>): string;
}

interface LastFMCallSignerParams {
	sharedSecret: string;
}

export class LastFMCallSigner implements ILastFMCallSigner {
	private _sharedSecret: string;

	public constructor(params: LastFMCallSignerParams) {
		const { sharedSecret } = params;

		this._sharedSecret = sharedSecret;
	}

	public sign(params: Record<string, string>): string {
		return Md5.hashStr(this._makeSignableString(params));
	}

	private _sortParamKeys(params: Record<string, string>): string[] {
		return Object.keys(params).sort();
	}

	private _makeSignableString(params: Record<string, string>): string {
		const sortedParamKeys = this._sortParamKeys(params);

		let result = '';

		for (const key of sortedParamKeys) {
			result += `${key}${params[key]}`;
		}

		result += this._sharedSecret;

		return result;
	}
}
