<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';
	import { fade } from 'svelte/transition';

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
</script>

{#if $state == State.Loading}
	<div on:outroend={swapper.onOutro} transition:fade|local={{ duration: 120 }} />
{:else if $state == State.Guest}
	<div
		on:outroend={swapper.onOutro}
		transition:fade|local={{ duration: 120 }}
		class="pointer-input"
	>
		<h1 class="text-6xl font-light py-6 opacity-75">guest</h1>
		<button
			on:click={async () => {
				console.log('requestSignIn');
				await nearWallet.requestSignIn('/token', ['nft_mint']);
			}}
		>
			connect
		</button>
	</div>
{:else if $state == State.User}
	<h1
		on:outroend={swapper.onOutro}
		transition:fade|local={{ duration: 120 }}
		class="text-6xl font-light py-6 opacity-75"
	>
		user
	</h1>
{/if}

<style>
	.pointer-input {
		pointer-events: all;
	}
</style>
