import { PageContext } from 'vike/types'
import { useTodoStore } from '../../stores/useTodoStore'
import type { Data } from './+data'

export const onData = (ctx: PageContext & { data?: Data }) => {
  useTodoStore(ctx.globalContext?.pinia || ctx.pinia!).initTodos(ctx.data?.todosInit ?? [])

  // Saving KBs: we don't need pageContext.data (we use the store instead)
  // - If we don't delete pageContext.data then Vike sends pageContext.data to the client-side
  // - This optimization only works if the page is SSR'd: if the page is pre-rendered then don't do this
  if (!ctx.isPrerendering) delete ctx.data
}
