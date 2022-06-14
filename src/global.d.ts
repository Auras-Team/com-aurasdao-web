/// <reference types="@sveltejs/kit" />

// Define the fetch methode for loading routines in SveltKit modules
type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

// Defines a short hand for the interface to near wallet accounts.
// Ref. ConnectedWalletAccount - Central api for near acocunt and contract calls.
// https://near.github.io/near-api-js/classes/walletaccount.connectedwalletaccount.html

type AccountWallet = import('near-api-js').ConnectedWalletAccount | null;

// Defines and interface for interacting with near wallet providers.
// Ref. https://docs.senderwallet.io/api-reference/near-provider-api

interface INearProvider {
	isSender: boolean;

	account: () => AccountWallet;

	isSignedIn: () => boolean;
	getAccountId: () => string;

	signOut: () => Promise<boolean>;
	requestSignIn: (params: any) => Promise<void>;

	signAndSendTransaction: (reciever: string, actions: any) => Promise<any>;
	requestSignTransactions: (options: any) => Promise<any>;
}

interface Window {
	near: INearProvider;
}
