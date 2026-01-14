<script>
	import CardError from '@/components/CardError.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import DialogContent from '@/components/ui/dialog/dialog-content.svelte';
	import Dialog from '@/components/ui/dialog/dialog.svelte';
	import InputOtpGroup from '@/components/ui/input-otp/input-otp-group.svelte';
	import InputOtpSlot from '@/components/ui/input-otp/input-otp-slot.svelte';
	import InputOtp from '@/components/ui/input-otp/input-otp.svelte';
	import { apiBase } from '@/stores/url';
	import { slide } from 'svelte/transition';

	let { estado = $bindable(), email, otp = $bindable() } = $props();

	let checkeado = $state(false);
	let mensajeError = $state('');

	$effect(() => {
		if (otp && otp.length === 6) {
			checkeado = true;
		} else {
			checkeado = false;
		}
	});
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
			<div class="space-y-6 py-4">
				<h3 class="text-xl font-semibold">Verificación de correo</h3>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Hemos enviado un código de verificación a tu correo electrónico.
				</p>

				<div class="space-y-4">
					<div class="flex justify-center">
						<InputOtp maxlength={6} bind:value={otp}>
							{#snippet children({ cells })}
								<InputOtpGroup>
									{#each cells as cell}
										<InputOtpSlot class="p-3!" {cell}></InputOtpSlot>
									{/each}
								</InputOtpGroup>
							{/snippet}
						</InputOtp>
					</div>

					<div class="flex justify-between">
						<Button
							disabled={!checkeado}
							onclick={async () => {
								try {
									const formData = new FormData();
									formData.append('otp', otp);
									formData.append('email', email);
									let req = await fetch(`${$apiBase}/api/password-reset/otp/check`, {
										method: 'POST',
										body: formData
									});
									if (req.ok) {
										estado = 'nuevapass';
										return;
									} else {
										mensajeError = await req.text();
									}
								} catch {
									mensajeError = 'No se pudo alcanzar el servidor';
								}
							}}
						>
							Verificar
						</Button>

						<Button variant="link" onclick={() => console.log('Reenviar código')}>
							Reenviar código de verificación
						</Button>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
</div>
