import './App.css'
import { FormContainer } from './components/form-container/FormContainer'
import { LoginForm } from './components/forms/login'
import { SignUpForm } from './components/forms/signup'
import { createRootRoute, createRoute, createRouter, Outlet, redirect, RouterProvider } from '@tanstack/react-router'
import { AuthProvider } from './components/auth-provider/auth-provider'
import { userService } from './services/userService'
import { MainApp } from './components/main-screen/MainScreen'


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
  component: () => <MainApp/>,
  beforeLoad: () => {
    if (userService.isAuthenticated() == null){
      throw redirect({
        to: '/signup',
      })
    }
  }
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
  return <AuthProvider><RouterProvider router={router}/></AuthProvider>
}

export default App
