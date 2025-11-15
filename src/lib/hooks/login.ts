import { apiBase } from "@/stores/url";
import type { LoginDto } from "../../types";
import { sesionStore } from "@/stores/usuario";
import { goto } from "$app/navigation";

export async function login(e:FormDataEvent,dto: LoginDto, callbackfn:()=>void){
    e.preventDefault();
    if (dto.password == "" || dto.username == "") return;
    try {

        const { subscribe } = apiBase;
        let baseUrl: string = '';

        subscribe((value) => {
            baseUrl = value;
        })();
        const req = await fetch(baseUrl + "/api/auth/login", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(dto)
        });
        if (req.ok) {
            const token = await req.json();
            sesionStore.set(token);
            goto("/")
        } else {
            callbackfn();
        }

    } catch {
        callbackfn();
        console.error("fallo al intentar alcanzar el servidor")

    }
}
