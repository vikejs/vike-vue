import { PageContext } from 'vike/types'
import { useTodoStore } from '../../stores/useTodoStore'
import type { Data } from './+data'

export const onData = (ctx: PageContext & { data?: Data }) => {
  useTodoStore(ctx.globalContext?.pinia || ctx.pinia!).initTodos(ctx.data?.todosInit ?? [])
  if (!ctx.isPrerendering) delete ctx.data
}
