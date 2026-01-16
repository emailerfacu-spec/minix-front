<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import Card from '@/components/ui/card/card.svelte';
	import { Content } from '@/components/ui/card';
	import Spinner from '@/components/ui/spinner/spinner.svelte';
	import Dialog from '@/components/ui/dialog/dialog.svelte';
	import DialogContent from '@/components/ui/dialog/dialog-content.svelte';
	import CrearPost from '@/components/crear-post.svelte';
	import PostCard from '@/components/PostCard.svelte';
	import ModalEditar from './[perfil]/modalEditar.svelte';
	import { sesionStore } from '@/stores/usuario';
	import { posts, updatePostStore, loadingPosts } from '@/stores/posts';
	import { updatePost } from '@/hooks/updatePost';
	import { loadMorePosts } from '@/hooks/loadMorePosts';
	import type { Post } from '../types';
	import { fade, slide } from 'svelte/transition';

	let postAModificar: Post | null = $state(null);
	let mensajeError = $state('');
	let sentinel: HTMLDivElement;

	$effect(() => {
		loadMorePosts();

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					loadMorePosts();
				}
			},
			{ rootMargin: '200px' }
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	});

	async function handleEditar(e: SubmitEvent) {
		e.preventDefault();
		if (!postAModificar) return;

		await updatePost(
			postAModificar,
			(postNuevo: Post) => updatePostStore(postAModificar!.id, postNuevo),
			mensajeError
		);
		postAModificar = null;
	}

	let from = page.url.searchParams.get('from');

	if (from) {
		replaceState('/', {});
	}
</script>

{#if from === 'cambio_contraseña'}
	<Dialog open>
		<DialogContent>Se cambió la contraseña del usuario exitosamente</DialogContent>
	</Dialog>
{/if}

<svelte:head>
	<meta property="og:title" content="Mini-x" />
	<meta property="og:description" content="Pagina Principal" />
	<meta property="og:image" content="/x.png" />
	<meta property="og:url" content="https://minix-front.vercel.app/" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		<div class="flex flex-col gap-2">
			{#if $sesionStore}
				<CrearPost />
			{/if}
			<hr />

			{#if $posts.length === 0 && $loadingPosts}
				<Card>
					<Content class="flex items-center justify-center gap-2">
						<Spinner class="h-10 w-10" />
						<p>Cargando</p>
					</Content>
				</Card>
			{:else if $posts.length === 0}
				<Card>
					<Content>
						<p class="text-center leading-7">No hay Posts que mostrar</p>
					</Content>
				</Card>
			{:else}
				{#each $posts as post (post.id)}
					<div animate:slide>
						<PostCard {post} bind:postAModificar />
					</div>
				{/each}
			{/if}
		</div>
		<div bind:this={sentinel} class="h-1"></div>

		{#if $loadingPosts && $posts.length > 0}
			<div class="flex justify-center py-4">
				<Spinner />
			</div>
		{/if}
	</div>
</div>
{#if postAModificar}
	<div in:fade>
		<ModalEditar callbackfn={handleEditar} bind:post={postAModificar} />
	</div>
{/if}
