import { createPinia } from "pinia";
import { PageContext } from "vike/types";

export const onCreatePageContext = (ctx: PageContext) => {
    ctx.pinia = createPinia()
}