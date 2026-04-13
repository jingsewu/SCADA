import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ConveyorScene } from '~/components/ConveyorScene'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-0 w-full min-w-0 flex-1 items-center justify-center bg-[rgba(12,26,28,0.6)] text-sm text-[var(--sea-ink-soft)]"
          aria-hidden
        >
          正在加载 3D 场景…
        </div>
      }
    >
      <ConveyorScene />
    </Suspense>
  )
}
