<script>
	import { goto } from '$app/navigation';
	import CardError from '@/components/CardError.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import DialogContent from '@/components/ui/dialog/dialog-content.svelte';
	import Dialog from '@/components/ui/dialog/dialog.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import Label from '@/components/ui/label/label.svelte';
	import { apiBase } from '@/stores/url';
	import { sesionStore } from '@/stores/usuario';
	import { slide } from 'svelte/transition';

	let { otp, email } = $props();

	let pass = $state('');
	let pass2 = $state('');
	let coinsiden = $derived(
		pass === pass2 &&
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d\W_]*$/.test(pass) &&
			pass.length > 8
	);
	let mensajeError = $state('');
</script>

{#if mensajeError}
	<Dialog open={!!mensajeError} onOpenChange={() => (mensajeError = '')}>
		<DialogContent>
			<CardError {mensajeError} />
		</DialogContent>
	</Dialog>
{/if}

<div transition:slide>
	<Card>
		<CardContent>
			<h2 class="mb-4 text-2xl font-bold">Crear una Nueva Contraseña</h2>
			<form
				onsubmit={async (e) => {
					e.preventDefault();
					const formData = new FormData();
					formData.append('otp', otp);
					formData.append('email', email);
					formData.append('newpass', pass);
					try {
						const req = await fetch(`${$apiBase}/api/password-reset/change`, {
							method: 'PATCH',
							body: formData
						});
						if (req.ok) {
							const token = await req.json();
							sesionStore.set(token);
							goto('/?from=cambio_contraseña');
							return;
						}
						const data = await req.text();
						mensajeError = data;
					} catch {
						mensajeError = 'No se pudo alcanzar el servidor';
					}
				}}
			>
				<div class="space-y-4">
					<div>
						<Label for="password" class="mb-1 block text-sm font-medium">Contraseña</Label>
						<Input
							type="password"
							id="password"
							class="w-full px-3 py-2"
							placeholder="Ingresa tu nueva contraseña"
							bind:value={pass}
						/>
						<p class="mt-2 text-sm text-gray-500">
							La contraseña debe contener al menos una mayúscula, una minúscula, un número y un
							carácter especial. Además de 8 chars de longitud.
						</p>
					</div>
					<div>
						<Label for="confirmPassword" class="mb-1 block text-sm font-medium"
							>Repetir Contraseña</Label
						>
						<Input
							type="password"
							id="confirmPassword"
							class="w-full px-3 py-2"
							placeholder="Repite tu nueva contraseña"
							bind:value={pass2}
						/>
					</div>
					<Button disabled={!coinsiden} type="submit">Establecer Contraseña</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>
