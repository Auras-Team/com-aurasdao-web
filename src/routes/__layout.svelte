<script lang="ts" context="module">
	import { Buffer } from 'buffer';
	import { browser } from '$app/env';

	import { getConfig, loadNearConfig, nearWallet } from '$lib/store/near-wallet';

	import PageTransition from '$lib/part/page-transition.svelte';

	export const load = async ({ fetch }: { fetch: Fetch }) => {
		if (browser && typeof window.Buffer === 'undefined') {
			window.Buffer = Buffer;
		}
		await loadNearConfig(fetch);
		await nearWallet.connect(getConfig());
		console.log(`load:near:active:`, nearWallet.isSignedIn());
		console.log(`load:near:account:`, nearWallet.getAccountId());
		return {};
	};
</script>

<script>
	import { page } from '$app/stores';

	import '../app.css';

	$: tokenPath = $page.routeId && $page.routeId.includes('token');
	$: infoPath = $page.routeId && $page.routeId.includes('info');
	$: roadmapPath = $page.routeId && $page.routeId.includes('roadmap');
	$: storyPath = $page.routeId && $page.routeId.includes('story');
</script>

<div class="box box-size box-base">
	<div class="box-size base-back" />
</div>
<div class="box box-size box-focus">
	<div class="box-size focus-back" />
</div>
<div class="box box-size box-navi">
	<div class="navi navi-lt">
		<a href="/token" class="navi-link w-24 text-center">
			<p class="font-light opacity-75">mint</p>
		</a>
	</div>
	<div class="navi navi-rt">
		<a href="/story" class="navi-link w-24 text-center">
			<p class="font-light opacity-75">story</p>
		</a>
	</div>
	<div class="navi navi-lb">
		<a href="/roadmap" class="navi-link w-44 text-center">
			<p class="font-light opacity-75">roadmap</p>
		</a>
	</div>
	<div class="navi navi-rb">
		<a href="/info" class="navi-link w-24 text-center">
			<p class="font-light opacity-75">info</p>
		</a>
	</div>
</div>

<PageTransition url={$page.url.href}>
	<slot />
</PageTransition>
