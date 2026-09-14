'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Check, Circle, Loader2, Plus, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Unable to load your tasks.')
  return response.json() as Promise<Todo[]>
}

export default function Page() {
  const { data: todos, error, isLoading, mutate } = useSWR<Todo[]>('/api/todos', fetcher)
  const [title, setTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')

  const completedCount = todos?.filter((todo) => todo.completed).length ?? 0
  const remainingCount = (todos?.length ?? 0) - completedCount

  async function addTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setFormError('Enter a task before adding it.')
      return
    }

    setIsAdding(true)
    setFormError('')
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Unable to add task.')
      }
      setTitle('')
      await mutate()
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : 'Unable to add task.')
    } finally {
      setIsAdding(false)
    }
  }

  async function toggleTodo(todo: Todo) {
    setUpdatingId(todo.id)
    try {
      const response = await fetch(`/api/todos/${todo.id}`, { method: 'PATCH' })
      if (!response.ok) throw new Error('Unable to update task.')
      const updatedTodo = (await response.json()) as Todo
      await mutate(
        (currentTodos) => currentTodos?.map((item) => (item.id === updatedTodo.id ? updatedTodo : item)),
        { revalidate: false },
      )
    } catch {
      setFormError('Unable to update task. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 text-foreground sm:px-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">Daily focus</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">My tasks</h1>
          <p className="text-muted-foreground">A clear list for the things that matter today.</p>
        </header>

        <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6" aria-labelledby="add-task-heading">
          <h2 id="add-task-heading" className="sr-only">Add a task</h2>
          <form onSubmit={addTodo} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                if (formError) setFormError('')
              }}
              placeholder="What needs to get done?"
              aria-label="Task title"
              disabled={isAdding}
              className="h-11 flex-1"
            />
            <Button type="submit" disabled={isAdding} className="h-11 sm:px-5">
              {isAdding ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Plus data-icon="inline-start" />}
              Add task
            </Button>
          </form>
          {formError && <p className="mt-3 text-sm text-destructive" role="alert">{formError}</p>}
        </section>

        <section className="flex flex-col gap-4" aria-labelledby="tasks-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="tasks-heading" className="text-lg font-semibold">Your list</h2>
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Loading tasks…' : `${remainingCount} remaining · ${completedCount} completed`}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => mutate()} disabled={isLoading} aria-label="Refresh tasks">
              <RotateCcw data-icon="inline-start" /> Refresh
            </Button>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-muted-foreground">
                <Loader2 className="animate-spin" /> Loading your tasks…
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                <p className="text-sm text-destructive">Couldn&apos;t load your tasks.</p>
                <Button variant="outline" size="sm" onClick={() => mutate()}>Try again</Button>
              </div>
            ) : todos?.length ? (
              <ul className="divide-y" aria-label="To-do items">
                {todos.map((todo) => (
                  <li key={todo.id} className="flex items-center gap-3 px-4 py-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() => toggleTodo(todo)}
                      disabled={updatingId === todo.id}
                      aria-label={todo.completed ? `Mark ${todo.title} as incomplete` : `Mark ${todo.title} as complete`}
                      className="shrink-0 rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    >
                      {todo.completed ? <Check className="size-5" aria-hidden="true" /> : <Circle className="size-5" aria-hidden="true" />}
                    </button>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className={todo.completed ? 'truncate text-muted-foreground line-through' : 'truncate'}>{todo.title}</span>
                      <time className="text-xs text-muted-foreground" dateTime={todo.createdAt}>
                        {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(todo.createdAt))}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
                <p className="font-medium">Nothing on your list yet.</p>
                <p className="text-sm text-muted-foreground">Add your first task above to get started.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
