import type { NearConfig } from '$lib/store/near-wallet';

export const get = async (): Promise<unknown> => {
	try {
		const cfg: NearConfig = {
			appId: process.env['APP_ID'],
			appUrl: process.env['APP_URL'],
			network: process.env['NEAR_NETWORK'],
			nodeUrl: process.env['NEAR_NODE_URL'],
			walletUrl: process.env['NEAR_WALLET_URL'],
			helperUrl: process.env['NEAR_HELPER_URL'],
			explorerUrl: process.env['NEAR_EXPLORER_URL']
		};
		return {
			status: 200,
			body: cfg
		};
	} catch (error) {
		console.log(error);
		return {
			status: 500,
			body: {
				ok: false,
				error: 'Something did not align.'
			}
		};
	}
};
