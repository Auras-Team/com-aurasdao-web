import { browser } from '$app/env';

import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

import { connect as nearConnect } from 'near-api-js';
import { keyStores, WalletConnection } from 'near-api-js';

export interface MintState {
	cost: number;
	limit: number;
	count: number;
	tokens: [];
}

// Note: This is going to get messy
const nearConfigKey = 'arc:near:config';
const nearRedirectKey = 'arc:near:redirect';
const walletDataKey = 'arc:near:wallet:data';
const walletTypeKey = 'arc:near:wallet:type';

const nearConfigDefault = {
	appId: '',
	network: '',
	nodeUrl: '',
	walletUrl: '',
	helperUrl: '',
	explorerUrl: '',
	actorMarket: '',
	actorContract: ''
};

const connection: Writable<Readonly<WalletConnection | null>> = writable(null);

export interface NearConfig {
	appId: string | undefined;
	network: string | undefined;
	nodeUrl: string | undefined;
	walletUrl: string | undefined;
	helperUrl: string | undefined;
	explorerUrl: string | undefined;
}

export enum WalletType {
	Unknown,
	Sender,
	Near
}

// Note: Parked close to other storage keys
// FixMe: It does not belong but is linked so?
export const clrNearRedirect = (): void => {
	if (!browser) return;
	localStorage.removeItem(nearRedirectKey);
};

export const getNearRedirect = (): string => {
	if (!browser) return '/';
	const data = localStorage.getItem(nearRedirectKey);
	if (data) return JSON.parse(data);
	else return '/';
};

export const setNearRedirect = (path: string): void => {
	if (!browser) return;
	localStorage.setItem(nearRedirectKey, JSON.stringify(path));
};

export const getConfig = (): NearConfig => {
	if (!browser) return nearConfigDefault;
	const data = localStorage.getItem(nearConfigKey);
	if (data) return JSON.parse(data);
	return nearConfigDefault;
};
export const setNearConfig = (config: NearConfig): void => {
	if (browser) nearConfig.set(config);
};

export const getWalletType = (): WalletType => {
	if (!browser) return WalletType.Unknown;
	const data = localStorage.getItem(walletTypeKey);
	if (data) return JSON.parse(data);
	return WalletType.Unknown;
};
export const setWalletType = (type: WalletType): void => {
	if (browser) walletType.set(type);
};

export const walletType: Writable<Readonly<WalletType>> = writable(
	Object.freeze<WalletType>(getWalletType())
);
export const nearConfig: Writable<Readonly<NearConfig>> = writable(
	Object.freeze<NearConfig>(getConfig())
);

export const loadNearConfig = async (fetch: Fetch): Promise<void> => {
	let config = getConfig();
	try {
		const res = await fetch('/near/config.json');
		if (res.ok) config = await res.json();
	} catch (error) {
		console.error(`near:config:load:fetch: ${error}`);
		config = getConfig();
	} finally {
		nearConfig.set(config);
	}
};

export const isSignedIn = (): boolean => {
	const conn = get(connection);
	return conn != null ? conn.isSignedIn() : false;
};

export const getAccount = (): AccountWallet => {
	const conn = get(connection);
	if (conn && conn.isSignedIn()) {
		return conn.account();
	}
	return null;
};

export const getAccountId = (): string | null => {
	const conn = get(connection);
	if (conn && conn.isSignedIn()) {
		return conn.getAccountId();
	}
	return null;
};

export const signOut = async (): Promise<boolean> => {
	const conn = get(connection);
	if (conn && conn.isSignedIn()) {
		conn.signOut();
		console.log('near:wallet:signout:', conn);
		const cfg = getConfig();
		await connect(cfg);
		return true;
	}
	return false;
};

export const requestSignIn = async (path: string, methods: string[]): Promise<void> => {
	let conn = get(connection);
	if (conn == null) {
		const cfg = getConfig();
		conn = await connect(cfg);
	}
	if (conn == null) {
		console.log(`near:wallet:requestSignIn:conection:is_null`);
		return;
	}
	if (conn.isSignedIn()) {
		conn.signOut();
	}
	const cfg = getConfig();
	if (cfg != null && cfg.appId != null && cfg.appId.length > 0) {
		console.log(cfg);
		console.log(conn);
		// TODO: Best practice, method names
		conn.requestSignIn({
			contractId: cfg.appId,
			methodNames: methods,
			successUrl: `${path}`,
			failureUrl: `${path}`
		});
	}
};

export const connect = async (config: NearConfig): Promise<WalletConnection | null> => {
	let data: WalletConnection | null = null;
	try {
		// Note: Implement a better config validator
		if (config && config.nodeUrl && config.nodeUrl.length > 0) {
			const conn = await nearConnect({
				headers: {},
				keyStore: new keyStores.BrowserLocalStorageKeyStore(),
				nodeUrl: config.nodeUrl ? config.nodeUrl : '',
				networkId: config.network ? config.network : '',
				walletUrl: config.walletUrl,
				helperUrl: config.helperUrl
			});
			data = new WalletConnection(conn, walletDataKey);
		}
	} catch (error) {
		console.log(`near:wallet:connect:error:`, error);
	} finally {
		console.log(`near:wallet:connect:set:`, data);
		connection.set(data);
	}
	return data;
};

// Ref. Implements the NEAR Provider API for the web wallet
// https://docs.senderwallet.io/api-reference/near-provider-api

export const nearWallet = Object.freeze({
	connect,
	connection,
	getConfig,
	getAccount,
	getAccountId,
	signOut,
	isSignedIn,
	requestSignIn
});

walletType.subscribe((type: Readonly<WalletType>) => {
	if (!browser || type === getWalletType()) return;
	localStorage.setItem(walletTypeKey, JSON.stringify(type));
});

nearConfig.subscribe((config: Readonly<NearConfig>) => {
	if (!browser) return;
	const cfg = getConfig();
	if (cfg.network != config.network) connect(config);
	else if (cfg.nodeUrl != config.nodeUrl) connect(config);
	localStorage.setItem(nearConfigKey, JSON.stringify(config));
});
