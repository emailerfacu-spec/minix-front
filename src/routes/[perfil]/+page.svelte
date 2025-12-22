<script lang="ts">
	import { apiBase } from '@/stores/url';
	import Ban from '@lucide/svelte/icons/ban';
	import PenLine from '@lucide/svelte/icons/pen-line';
	import Card from '@/components/ui/card/card.svelte';
	import { CardContent } from '@/components/ui/card';
	import type { Post } from '../../types.js';
	import { fade, slide } from 'svelte/transition';
	import PostCard from '@/components/PostCard.svelte';
	import { posts, setPosts, updatePostStore } from '@/stores/posts.js';
	import { updatePost } from '@/hooks/updatePost.js';
	import ModalEditar from './modalEditar.svelte';
	import { page } from '$app/state';
	import Button from '@/components/ui/button/button.svelte';
	import { Dialog } from '@/components/ui/dialog/index.js';
	import CrearPost from '@/components/crear-post.svelte';
	import DialogContent from '@/components/ui/dialog/dialog-content.svelte';
	import DialogTitle from '@/components/ui/dialog/dialog-title.svelte';
	import { sesionStore } from '@/stores/usuario.js';
	import CardHeader from '@/components/ui/card/card-header.svelte';
	import CardTitle from '@/components/ui/card/card-title.svelte';
	import Badge from '@/components/ui/badge/badge.svelte';
	import CardCargando from '@/components/CardCargando.svelte';
	import CardError from '@/components/CardError.svelte';
	import CardPerfil from '@/components/CardPerfil.svelte';

	let { params } = $props();

	let cargando = $state(true);
	let mensajeError = $state('');
	let postAModificar: Post | null = $state(null);

	let showCrearPost = $state(false);
	const toggleCrearPost = () => (showCrearPost = !showCrearPost);

	const { subscribe } = apiBase;
	let baseUrl: string = '';
	let data = $state(page.data);

	subscribe((value) => {
		baseUrl = value;
	})();

	$effect(() => {
		obtenerPosts();
	});

	async function obtenerPosts() {
		try {
			const req = await fetch(baseUrl + '/api/posts/user/' + params.perfil, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${$sesionStore?.accessToken}`
				}
			});
			if (req.ok) {
				setPosts(await req.json());
				return;
			}
			mensajeError = 'Fallo al obtener los datos';
		} catch {
			mensajeError = 'No se alcanzo el servidor';
		} finally {
			cargando = false;
		}
	}

	async function handleEditar(e: SubmitEvent) {
		e.preventDefault();
		if (postAModificar == null) return;
		await updatePost(
			postAModificar,
			(postnuevo: Post) => updatePostStore(postAModificar!.id, postnuevo),

			mensajeError
		);
		postAModificar = null;
	}
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		<div class="flex gap-2">
			<CardPerfil bind:data />
			<aside class="flex w-1/4 flex-col gap-2">
				<Card class="w-full">
					<CardContent>
						<CardHeader class="flex justify-between">
							<CardTitle>Seguidos:</CardTitle>
							<Badge variant="secondary">{data.seguidos.length}</Badge>
						</CardHeader>
						<CardContent>
							{#if data.seguidos.length === 0}
								<h3>No hay Seguidos</h3>
							{:else}
								{#each data.seguidos as seguidos (seguidos.id)}
									<p class="text-muted-foreground">
										{seguidos.username}
									</p>
								{/each}
							{/if}
						</CardContent>
					</CardContent>
				</Card>
				<Card class="w-full">
					<CardContent>
						<CardHeader class="flex justify-between">
							<CardTitle>Seguidores:</CardTitle>
							<Badge variant="secondary">{data.seguidores.length}</Badge>
						</CardHeader>
						<CardContent>
							{#if data.seguidores.length === 0}
								<h3>No hay Seguidores</h3>
							{:else}
								{#each data.seguidores as seguidores (seguidores.id)}
									<p class="text-muted-foreground">
										{seguidores.username}
									</p>
								{/each}
							{/if}
						</CardContent>
					</CardContent>
				</Card>
			</aside>
		</div>

		<h1
			class="mt-10 flex scroll-m-20 justify-between text-3xl font-extrabold tracking-tight lg:text-3xl"
		>
			Posts:
			{#if params.perfil == $sesionStore?.username}
				<Button
					variant="ghost"
					class="m-1 rounded-full bg-blue-600"
					onclick={() => {
						showCrearPost = true;
					}}
				>
					<PenLine />
				</Button>
			{/if}
		</h1>

		<hr class="mb-8" />
		{#if cargando}
			<CardCargando />
		{:else if mensajeError !== ''}
			<CardError {mensajeError} />
		{:else}
			<div class="flex flex-col gap-2">
				{#each $posts as post (post.id)}
					<div transition:slide>
						<PostCard {post} bind:postAModificar />
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
{#if postAModificar}
	<div in:fade>
		<ModalEditar callbackfn={handleEditar} bind:post={postAModificar} />
	</div>
{/if}

<div transition:fade>
	<Dialog open={showCrearPost} onOpenChange={() => (showCrearPost = false)}>
		<DialogContent
			onkeydown={(e: KeyboardEvent) => {
				if (e.ctrlKey && e.key === 'Enter') {
					showCrearPost = false;
				}
			}}
		>
			<DialogTitle>Crear Publicacion</DialogTitle>
			<CrearPost />
		</DialogContent>
	</Dialog>
</div>
