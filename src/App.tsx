import { useContext } from 'react'
import './App.css'
import { AuthContext, AuthProvider } from './lib/context/auth'
import { ThemeProvider } from './lib/context/theme-provider'
import Auth from './components/auth/page'
import Layout from './components/layout/page'
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { APP_ROUTES, RouteOption } from './lib/routes/routes'
import path from "path"
import { ServiceProvider } from './lib/context/service'
import { Toaster } from './components/ui/toaster'
import { DataProvider } from './lib/context/data'

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
  const { isLoggedIn } = useContext(AuthContext)

  if (isLoggedIn()) {
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
    return <Auth />
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
