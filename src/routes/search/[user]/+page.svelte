<script lang="ts">
	import { page } from '$app/state';
	import UserCard from '@/components/UserCard.svelte';
	let { data } = $props();
</script>

<div class="flex min-h-fit w-full flex-col items-center justify-center gap-2 p-6 md:p-10">
	{#each data.usuarios as usu}
		<UserCard {usu} />
	{/each}
</div>

<svelte:head>
	<meta property="og:title" content="Mini-x" />
	<meta property="og:description" content={`Buscando ${page.params.user}`} />
	<meta property="og:image" content="https://minix-front.vercel.app/x.png" />
	<meta property="og:url" content="https://minix-front.vercel.app/" />
	<meta property="og:type" content="website" />
</svelte:head>
