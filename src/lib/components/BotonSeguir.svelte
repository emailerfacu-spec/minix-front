<script lang="ts">
	import { sesionStore } from '@/stores/usuario';
	import { Tooltip } from './ui/tooltip';
	import TooltipTrigger from './ui/tooltip/tooltip-trigger.svelte';
	import Button from './ui/button/button.svelte';
	import UserX from '@lucide/svelte/icons/user-x';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import Spinner from './ui/spinner/spinner.svelte';
	import TooltipContent from './ui/tooltip/tooltip-content.svelte';
	import { esSeguido } from '@/hooks/esSeguido';
	import { seguirUsuario } from '@/hooks/seguirUsuario';
	import type { Post } from '../../types';
	import CardError from './CardError.svelte';
	import { cacheSeguidos } from '@/stores/cacheSeguidos.svelte';

	let {
		post,
		variant = 'icon-lg'
	}: {
		post: Omit<Partial<Post>, 'authorId'> & { authorId: string; id: string };
		variant?: 'icon-lg' | 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm';
	} = $props();

	let seguido: boolean | null = $state(null);

	if (typeof window !== 'undefined') {
		window.addEventListener('followCacheUpdated', ((
			event: CustomEvent<{ userId: string; isFollowed: boolean } | { clearAll: true }>
		) => {
			if ('clearAll' in event.detail && event.detail.clearAll === true) {
			} else if ('userId' in event.detail && event.detail.userId === post.authorId) {
				seguido = event.detail.isFollowed;
			}
		}) as EventListener);
	}

	$effect(() => {
		(async () => {
			await cargarSeguido();
		})();
	});

	async function cargarSeguido() {
		let a = cacheSeguidos.get(post.authorId);
		if (a === undefined) {
			const seguidoStatus = await esSeguido(post as Post);
			if (seguidoStatus) {
				cacheSeguidos.set(post.authorId, seguidoStatus.isFollowing || false);
				seguido = seguidoStatus.isFollowing || false;
			}
			return;
		}
		seguido = a;
	}

	let mensajeError: string | null = $state(null);
</script>

{#if mensajeError}
	<CardError {mensajeError} />
{/if}

{#if post.authorName !== $sesionStore?.username && post.authorName !== '[deleted]'}
	<Tooltip>
		<TooltipTrigger>
			<Button
				variant={seguido == true ? 'destructive' : 'outline'}
				disabled={seguido == null}
				size={variant}
				onclick={async () => {
					if (seguido == null) return;
					const anteriorEstado = seguido;
					let ret = seguirUsuario(post.authorId, seguido);
					seguido = null;

					let [res] = await Promise.all([
						await ret,
						new Promise((resolve) => setTimeout(resolve, 300))
					]);

					if (res === null) mensajeError = 'Fallo al intentar seguir el usuario';
					if (res === true) seguido = !anteriorEstado;
					cacheSeguidos.set(post.authorId, seguido == null ? false : Boolean(seguido));
				}}
			>
				{#if seguido == true}
					<UserX />
				{:else if seguido == false}
					<UserPlus />
				{:else}
					<Spinner />
				{/if}
			</Button>
		</TooltipTrigger>
		<TooltipContent>
			{#if seguido == true}
				Dejar de seguir
			{:else}
				Seguir
			{/if}
		</TooltipContent>
	</Tooltip>
{/if}
