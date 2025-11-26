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
	import PostCard from '@/components/PostCard.svelte';
	import { posts, setPosts, updatePostStore } from '@/stores/posts.js';
	import InputGroup from '@/components/ui/input-group/input-group.svelte';
	import InputGroupTextarea from '@/components/ui/input-group/input-group-textarea.svelte';
	import InputGroupAddon from '@/components/ui/input-group/input-group-addon.svelte';
	import { updatePost } from '@/hooks/updatePost.js';
	import ModalEditar from './modalEditar.svelte';

	let { params } = $props();

	let cargando = $state(true);
	let mensajeError = $state('');
	let postAModificar: Post | null = $state(null);

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
		//		post.content = 'test';
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
