import { createBrowserRouter } from 'react-router-dom'
import { ProtectedLayout } from '../core/layouts/protected_layout'
import Dashboard from '../modules/dashboard/pages/dashboard'
import MainLayout from '../core/layouts/main_layout'


const router = createBrowserRouter([
  {
    path: 'login',
    element: <div />,
  },
  {
    element: (
      <ProtectedLayout>
        <MainLayout />
      </ProtectedLayout>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />
      },
    ],
  },
])

export default router
