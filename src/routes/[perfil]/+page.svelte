<script lang="ts">
	import { apiBase } from '@/stores/url';
	import PenLine from '@lucide/svelte/icons/pen-line';
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
	import CardCargando from '@/components/CardCargando.svelte';
	import CardError from '@/components/CardError.svelte';
	import CardPerfil from '@/components/CardPerfil.svelte';
	import DialogModificarUsuario from '@/components/DialogModificarUsuario.svelte';
	import BotonSeguir from '@/components/BotonSeguir.svelte';
	import UserPen from '@lucide/svelte/icons/user-pen';

	let { params } = $props();

	let cargando = $state(true);
	let mensajeError = $state('');
	let postAModificar: Post | null = $state(null);

	let showCrearPost = $state(false);

	let data = $derived(page.data);

	$effect(() => {
		obtenerPosts();
	});

	async function obtenerPosts() {
		try {
			const req = await fetch($apiBase + '/api/posts/user/' + params.perfil, {
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

<!-- {$inspect(data)} -->
<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		{#key data}
			<CardPerfil bind:data />
		{/key}
		<h1
			class="mt-10 flex scroll-m-20 justify-between text-3xl font-extrabold tracking-tight lg:text-3xl"
		>
			Posts:
			{#if params.perfil == $sesionStore?.username}
				<Button
					variant="ghost"
					size="icon-sm"
					class="m-1 rounded-full bg-blue-600"
					onclick={() => {
						showCrearPost = true;
					}}
				>
					<PenLine />
				</Button>
			{:else if $posts?.length == 0}
				<BotonSeguir post={{ authorId: data.id }} />
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

{#if $sesionStore?.isAdmin || $sesionStore?.username == params.perfil}
	<DialogModificarUsuario bind:data>
		<div class="fixed right-8 bottom-8">
			<Button variant="default" size="icon-lg">
				<UserPen />
			</Button>
		</div>
	</DialogModificarUsuario>
{/if}

<svelte:head>
	<meta property="og:title" content="Mini-x" />
	<meta property="og:description" content={`viendo el perfil de @${data.username}`} />
	<meta property="og:image" content={data.imageUrl} />
	<meta property="og:url" content="https://minix-front.vercel.app/" />
	<meta property="og:type" content="website" />
</svelte:head>
