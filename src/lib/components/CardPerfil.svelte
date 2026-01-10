<script lang="ts">
	import Pen from '@lucide/svelte/icons/pen';
	import ArrowRight from '@lucide/svelte/icons/chevron-right';
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
	import CardHeader from './ui/card/card-header.svelte';
	import CardTitle from './ui/card/card-title.svelte';
	import Badge from './ui/badge/badge.svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	let { data = $bindable() } = $props();

	let cargando = $state(false);
	let hoverimg = $state(false);
	let image: File | null = $state(null);
	let usu = $state({ displayName: data.displayName, bio: data.bio });

	let contenido = $derived(() => {
		let t = data.bio
			.replaceAll('&', '')
			.replaceAll('<', '')
			.replaceAll('>', '')
			.replaceAll('fetch', '')
			.replaceAll('\n', '<br>');

		return t;
	});

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
		await updateUsuario({ id: data.id, profileImage: false, image: image });
		let ret = await obtenerUsuarioPorUsername(data.username);
		if (ret) {
			data = { ...data, ...ret };
		}
		cargando = false;
		hoverimg = false;
	}
</script>

<!-- {$inspect(data)} -->
<Card class="mb-2 flex overflow-hidden">
	<CardContent>
		{#if cargando}
			<div class="flex flex-col items-center space-y-4">
				<Skeleton class="h-18 w-18 rounded-full" />
				<Skeleton class="h-8 w-48" />
				<Skeleton class="h-16 w-3/4 rounded-full" />
			</div>
		{:else if $sesionStore?.isAdmin || $sesionStore?.username == data.username}
			<div class="flex w-full justify-center">
				<button
					class="relative flex items-center justify-center"
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
						class="absolute inset-0 flex items-center justify-center"
						class:opacity-100={hoverimg}
						class:opacity-0={!hoverimg}
					>
						<Pen class="text-white" />
					</div>
				</button>
			</div>

			<h1 class="mt-10 scroll-m-20 text-center text-2xl font-extrabold tracking-tight lg:text-5xl">
				{usu.displayName}
				<p class="ml-2 text-2xl font-medium text-muted-foreground">@{data.username}</p>
			</h1>
			{#if usu.bio}
				<p class="mt-4 rounded-4xl bg-accent p-4 text-center text-muted-foreground">
					{@html contenido()}
					<!-- {usu.bio.replaceAll('<', '')} -->
					<!-- {@html usu.bio.replaceAll('\n', '<br>')} -->
				</p>
			{/if}
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
				{usu.displayName}
				<p class="ml-2 text-2xl font-medium text-muted-foreground">@{data.username}</p>
			</h1>
			{#if usu.bio}
				<p class="mt-4 rounded-4xl bg-accent p-4 text-center text-muted-foreground">
					{@html usu.bio.replaceAll('\n', '<br>')}
				</p>
			{/if}
		{/if}
		<div class="mt-2 flex gap-2">
			<Card class="w-full">
				<CardContent>
					<CardHeader class="flex justify-between">
						<CardTitle>Seguidos:</CardTitle>
						{#if Array.isArray(data?.seguidos?.response)}
							<Badge variant="secondary">{data.countSeguidos || 0}</Badge>
						{/if}
					</CardHeader>
					<CardContent>
						{#if (data.seguidos.response?.length || 0) === 0}
							<h3>No hay Seguidos</h3>
						{:else}
							<div class="flex items-center justify-between">
								<div class="flex -space-x-2">
									{#each data.seguidos.response as seguidos (seguidos.id)}
										<a href={resolve('/[perfil]', { perfil: seguidos.username })}>
											<Avatar class="h-8 w-8 border-2 border-background">
												<AvatarImage src={seguidos.imageUrl} alt={seguidos.username} />
												<AvatarFallback class="text-xs">
													{seguidos.displayName?.[0] || ''}
												</AvatarFallback>
											</Avatar>
										</a>
									{/each}
								</div>
								{#if data.seguidos.response?.length < data.countSeguidos}
									<Button variant="ghost" class="mt-1 ml-4">
										<a href="/{data.username}/seguidos" class="flex items-center gap-2">
											Ver más<ArrowRight />
										</a>
									</Button>
								{/if}
							</div>
						{/if}
					</CardContent>
				</CardContent>
			</Card>
			<Card class="w-full">
				<CardContent>
					<CardHeader class="flex justify-between">
						<CardTitle>Seguidores:</CardTitle>
						{#if Array.isArray(data?.seguidores?.response)}
							<Badge variant="secondary">{data.countSeguidores || 0}</Badge>
						{/if}
					</CardHeader>
					<CardContent>
						{#if (data.seguidores.response?.length || 0) === 0}
							<h3>No hay Seguidores</h3>
						{:else}
							<div class="flex items-center justify-between">
								<div class="flex -space-x-2">
									{#each data.seguidores.response as seguidores (seguidores.id)}
										<a href={resolve('/[perfil]', { perfil: seguidores.username })}>
											<Avatar class="h-8 w-8 border-2 border-background">
												<AvatarImage src={seguidores.imageUrl} alt={seguidores.username} />
												<AvatarFallback class="text-xs">
													{seguidores.displayName?.[0] || ''}
												</AvatarFallback>
											</Avatar>
										</a>
									{/each}
								</div>
								{#if data.seguidores.response?.length < data.countSeguidores}
									<Button
										variant="ghost"
										onclick={() => goto(`/${data.username}/seguidores`)}
										class="mt-1 ml-4"
									>
										<a href="/{data.username}/seguidores" class="flex items-center gap-2">
											Ver más<ArrowRight />
										</a>
									</Button>
								{/if}
							</div>
						{/if}
					</CardContent>
				</CardContent>
			</Card>
		</div>
	</CardContent>
</Card>
