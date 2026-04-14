import {
  Outlet,
  createRootRoute,
} from '@tanstack/react-router'
import { Footer } from '~/components/Footer'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}
