import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen bg-background">
        <nav className="border-b">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2">
              <Link to="/" className="text-xl sm:text-2xl font-bold truncate">
                Task Manager
              </Link>
              <div className="flex gap-2 sm:gap-4">
                <Link
                  to="/"
                  className="text-xs sm:text-sm font-medium hover:underline whitespace-nowrap"
                  activeProps={{ className: 'font-bold' }}
                >
                  Tasks
                </Link>
                <Link
                  to="/tasks/new"
                  className="text-xs sm:text-sm font-medium hover:underline whitespace-nowrap"
                  activeProps={{ className: 'font-bold' }}
                >
                  New Task
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
