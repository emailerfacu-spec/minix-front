import { apiBase } from "@/stores/url";
import { goto } from "$app/navigation";
import type { RegisterDto } from "../../types";

export async function register(e: SubmitEvent, dto: RegisterDto, callbackfn:()=>void){
    e.preventDefault();
    if (dto.password == "" || dto.username == "" ||
        !dto.email?.includes("@") || dto.displayName=="") return;
    try {

        const { subscribe } = apiBase;
        let baseUrl: string = '';

        subscribe((value) => {
            baseUrl = value;
        })();
        const req = await fetch(baseUrl + "/api/auth/register", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });
        if (req.ok) {
            const data= await req.json();
            goto("/login?msg="+data.message);
        } else {
            callbackfn();
        }

    } catch {
        callbackfn();
        console.error("fallo al intentar alcanzar el servidor")

    }
}
