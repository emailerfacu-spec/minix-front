<script lang="ts">
	import UserPen from '@lucide/svelte/icons/user-pen';
	import Button, { buttonVariants } from './ui/button/button.svelte';
	import { Dialog } from './ui/dialog';
	import DialogTrigger from './ui/dialog/dialog-trigger.svelte';
	import DialogContent from './ui/dialog/dialog-content.svelte';
	import DialogHeader from './ui/dialog/dialog-header.svelte';
	import DialogTitle from './ui/dialog/dialog-title.svelte';
	import type { UserResponseDto } from '../../types';
	import Input from './ui/input/input.svelte';
	import Field from './ui/field/field.svelte';
	import FieldLabel from './ui/field/field-label.svelte';
	import Textarea from './ui/textarea/textarea.svelte';
	import FieldGroup from './ui/field/field-group.svelte';
	import { updateUsuario } from '@/hooks/updateUsuario';
	import DialogFooter from './ui/dialog/dialog-footer.svelte';
	import Spinner from './ui/spinner/spinner.svelte';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';

	let { data = $bindable() } = $props();

	let usuario: UserResponseDto = $state({
		id: data.id,
		username: data.username,
		displayName: data.displayName,
		bio: data.bio,
		profileImageUrl: data.profileImageUrl
	});

	let cargando = $state(false);
	let open = $state(false);

	async function onsubmit(e: SubmitEvent | null) {
		if (e != null) e.preventDefault();
		cargando = true;
		await updateUsuario({
			id: usuario.id,
			profileImage: false,
			bio: usuario.bio,
			displayName: usuario.displayName,
			profileImageUrl: usuario.profileImageUrl
		});
		cargando = false;
		open = false;
		// invalidateAll();
		await invalidate(page.url);
		await invalidate('perfil:general');
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.ctrlKey && e.key === 'Enter') {
			onsubmit(null);
		}
	}
</script>

<Dialog bind:open>
	<DialogTrigger>
		<div class="fixed right-8 bottom-8">
			<Button variant="default" size="icon-lg">
				<UserPen />
			</Button>
		</div>
	</DialogTrigger>
	<form {onsubmit}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>
					<h1 class="text-2xl font-bold">Modificar Usuario</h1>
				</DialogTitle>
			</DialogHeader>
			<FieldGroup {onkeydown}>
				<Field>
					<FieldLabel>Nombre</FieldLabel>
					<Input id="displayName" type="text" bind:value={usuario.displayName} required />
				</Field>
				<Field>
					<FieldLabel>bio</FieldLabel>
					<Textarea id="bio" bind:value={usuario.bio}></Textarea>
				</Field>
				<Field>
					<FieldLabel>Email</FieldLabel>
					<Input id="email" type="email" bind:value={usuario.email} />
				</Field>
			</FieldGroup>
			<DialogFooter>
				<Button type="submit">
					{#if cargando}
						<Spinner />
					{:else}
						Modificar
					{/if}
				</Button>
			</DialogFooter>
		</DialogContent>
	</form>
</Dialog>
