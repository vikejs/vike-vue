import { PageContext } from "vike/types";

export const onAfterRenderHtml = (ctx: PageContext) => {
  ctx._piniaInitialState = ctx.pinia?.state.value
}