<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { UserResponseDto } from '../../../types';
	import UserCard from '@/components/UserCard.svelte';
	import { goto } from '$app/navigation';
	import { obtenerSeguidoresPorUsuario } from '@/hooks/obtenerSeguidoresPorUsuario';

	type Data = {
		usuario: UserResponseDto;
		seguidores: UserResponseDto[];
		totalCount: number;
	};

	let { data }: { data: Data } = $props();

	let currentPage = $state(1);
	let isLoading = $state(false);
	const limit = 100;

	let totalPages = $derived(Math.ceil(data.totalCount / limit));

	async function loadPage(page: number) {
		if (isLoading) return;

		isLoading = true;
		const response = await obtenerSeguidoresPorUsuario(data.usuario.id, page, limit);

		if (response) {
			data.seguidores = response.response as UserResponseDto[];
			data.totalCount = response.totalCount;
			currentPage = page;
		}

		isLoading = false;
	}
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		<div class="mb-4 flex items-center justify-between gap-2 rounded-md border bg-card p-2">
			<p class="text-2xl">
				Seguidores de @{data.usuario.username}
			</p>
			<button
				class="rounded-full p-2 hover:bg-accent"
				onclick={() => goto(`/${data.usuario.username}`)}
			>
				<ArrowLeft />
			</button>
		</div>

		{#if isLoading}
			<div class="py-8 text-center text-muted-foreground">
				<p>Cargando...</p>
			</div>
		{:else if data.seguidores.length === 0}
			<div class="py-8 text-center text-muted-foreground">
				<p>No hay seguidos para mostrar.</p>
			</div>
		{:else}
			<div class="flex flex-col sm:grid" style="grid-template-columns: repeat(2, 1fr); gap: 1rem;">
				{#each data.seguidores as follower (follower.id)}
					<div class="h-fit">
						<UserCard usu={follower} />
					</div>
				{/each}
			</div>
		{/if}

		{#if totalPages > 1}
			<div class="mt-6 flex items-center justify-center gap-2">
				<button
					class="rounded-md border bg-card p-2 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
					onclick={() => loadPage(currentPage - 1)}
					disabled={currentPage === 1 || isLoading}
				>
					<ChevronLeft class="h-5 w-5" />
				</button>

				<span class="px-4 text-sm text-muted-foreground">
					Página {currentPage} de {totalPages}
				</span>

				<button
					class="rounded-md border bg-card p-2 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
					onclick={() => loadPage(currentPage + 1)}
					disabled={currentPage === totalPages || isLoading}
				>
					<ChevronRight class="h-5 w-5" />
				</button>
			</div>
		{/if}
	</div>
</div>
