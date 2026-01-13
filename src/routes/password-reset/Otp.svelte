<script>
	import Button from '@/components/ui/button/button.svelte';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import InputOtpGroup from '@/components/ui/input-otp/input-otp-group.svelte';
	import InputOtpSlot from '@/components/ui/input-otp/input-otp-slot.svelte';
	import InputOtp from '@/components/ui/input-otp/input-otp.svelte';
	import { slide } from 'svelte/transition';

	let { estado = $bindable() } = $props();
</script>

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
						<InputOtp maxlength={6}>
							{#snippet children({ cells })}
								<InputOtpGroup>
									{#each cells as cell, i}
										<InputOtpSlot class="p-3!" {cell}></InputOtpSlot>
									{/each}
								</InputOtpGroup>
							{/snippet}
						</InputOtp>
					</div>

					<div class="flex justify-between">
						<Button onclick={() => (estado = 'nuevapass')}>Verificar</Button>

						<Button variant="link" onclick={() => console.log('Reenviar código')}>
							Reenviar código de verificación
						</Button>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
</div>
