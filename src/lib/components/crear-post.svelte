<script lang="ts">
	import InputGroupAddon from './ui/input-group/input-group-addon.svelte';
	import InputGroupButton from './ui/input-group/input-group-button.svelte';
	import InputGroupTextarea from './ui/input-group/input-group-textarea.svelte';
	import InputGroup from './ui/input-group/input-group.svelte';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import Kbd from './ui/kbd/kbd.svelte';

	import { apiBase } from '@/stores/url';
	import { sesionStore } from '@/stores/usuario';
	import type { CreatePostDto } from '../../types';
	import { addPost } from '@/stores/posts';

	let mensaje = $state('');

	let cargando = $state(false);
	let mostrarError = $state('');

	async function handlePost(e: Event) {
		e.preventDefault();
		try {
			const data: CreatePostDto = {
				content: mensaje,
				imageUrl: null,
				parentPostId: null
			};

			const req = fetch($apiBase + '/api/posts', {
				method: 'POST',
				//credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					"Authorization": `Bearer ${$sesionStore?.accessToken}`
				},

				body: JSON.stringify(data)
			});
			cargando = true;

			const res = await req;
			if (res.ok) {
				mensaje = '';
				const post = await res.json();
				addPost(post);
				return;
			}
			mostrarError = 'No se pudo crear el post.';
		} catch {
			mostrarError = 'Fallo al alcanzar el servidor';
		} finally {
			cargando = false;
		}
	}
</script>

<form onsubmit={(e: Event) => handlePost(e)}>
	<InputGroup>
		<InputGroupTextarea bind:value={mensaje} maxlength="280" placeholder="Alguna novedad?"
		></InputGroupTextarea>

		<InputGroupAddon align="block-end" class="bg-">
			<div class="flex w-full justify-between">
				<Kbd class="text-sm leading-none font-medium italic">
					<p class:text-red-500={mensaje.length > 239}>
						{mensaje.length}
					</p>
					/ 280
				</Kbd>
				<InputGroupButton
					variant="default"
					type="submit"
					class="transform rounded-full transition-transform ease-in hover:scale-120"
					size="xs"
				>
					<p>Publicar</p>
					<ArrowUpIcon />
				</InputGroupButton>
			</div>
		</InputGroupAddon>
	</InputGroup>
</form>
