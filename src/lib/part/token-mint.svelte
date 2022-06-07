<script lang="ts">
	import { utils } from 'near-api-js';

	import { browser } from '$app/env';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';

	import { nearWallet, type MintState } from '$lib/store/near-wallet';
	import PageTransition from './page-transition.svelte';

	export let account: string | null;

	let mintSet: boolean = false;
	let errorSet: boolean = true;

	let errorMsg: string | null = null;

	let mintState: MintState | null = null;

	onMount(() => {
		if (!browser) return;
		if (account == null) return;

		const config = nearWallet.getConfig();
		const wallet = nearWallet.getAccount();

		if (wallet == null) return;
		if (config.appId == null) return;

		wallet
			.viewFunction(config.appId, 'nft_mint_state', {
				account_id: account,
				from_index: 0
			})
			.then(
				(data) => {
					console.log('====> nft_mint_state > data');
					console.log(data);
					mintState = data;
					errorMsg = null;
					errorSet = false;
					mintSet = $page.url.searchParams.get('transactionHashes') != null;
				},
				(reject) => {
					console.log('====> nft_mint_state > reject');
					console.log(reject);
					mintState = null;
					errorSet = true;
					errorMsg = 'Failed to request minting status.';
				}
			)
			.catch((error) => {
				console.log('====> nft_mint_state > error');
				console.log(error);
				mintState = null;
				errorSet = true;
				errorMsg = 'Failed to request minting status.';
			});
	});

	onDestroy(() => {});

	const mintAura = () => {
		const config = nearWallet.getConfig();
		const wallet = nearWallet.getAccount();

		if (wallet == null) return;
		if (mintState == null) return;
		if (config.appId == null) return;
		if (mintState.count >= 5) return;

		const call = {
			contractId: config.appId,
			methodName: 'nft_mint',
			args: {},
			attachedDeposit: utils.format.parseNearAmount(mintState.cost.toString()),
			walletCallbackUrl: `${$page.url}`
		};
		console.log(call);
		wallet
			.functionCall(call)
			.then(
				(data) => {
					console.log('====> nft_mint > data');
					console.log(data);
					mintState = data as unknown as MintState;
					errorMsg = null;
					errorSet = false;
				},
				(reject) => {
					console.log('====> nft_mint > reject');
					console.log(reject);
					mintState = null;
					errorSet = true;
					errorMsg = 'Failed to request mint token.';
				}
			)
			.catch((error) => {
				console.log('====> nft_mint > error');
				console.log(error);
				mintState = null;
				errorSet = true;
				errorMsg = 'Failed to request mint token.';
			});
	};

	$: hash = $page.url.searchParams.get('transactionHashes');
	$: count = mintState ? mintState.count : 0;
	$: limit = mintState ? mintState.limit : 0;
</script>

{#if errorMsg != null}
	<div class="box box-size box-nessage pointer-input ">
		<div class="text-white px-6 py-4 border-0 rounded relative mb-4 bg-pink-msg">
			<span class="text-xl inline-block mr-5 align-middle">
				<i class="fas fa-bell" />
			</span>
			<span class="inline-block align-middle mr-8">
				<b class="capitalize">Error!</b>
				{errorMsg}
			</span>
			<button
				on:click={() => {
					errorMsg = null;
				}}
				class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
			>
				<span>×</span>
			</button>
		</div>
	</div>
{:else if mintSet}
	<div class="box box-size box-nessage pointer-input ">
		<div class="text-white px-6 py-4 border-0 rounded relative mb-4 bg-teal-600 ">
			<span class="text-xl inline-block mr-5 align-middle">
				<i class="fas fa-bell" />
			</span>
			<span class="inline-block align-middle mr-8">
				You have
				<a
					class="transition-all underline hover:font-bold"
					href="https://explorer.testnet.near.org/transactions/{hash}"
					target="_blank"
				>
					minted an aura
				</a>
				and have {limit} mints remaining.
			</span>
			<a
				href="/token"
				class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
			>
				<span>×</span>
			</a>
		</div>
	</div>
{/if}

{#if account != null}
	<div class="flex flex-col w-full max-w-2xl h-full md:h-4/5 pointer-input">
		<div class="flex flex-none h-10 md:h-14 flex-col justify-center">
			<h1 class="text-6xl font-light opacity-70">mint</h1>
		</div>
		<div class="flex flex-grow flex-col px-6 justify-center">
			<div class="flex flex-grow flex-col px-6 justify-center">
				<p class="w-32 pt-4 mx-auto">for</p>
				<p class="w-32  pb-4 mx-auto">{account}</p>
			</div>
			<div class="flex flex-col justify-center py-4 pb-6 w-48 h-48 mx-auto aura-back">
				<!-- <img
					src="/aura-orb-50-opacity.png"
					class="w-32 h-32 md:w-48 md:h-48 mx-auto opacity-40"
					alt=""
				/> -->
				<p class="text-8xl">?</p>
			</div>
			<div class="flex flex-grow flex-col px-6 pt-6 justify-center">
				{#if count < 5 && limit > 0 && !errorSet}
					<button on:click={mintAura} class="btn btn-slate w-48 mx-auto text-3xl font-normal">
						mint now
					</button>
				{:else}
					<button class="btn btn-slate btn-disbale w-48 mx-auto text-2xl font-normal">
						mint disabled
					</button>
				{/if}
			</div>
		</div>
		<div class="flex flex-none h-6 sm:h-10 md:h-14 p-4 flex-col justify-center">
			<div class="flex flex-none pt-8 flex-col justify-center">
				{#if count > 0}
					<p class="text-xs">you own <span class="text-sm">{count}</span> auras and</p>
					<p class="text-xs">have <span class="text-sm">{limit}</span> mints remaining</p>
				{:else}
					<p class="text-xs">Maximum of 5 mints per wallet</p>
				{/if}
			</div>
			<div class="flex flex-none w-full max-w-sm mx-auto p-3 flex-row justify-around">
				<p class="">&nbsp;</p>
			</div>
			<!-- <div class="flex flex-none w-full max-w-sm mx-auto p-3 flex-row justify-around">
				<p class="">&laquo;</p>
				<p class="">{index}/{count}</p>
				<p class="">&raquo;</p>
			</div> -->
		</div>
	</div>
{/if}
