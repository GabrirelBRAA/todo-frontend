import './App.css'
import { FormContainer } from './components/form-container/FormContainer'
import { LoginForm } from './components/forms/login'
import { SignUpForm } from './components/forms/signup'
import { createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router'

const rootRoute = createRootRoute({
  component: () => <Outlet/>
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$',
  component: () => <FormContainer form={<LoginForm/>} formName='Login'/>
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: () => <FormContainer form={<SignUpForm/>} formName='Sign up'/>
});

const dashboardPage = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => <>User logged in</>
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute, dashboardPage]);

const router = createRouter({routeTree})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  
  //implement to check if user is logged in here
  //if he is logged in redirect him to dashboard, else redirect him to login page
  return <RouterProvider router={router}/>
}

export default App
