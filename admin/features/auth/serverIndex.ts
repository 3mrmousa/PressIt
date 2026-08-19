import { server } from "../../lib/server"
import { MeResponse } from "./types"

export async function getMe(){
    return server<MeResponse>("/auth/me")
}