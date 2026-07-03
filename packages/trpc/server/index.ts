import { publicProcedure, router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import {email, z} from "zod"

export const serverRouter = router({
  health: healthRouter,
  chaiCode : publicProcedure
  .input(z.object({email : z.string()}))
  .output(z.object({message : z.string()}))
  .query(async({input}) => {
    return {
      message : `Hello Mr ${input.email}`
    }
  })
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
