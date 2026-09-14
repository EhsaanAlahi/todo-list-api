export type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export const todos: Todo[] = []

export function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status })
}
