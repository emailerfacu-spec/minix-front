<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/chevron-left';
	import type { UserResponseDto } from '../../../types';
	import UserCard from '@/components/UserCard.svelte';
	import { goto } from '$app/navigation';

	type Data = {
		usuario: UserResponseDto;
		seguidos: UserResponseDto[];
	};

	let { data }: { data: Data } = $props();
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		<div class="mb-4 flex items-center justify-between gap-2 rounded-md border bg-card p-2">
			<p class="text-2xl">
				Seguidos de @{data.usuario.username}
			</p>
			<button
				class="rounded-full p-2 hover:bg-accent"
				onclick={() => goto(`/${data.usuario.username}`)}
			>
				<ArrowLeft />
			</button>
		</div>
		{#if data.seguidos.length === 0}
			<div class="py-8 text-center text-muted-foreground">
				<p>No hay seguidos para mostrar.</p>
			</div>
		{:else}
			<div class="flex flex-col sm:grid" style="grid-template-columns: repeat(2, 1fr); gap: 1rem;">
				{#each data.seguidos as follower (follower.id)}
					<div class="h-fit">
						<UserCard usu={follower} />
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
