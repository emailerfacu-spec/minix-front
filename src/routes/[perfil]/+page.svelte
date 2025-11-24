<script lang="ts">
	import { apiBase } from '@/stores/url';
	import Ban from '@lucide/svelte/icons/ban';
	import Card from '@/components/ui/card/card.svelte';
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '@/components/ui/avatar/avatar-fallback.svelte';
	import { CardContent } from '@/components/ui/card';
	import type { Post } from '../../types.js';
	import Spinner from '@/components/ui/spinner/spinner.svelte';
	import { fade, slide } from 'svelte/transition';

	let { params } = $props();

	let posts: Post[] = $state([]);
	let cargando = $state(true);
	let mensajeError = $state('');

	const { subscribe } = apiBase;
	let baseUrl: string = '';

	subscribe((value) => {
		baseUrl = value;
	})();

	$effect(() => {
		obtenerPosts();
	});

	async function obtenerPosts() {
		try {
			const req = await fetch(baseUrl + '/api/posts/user/' + params.perfil, {
				method: 'GET'
			});
			if (req.ok) {
				posts = await req.json();
				return;
			}
			mensajeError = 'Fallo al obtener los datos';
		} catch {
			mensajeError = 'No se alcanzo el servidor';
		} finally {
			cargando = false;
		}
	}
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-2xl">
		<Card class="mb-2 overflow-hidden">
			<CardContent>
				<div class="flex justify-center">
					<Avatar class="mt-2 scale-250 border-2 border-slate-950">
						<AvatarImage></AvatarImage>
						<AvatarFallback>{params.perfil[0].toUpperCase()}</AvatarFallback>
					</Avatar>
				</div>
				<h1
					class="mt-10 scroll-m-20 text-center text-2xl font-extrabold tracking-tight lg:text-5xl"
				>
					{'test'}
				</h1>
				<h3 class="scroll-m-20 text-center text-2xl tracking-tight text-muted-foreground">
					@{params.perfil}
				</h3>
			</CardContent>
		</Card>
		<h1 class="mt-10 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-3xl">Posts:</h1>
		<hr class="mb-8" />
		{#if cargando}
			<div out:slide>
				<Card>
					<CardContent class="flex w-full flex-col items-center justify-center">
						<Spinner class="size-9" />
						<p class="leading-7 not-first:mt-6">Cargando</p>
					</CardContent>
				</Card>
			</div>
		{:else if mensajeError !== ''}
			<div in:fade>
				<Card class="border-red-500">
					<CardContent class="flex w-full flex-col items-center justify-center">
						<Ban class="scale-120 text-red-500"></Ban>
						<p class="mt-2 text-lg leading-7 text-red-500">
							{mensajeError}
						</p>
					</CardContent>
				</Card>
			</div>
		{/if}
	</div>
</div>
