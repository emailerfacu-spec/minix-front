<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Input } from '@/components/ui/input';
	import { FieldGroup, Field, FieldLabel, FieldDescription } from '@/components/ui/field';
	import type { LoginDto } from '../../../../types';
	import { login } from '@/hooks/login';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	let { id, showAlert = $bindable() } = $props();

	let dto: LoginDto = $state({ password: '', username: '' });

	const setAlert = () => (showAlert = true);

	let cargando = $state(false);

	const handleSubmit = async (e: SubmitEvent) => {
		cargando = true;
		await login(e, dto, setAlert);
		cargando = false;
	};
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Inicio de Sesion</Card.Title>
		<Card.Description>ingrese su usuario para logearse en la cuenta</Card.Description>
	</Card.Header>
	<Card.Content>
		<form onsubmit={handleSubmit}>
			<FieldGroup>
				<Field>
					<FieldLabel for="email-{id}">Usuario</FieldLabel>
					<Input bind:value={dto.username} type="text" placeholder="nombre de usuario" required />
				</Field>
				<Field>
					<div class="flex items-center">
						<FieldLabel for="password-{id}">Contraseña</FieldLabel>
						<a href="/password-reset" class="ml-auto inline-block text-sm underline">
							Te Olvidaste la contraseña?
						</a>
					</div>
					<Input bind:value={dto.password} type="password" required />
				</Field>
				<Field>
					<Button type="submit" class="w-full" disabled={cargando}>
						{#if cargando}
							Cargando...
							<Loader2Icon class="animate-spin" />
						{:else}
							Login
						{/if}
					</Button>

					<FieldDescription class="text-center">
						No tenes una cuenta? <a href="/register">Registrate</a>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	</Card.Content>
</Card.Root>
