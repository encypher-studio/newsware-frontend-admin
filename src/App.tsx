import { useMemo } from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import './App.css'
import { Toaster } from './components/ui/toaster'
import { AuthProvider } from './lib/context/auth'
import { DataProvider } from './lib/context/data'
import { ServiceProvider } from './lib/context/service'
import { ThemeProvider } from './lib/context/theme-provider'
import { appRoutes } from "./lib/routes/routes"

function App() {
  const router = useMemo(() => createBrowserRouter(appRoutes), [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <ServiceProvider>
          <DataProvider>
            <RouterProvider router={router} />
          </DataProvider>
          <Toaster />
        </ServiceProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
