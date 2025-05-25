import { PageContext } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>

export const data = async (ctx: PageContext) => {
  const todosInit = await fetchTodosInit()
  return { todosInit }
}

// Pretending the list is fetched over the network
const fetchTodosInit = async () => {
  return [
    { text: 'Buy apples' },
    { text: `Update Node.js ${process.version} to latest version` },
  ]
}