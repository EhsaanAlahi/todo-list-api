import { errorResponse, todos, type Todo } from './store'

export async function GET() {
  return Response.json(todos)
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return errorResponse('Request body must be valid JSON.', 400)
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('title' in body) ||
    typeof body.title !== 'string' ||
    body.title.trim().length === 0
  ) {
    return errorResponse('A non-empty title is required.', 400)
  }

  const todo: Todo = {
    id: crypto.randomUUID(),
    title: body.title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  }

  todos.push(todo)
  return Response.json(todo, { status: 201 })
}
