<script>
	import UserCard from '@/components/UserCard.svelte';

	let { data } = $props();
</script>

<div class="flex min-h-fit w-full flex-col items-center justify-center gap-2 p-6 md:p-10">
	{#each data.usuarios as usu}
		<UserCard {usu} />
	{/each}
</div>
