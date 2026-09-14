import { todos, errorResponse } from '../store'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const todo = todos.find((item) => item.id === id)

  if (!todo) return errorResponse('Todo not found.', 404)

  let body: unknown = {}
  try {
    body = await request.json()
  } catch {
    // An empty body toggles the current completion state.
  }

  if (typeof body === 'object' && body !== null && 'completed' in body && typeof body.completed !== 'boolean') {
    return errorResponse('The completed field must be a boolean.', 400)
  }

  const completed =
    typeof body === 'object' && body !== null && 'completed' in body && typeof body.completed === 'boolean'
      ? body.completed
      : !todo.completed

  todo.completed = completed
  return Response.json(todo)
}
