import type {CreateExpressContextOptions} from "@trpc/server/adapters/express"

export interface TRPCContext {

}

export async function createContext({
     req , res
} : CreateExpressContextOptions) : Promise<TRPCContext> {
    return {
        
    }
}
export type Context = Awaited<ReturnType<typeof createContext>>;
