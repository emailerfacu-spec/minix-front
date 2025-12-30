<script lang="ts">
	import CommandDialog from '@/components/ui/command/command-dialog.svelte';
	import CommandGroup from '@/components/ui/command/command-group.svelte';
	import CommandInput from '@/components/ui/command/command-input.svelte';
	import CommandItem from '@/components/ui/command/command-item.svelte';
	import CommandList from '@/components/ui/command/command-list.svelte';
	import InputGroupAddon from '@/components/ui/input-group/input-group-addon.svelte';
	import InputGroupInput from '@/components/ui/input-group/input-group-input.svelte';
	import InputGroup from '@/components/ui/input-group/input-group.svelte';
	import Kbd from '@/components/ui/kbd/kbd.svelte';
	import Search from '@lucide/svelte/icons/search';
	import User from '@lucide/svelte/icons/user';
	import Hash from '@lucide/svelte/icons/hash';
	import Spinner from '@/components/ui/spinner/spinner.svelte';
	import { busquedaUsuarios } from '@/hooks/busquedaUsuarios';
	import type { UserResponseDto } from '../../types';
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import Label from '@/components/ui/label/label.svelte';
	import { resolve } from '$app/paths';

	let search: string = $state('');
	let open = $state(false);

	let usuarios: UserResponseDto[] = $state([]);
	let loading = $state(false);

	let hashtags: Promise<any[]> | undefined = $state();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}
	$inspect(usuarios, loading);

	let timeoutId: number | undefined;
	function buscar() {
		loading = true;
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(async () => {
			usuarios = await busquedaUsuarios(search);
			loading = false;
		}, 200);

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<InputGroup>
	<InputGroupAddon align="inline-start"><Search /></InputGroupAddon>
	<InputGroupInput
		type="text"
		placeholder="Buscar Usuario o Hashtag"
		bind:value={search}
		oninput={() => (open = true)}
	/>
	<InputGroupAddon align="inline-end" class="flex gap-0">
		<Kbd>Ctrl</Kbd>+<Kbd>K</Kbd>
	</InputGroupAddon>
</InputGroup>
<CommandDialog bind:open>
	<CommandInput
		type="text"
		placeholder="Buscar Usuario o Hashtag"
		bind:value={search}
		oninput={buscar}
	/>
	{#if search}
		<ul class="space-y-2">
			<Label class="ms-3 text-sm font-medium text-muted-foreground">Usuarios</Label>
			{#each usuarios as usuario}
				<li class=" w-full cursor-pointer rounded-md hover:bg-accent">
					<a
						href={resolve('/[perfil]', { perfil: usuario.username })}
						class="flex items-center gap-2 px-3 py-2"
					>
						{#if usuario.imageUrl}
							<img src={usuario.imageUrl} alt={usuario.username} class="h-5 w-5 rounded-full" />
						{:else}
							<User class="h-5 w-5" />
						{/if}
						<span>{usuario.username}</span>
					</a>
				</li>
			{/each}

			<Label class="ms-3 text-sm font-medium text-muted-foreground">Hashtag</Label>
			{#await hashtags}
				<li class="flex items-center gap-2 px-3 py-2 text-muted-foreground">
					<Spinner class="h-5 w-5" />
					<span>Cargando …</span>
				</li>
			{:then hashtagsResult}
				{#each hashtagsResult as hashtag}
					<li class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-accent">
						<Hash class="h-5 w-5" />
						<span>{hashtag.name}</span>
					</li>
				{/each}
			{/await}
		</ul>
	{/if}
</CommandDialog>
