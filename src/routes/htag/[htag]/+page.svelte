<script lang="ts">
	import PostCard from '@/components/PostCard.svelte';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import CardTitle from '@/components/ui/card/card-title.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import type { Post } from '../../../types.js';
	import ModalEditar from '../../[perfil]/modalEditar.svelte';
	import { fade, slide } from 'svelte/transition';
	import { posts, setPosts, updatePostStore } from '@/stores/posts';
	import { updatePost } from '@/hooks/updatePost';
	import Separator from '@/components/ui/separator/separator.svelte';
	import { page } from '$app/state';
	import { obtenerCantidadDeUsosdeHtag } from '@/hooks/obtenerCantidadDeUsosdeHtag';

	let currentPage = $state(1);
	let loading = $state(false);

	async function cargarPagina(pageNumber: number) {
		loading = true;
		const res = await obtenerCantidadDeUsosdeHtag(
			data.htag,
			fetch,
			pageNumber,
			20
		);

		if (res) {
			setPosts(res.response);
			currentPage = pageNumber;
		}
		loading = false;
	}

	interface props {
		data: {
			htag: string;
			posts: {
				count: number;
				response: [Post];
			};
		};
	}

	let { data }: props = $props();

	//seteo los posts en el store
	$effect(() => setPosts(data.posts.response));

	let postAModificar: Post | null = $state(null);

	let postsfiltro = $derived(
		$posts?.filter((x) => {
			const regex = new RegExp(`#${data.htag}\\b`, 'gm');
			return regex.test(x.content);
		})
	);

	async function handleEditar(e: SubmitEvent) {
		e.preventDefault();
		if (postAModificar == null) return;
		await updatePost(
			postAModificar,
			(postnuevo: Post) => updatePostStore(postAModificar!.id, postnuevo),

			''
		);
		postAModificar = null;
	}
</script>

<div class="flex min-h-fit w-full flex-col items-center justify-center pt-2">
	<div class=" w-full max-w-6xl flex-col items-center">
		<div class="flex justify-center">
			<Card class="w-fit">
				<CardContent>
					<CardTitle>
						<h1
							class="mb-2 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-blue-500 lg:text-5xl"
						>
							#{data.htag}
						</h1>
						<Separator></Separator>
					</CardTitle>
					<p>
						El hashtag se ha utilizado {data.posts.count} ve{#if data.posts.count > 1}ces{:else}z{/if}
					</p>
				</CardContent>
			</Card>
		</div>
		<hr class="my-2" />

		<div class="mt-1 flex flex-col gap-3">
			{#each postsfiltro as post (post.id)}
				<div transition:slide>
					<PostCard {post} bind:postAModificar />
				</div>
			{/each}
		</div>
	</div>
</div>
<div class="mt-6 mb-12 flex items-center justify-center gap-4">
	<button
		class="rounded-md border bg-card p-2 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
		onclick={() => cargarPagina(currentPage - 1)}
		disabled={currentPage === 1 || loading}
	>
		Anterior
	</button>

	<span class="text-sm font-semibold">
		Página {currentPage}
	</span>

	<button
		class="rounded-md border bg-card p-2 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
		onclick={() => cargarPagina(currentPage + 1)}
		disabled={loading || (postsfiltro?.length ?? 0) < 20}
	>
		Siguiente
	</button>
</div>
{#if postAModificar}
	<div in:fade>
		<ModalEditar callbackfn={handleEditar} bind:post={postAModificar} />
	</div>
{/if}

<svelte:head>
	<meta property="og:title" content="Mini-x" />
	<meta property="og:description" content={`Buscando #${page.params.htag}`} />
	<meta property="og:image" content="https://minix-front.vercel.app/x.png" />
	<meta property="og:url" content="https://minix-front.vercel.app/" />
	<meta property="og:type" content="website" />
</svelte:head>
