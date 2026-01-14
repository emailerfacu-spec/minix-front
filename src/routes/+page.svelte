<script lang="ts">
	import { goto, replaceState } from '$app/navigation';
	import Card from '@/components/ui/card/card.svelte';
	import { Content } from '@/components/ui/card';
	import { sesionStore } from '@/stores/usuario';
	import CrearPost from '@/components/crear-post.svelte';
	import { posts, resetPosts, setPosts, updatePostStore } from '@/stores/posts';
	import PostCard from '@/components/PostCard.svelte';
	import type { Post } from '../types';
	import ModalEditar from './[perfil]/modalEditar.svelte';
	import { updatePost } from '@/hooks/updatePost';
	import { fade, slide } from 'svelte/transition';
	import { getPosts } from '@/hooks/getPosts';
	import Spinner from '@/components/ui/spinner/spinner.svelte';
	import { page } from '$app/state';
	import Dialog from '@/components/ui/dialog/dialog.svelte';
	import DialogContent from '@/components/ui/dialog/dialog-content.svelte';

	$effect(() => {
		resetPosts();
		(async () => {
			setPosts(await getPosts());
		})();
	});

	let postAModificar: Post | null = $state(null);
	let mensajeError = $state('');

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
	let from = $state(page.url.searchParams.get('from'));
	$effect(() => {
		goto('/', { replaceState: true });
	});
</script>

{#if from == 'cambio_contraseña'}
	<Dialog
		open={true}
		onOpenChange={() => {
			from = '';
		}}
	>
		<DialogContent>Se cambio la contraseña del usuario exitosamente</DialogContent>
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
			{#if $sesionStore !== null}
				<CrearPost />
			{/if}
			<hr />

			{#if $posts === undefined}
				<Card>
					<Content class="flex items-center justify-center gap-2">
						<Spinner class="h-10 w-10" />
						<p>Cargando</p>
					</Content>
				</Card>
			{:else if $posts.length <= 0}
				<Card>
					<Content>
						<p class=" text-center leading-7 not-first:mt-6">No hay Posts que mostrar</p>
					</Content>
				</Card>
			{:else}
				{#each $posts as post (post.id)}
					<div transition:slide>
						<PostCard {post} bind:postAModificar />
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
{#if postAModificar}
	<div in:fade>
		<ModalEditar callbackfn={handleEditar} bind:post={postAModificar} />
	</div>
{/if}
