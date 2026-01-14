<script lang="ts">
	import CardError from '@/components/CardError.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import DialogContent from '@/components/ui/dialog/dialog-content.svelte';
	import Dialog from '@/components/ui/dialog/dialog.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import Spinner from '@/components/ui/spinner/spinner.svelte';
	import { checkEmail } from '@/hooks/checkEmail';
	import { apiBase } from '@/stores/url';
	import Check from '@lucide/svelte/icons/check';
	import Cross from '@lucide/svelte/icons/x';
	import { slide } from 'svelte/transition';

	let { estado = $bindable(), email = $bindable() } = $props();

	let checkeado = $state<Boolean | null>(null);
	let esEmailExistente = $state<boolean>(false);
	let mensajeError = $state('');
	let lastemail: string;

	$effect(() => {
		if (email == '' || !email.includes('@')) {
			checkeado = null;
			return;
		}
		let timeoutId: ReturnType<typeof setTimeout> | undefined;
		(async () => {
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(async () => {
				checkeado = true;
				await checkEmaill();
				checkeado = false;
			}, 1000);
		})();
	});

	async function checkEmaill() {
		try {
			if (lastemail == email) return;
			lastemail = email;
			esEmailExistente = !(await checkEmail(email));
		} catch {
			esEmailExistente = false;
		}
	}
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
			<div class="flex flex-col gap-4">
				<h2 class="flex items-center justify-between text-xl font-semibold">
					Ingresa tu correo electrónico
					{#if checkeado == null}
						<div hidden></div>
					{:else if checkeado == true}
						<Spinner></Spinner>
					{:else if esEmailExistente}
						<Check class="text-green-500" />
					{:else}
						<Cross class="text-red-500" />
					{/if}
				</h2>
				<form
					onsubmit={async (e) => {
						e.preventDefault();
						try {
							const formData = new FormData();
							formData.append('email', email);
							const req = await fetch(`${$apiBase}/api/password-reset/otp`, {
								method: 'POST',
								body: formData
							});
							if (req.ok) {
								estado = 'otp';
								return;
							}
							mensajeError = await req.text();
						} catch {
							mensajeError = 'No se pudo alcanzar el servidor';
						}
					}}
				>
					<div class="flex flex-col gap-2">
						<Input type="email" placeholder="correo@ejemplo.com" bind:value={email} />
						<Button type="submit" disabled={!esEmailExistente}>Enviar código</Button>
					</div>
				</form>
			</div>
		</CardContent>
	</Card>
</div>
