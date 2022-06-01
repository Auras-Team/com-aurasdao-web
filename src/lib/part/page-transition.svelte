<script>
	import { fly } from 'svelte/transition';
	export let url = '';
</script>

<div class="box box-size box-content">
	{#key url}
		<div
			class="flex flex-col items-center justify-center py-16 pb-32"
			in:fly|local={{ x: -5, duration: 500, delay: 500 }}
		>
			<slot />
		</div>
	{/key}
</div>
