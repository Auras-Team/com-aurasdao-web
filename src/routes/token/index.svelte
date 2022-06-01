<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';

	import { getAccountId } from '$lib/store/near-wallet';

	let loaded: Boolean = false;
	let account: string | null = null;

	// TODO Next: Setup Account login

	onMount(() => {
		if (!browser) return;
		account = getAccountId();
		loaded = true;
	});
</script>

<h1 class="text-6xl font-light py-6 opacity-75">token</h1>
<p class="text-2xl font-light py-2 opacity-85">An exchange of energies.</p>

{#if account != null}
	<p class="text-2xl font-light py-2 opacity-85">Account.</p>
{:else if loaded}
	<p class="text-2xl font-light py-2 opacity-85">Loaded.</p>
{/if}
