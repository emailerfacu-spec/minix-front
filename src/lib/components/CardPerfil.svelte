<script lang="ts">
	import Pen from '@lucide/svelte/icons/pen';
	import AvatarFallback from './ui/avatar/avatar-fallback.svelte';
	import AvatarImage from './ui/avatar/avatar-image.svelte';
	import Avatar from './ui/avatar/avatar.svelte';
	import CardContent from './ui/card/card-content.svelte';
	import Card from './ui/card/card.svelte';
	import Skeleton from './ui/skeleton/skeleton.svelte';
	import Button from './ui/button/button.svelte';
	import { updateImagenDePerfil } from '@/hooks/updateImagenDePerfil';
	import { updateUsuario } from '@/hooks/updateUsuario';
	import { sesionStore } from '@/stores/usuario';
	import { obtenerUsuarioPorUsername } from '@/hooks/obtenerUsuario';

	let { data = $bindable() } = $props();

	let cargando = $state(false);
	let hoverimg = $state(false);
	let image: File | null = $state(null);

	async function cambiarFotoDePerfil() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		await new Promise<void>((resolve) => {
			input.onchange = (event) => {
				const target = event.target as HTMLInputElement;
				if (target.files && target.files[0]) {
					image = target.files[0];
				}
				resolve();
			};
			input.click();
		});
		if (image === null) return;
		cargando = true;
		await updateUsuario({ id: data.id, profileImage: true, image: image });
		let ret = await obtenerUsuarioPorUsername(data.username);
		if (ret) {
			data = { ...data, ...ret };
		}
		cargando = false;
		hoverimg = false;
	}
</script>

<!-- <Button onclick={() => (cargando = !cargando)}>a</Button> -->
<Card class="mb-2 flex w-3/4 overflow-hidden">
	<CardContent>
		{#if cargando}
			<div class="flex flex-col items-center space-y-4">
				<Skeleton class="h-18 w-18 rounded-full" />
				<Skeleton class="h-8 w-48" />
				<Skeleton class="h-16 w-3/4 rounded-full" />
			</div>
		{:else if $sesionStore?.isAdmin || $sesionStore?.username == data.username}
			<button
				class="relative flex w-full items-center justify-center"
				onmouseenter={() => (hoverimg = true)}
				onmouseleave={() => (hoverimg = false)}
				onclick={cambiarFotoDePerfil}
			>
				<Avatar
					class={{
						'brightness-0': hoverimg,
						'relative z-0 mt-2 scale-250 border-2 border-slate-950 transition-all': true
					}}
				>
					<AvatarImage src={data.imageUrl} alt="Imagen de perfil"></AvatarImage>
					<AvatarFallback class="select-none">
						{data.displayName?.[0]?.toUpperCase() || ''}
					</AvatarFallback>
				</Avatar>
				<div
					class="absolute inset-0 top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center"
					class:opacity-100={hoverimg}
					class:opacity-0={!hoverimg}
				>
					<Pen class="text-white" />
				</div>
			</button>
			<h1 class="mt-10 scroll-m-20 text-center text-2xl font-extrabold tracking-tight lg:text-5xl">
				{data.displayName}
				<p class="ml-2 text-2xl font-medium text-muted-foreground">@{data.username}</p>
			</h1>
			<p class="mt-4 rounded-full bg-accent p-4 text-center text-muted-foreground">
				{data.bio}
			</p>
		{:else}
			<div class="relative flex w-full items-center justify-center">
				<Avatar
					class={{
						'brightness-0': hoverimg,
						'relative z-0 mt-2 scale-250 border-2 border-slate-950 transition-all': true
					}}
				>
					<AvatarImage src={data.imageUrl} alt="Imagen de perfil"></AvatarImage>
					<AvatarFallback class="select-none">
						{data.displayName?.[0]?.toUpperCase() || ''}
					</AvatarFallback>
				</Avatar>
			</div>
			<h1 class="mt-10 scroll-m-20 text-center text-2xl font-extrabold tracking-tight lg:text-5xl">
				{data.displayName}
			</h1>
			<p class="mt-4 rounded-full bg-accent p-4 text-center text-muted-foreground">
				{data.bio}
			</p>
		{/if}
	</CardContent>
</Card>
