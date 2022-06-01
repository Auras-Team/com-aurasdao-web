<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';

	import { nearWallet } from '$lib/store/near-wallet';
	import { swapTransition } from '$lib/utility/swap-stores';

	import type { Unsubscriber } from 'svelte/store';

	let loaded: Boolean = false;
	let account: string | null = null;

	const enum State {
		Loading,
		Guest,
		User
	}

	const swapper = swapTransition(State.Loading);
	const state = swapper.state;
	// TODO Next: Setup Account login

	let unsubState: Unsubscriber | null = null;

	onMount(() => {
		if (!browser) return;
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
		<button
			class="btn btn-slate w-full"
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
		class="pointer-input w-full"
		on:outroend={swapper.onOutro}
		transition:fade|local={{ duration: 120 }}
	>
		<h1 class="text-6xl font-light py-6 opacity-75">user</h1>
		<button class="btn btn-slate w-full">{account}</button>
	</div>
{/if}

<style>
	.pointer-input {
		pointer-events: all;
	}
	.btn {
		@apply py-2 px-2 rounded;
	}
	.btn-slate {
		@apply bg-slate-50 bg-opacity-20;
		transition: all 0.1s ease-in-out;
	}
	.btn-slate:hover {
		@apply bg-opacity-30;
		transform: scale(0.99);
	}
</style>
