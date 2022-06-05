<script lang="ts">
	import type { Unsubscriber } from 'svelte/store';

	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';

	import { nearWallet } from '$lib/store/near-wallet';
	import { swapTransition } from '$lib/utility/swap-stores';

	import TokenMint from '$lib/part/token-mint.svelte';

	let account: string | null = null;

	const enum State {
		Loading,
		Guest,
		User
	}

	const swapper = swapTransition(State.Loading);
	const state = swapper.state;

	let unsubState: Unsubscriber | null = null;

	onMount(() => {
		if (!browser) return;
		if (unsubState) return;

		if (nearWallet.isSignedIn()) {
			swapper.swapTo(State.User);
			console.log('set user');
		} else {
			swapper.swapTo(State.Guest);
			console.log('set guest');
		}
	});

	onDestroy(() => {
		if (unsubState != null) {
			unsubState();
			unsubState = null;
		}
	});

	$: account = nearWallet.getAccountId();
</script>

{#if $state == State.Loading}
	<div on:outroend={swapper.onOutro} transition:fade|local={{ duration: 120 }} />
{:else if $state == State.Guest}
	<div
		class="pointer-input w-full"
		on:outroend={swapper.onOutro}
		transition:fade|local={{ duration: 120 }}
	>
		<h1 class="text-6xl font-light py-6 opacity-75">guest</h1>
		<p class="p-6">Please connect your near acocunt to mint.</p>
		<button
			class="btn btn-slate w-1/2"
			on:click={async () => {
				console.log('requestSignIn');
				await nearWallet.requestSignIn(`${$page.url}`, ['nft_mint']);
			}}
		>
			connect
		</button>
	</div>
{:else if $state == State.User}
	<div
		class="flex flex-col items-center justify-center text-center w-full h-full"
		on:outroend={swapper.onOutro}
		transition:fade|local={{ duration: 120 }}
	>
		<TokenMint {account} />
	</div>
{/if}
