<script lang="ts">
	import { apiBase } from '@/stores/url';
	import type { Post } from '../../types.js';
	import { fade, slide } from 'svelte/transition';
	import PostCard from '@/components/PostCard.svelte';
	import { posts, setPosts, updatePostStore } from '@/stores/posts.js';
	import { updatePost } from '@/hooks/updatePost.js';
	import ModalEditar from './modalEditar.svelte';
	import { page } from '$app/state';
	import Button from '@/components/ui/button/button.svelte';
	import { Dialog } from '@/components/ui/dialog';
	import CrearPost from '@/components/crear-post.svelte';
	import DialogContent from '@/components/ui/dialog/dialog-content.svelte';
	import DialogTitle from '@/components/ui/dialog/dialog-title.svelte';
	import { sesionStore } from '@/stores/usuario.js';
	import CardCargando from '@/components/CardCargando.svelte';
	import CardError from '@/components/CardError.svelte';
	import CardPerfil from '@/components/CardPerfil.svelte';
	import DialogModificarUsuario from '@/components/DialogModificarUsuario.svelte';
	import BotonSeguir from '@/components/BotonSeguir.svelte';
	import DialogResetPassword from '@/components/DialogResetPassword.svelte';
	import { onMount } from 'svelte';

	let { params } = $props();

	let cargando = $state(false);
	let finished = $state(false);
	let pageNumber = $state(1);
	let sentinel: HTMLDivElement;

	let mensajeError = $state('');
	let postAModificar: Post | null = $state(null);
	let showCrearPost = $state(false);

	let data = $derived(page.data);

	let fetching = false;

	async function obtenerPosts() {
		if (fetching || finished) return;

		fetching = true;
		cargando = true;

		try {
			
			const res = await fetch(
					`${$apiBase}/api/posts/user/${params.perfil}?page=${pageNumber}&pageSize=20`,
					{
						headers: {
							Authorization: `Bearer ${$sesionStore?.accessToken}`
						}
					}
				);
			const nuevosPosts: Post[] = await res.json();

			if (nuevosPosts.length === 0) {
				finished = true;
				return;
			}

			posts.update((actuales = []) => [...actuales, ...nuevosPosts]);

			pageNumber++;

			if (nuevosPosts.length < 20) {
				finished = true;
			}
		} finally {
			fetching = false;
			cargando = false;
		}
	}

	$effect(() => {
		params.perfil;

		setPosts([]);
		pageNumber = 1;
		finished = false;
		mensajeError = '';

		obtenerPosts();
	});

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					obtenerPosts();
				}
			},
			{ rootMargin: '200px' }
		);

		if (sentinel) observer.observe(sentinel);

		return () => observer.disconnect();
	});

	async function handleEditar(e: SubmitEvent) {
		e.preventDefault();
		if (!postAModificar) return;

		await updatePost(
			postAModificar,
			(postNuevo: Post) =>
				updatePostStore(postAModificar!.id, postNuevo),
			mensajeError
		);

		postAModificar = null;
	}
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		{#key data}
			<CardPerfil bind:data />
		{/key}

		<h1 class="mt-10 flex justify-between text-3xl font-extrabold">
			Posts:
			{#if params.perfil === $sesionStore?.username}
				<Button
					variant="ghost"
					size="icon-sm"
					class="rounded-full bg-blue-600"
					onclick={() => (showCrearPost = true)}
				>
					+
				</Button>
			{:else if $posts.length === 0}
				<BotonSeguir post={{ authorId: data.id, id: data.id }} />
			{/if}
		</h1>

		<hr class="mb-8" />

		{#if cargando && $posts.length === 0}
			<CardCargando />
		{:else if mensajeError}
			<CardError {mensajeError} />
		{:else if $posts.length === 0}
			<CardError mensajeError="Este usuario no tiene posts" />
		{:else}
			<div class="flex flex-col gap-2">
				{#each $posts as post (post.id)}
					<div transition:slide>
						<PostCard {post} bind:postAModificar />
					</div>
				{/each}
			</div>
		{/if}

		<div bind:this={sentinel} class="h-1"></div>

		{#if cargando && $posts.length > 0}
			<div class="flex justify-center py-4">
				<CardCargando />
			</div>
		{/if}
	</div>
</div>

{#if postAModificar}
	<div in:fade>
		<ModalEditar callbackfn={handleEditar} bind:post={postAModificar} />
	</div>
{/if}

<Dialog open={showCrearPost} onOpenChange={() => (showCrearPost = false)}>
	<DialogContent>
		<DialogTitle>Crear publicación</DialogTitle>
		<CrearPost />
	</DialogContent>
</Dialog>

{#if $sesionStore?.isAdmin || $sesionStore?.username === params.perfil}
	<div class="fixed right-8 bottom-8 flex flex-col gap-2">
		<DialogModificarUsuario bind:data>
			<Button>Modificar Usuario</Button>
		</DialogModificarUsuario>
		<DialogResetPassword bind:data>
			<Button>Reset Password</Button>
		</DialogResetPassword>
	</div>
{/if}

<svelte:head>
	<meta property="og:title" content="Mini-x" />
	<meta property="og:description" content={`viendo el perfil de @${data.username}`} />
	<meta property="og:image" content={data.imageUrl} />
	<meta property="og:type" content="website" />
</svelte:head>