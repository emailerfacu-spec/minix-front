<script lang="ts">
  import * as Alert from '@/components/ui/alert';
  import LoginForm from '@/components/ui/login-form/login-form.svelte';
  import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
	import { fade } from 'svelte/transition';
  let showAlert: boolean = $state(false);

  $effect(()=>{
      resetAlert();
  });

  async function resetAlert (){
      if (showAlert == true){
          await new Promise(res => setTimeout(res, 2000));
          showAlert=false;
      }
  }

 </script>


<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-sm">
		<LoginForm bind:showAlert={showAlert} id="1" />
    {#if showAlert}
        <div class="mt-2" transition:fade>
            <Alert.Root variant="destructive">
                <AlertCircleIcon />
                <Alert.Title>No se pudo iniciar sesion</Alert.Title>
                <Alert.Description>
                    Revise su usuario o contraseña
                </Alert.Description>
            </Alert.Root>
        </div>
    {/if}
	</div>
</div>
