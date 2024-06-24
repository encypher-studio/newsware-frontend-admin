import path from "path"
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import './App.css'
import { Auth } from "./components/auth/page"
import Layout from './components/layout/page'
import { Toaster } from './components/ui/toaster'
import { AuthProvider, useAuthContext } from './lib/context/auth'
import { DataProvider } from './lib/context/data'
import { ServiceProvider } from './lib/context/service'
import { ThemeProvider } from './lib/context/theme-provider'
import { APP_ROUTES, RouteOption } from './lib/routes/routes'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <ServiceProvider>
          <_app />
          <Toaster />
        </ServiceProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

function _app() {
  const { user } = useAuthContext()

  if (user) {
    return (
      <DataProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="*" element={<Navigate to="/users" replace />} />
              {
                getRoutes(APP_ROUTES, "").map((route) => route)
              }
            </Routes>
          </Layout >
        </Router>
      </DataProvider>
    )
  } else {
    return <div className="py-6 px-6">
      <Auth />
    </div>
  }
}

const getRoutes = (routes: { [path: string]: RouteOption }, prefixPath: string): React.ReactNode[] => {
  const nodes = []
  for (const routePath in routes) {
    const route = routes[routePath]
    if (route.component) {
      nodes.push(<Route key={path.join(prefixPath, routePath)} path={path.join(prefixPath, routePath)} element={route.component} />)
    }

    if (route.options) {
      nodes.push(...getRoutes(route.options, path.join(prefixPath, routePath)))
    }
  }

  return nodes
}

export default App
