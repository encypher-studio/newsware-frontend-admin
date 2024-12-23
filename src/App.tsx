import { AppRouter, environment } from "@newsware/ui"
import "./App.css"
import { appRoutes } from "./lib/routes/routes"

function App() {
  const environmentValue = environment(import.meta.env.VITE_ENV)

  return (
    <AppRouter
      routes={appRoutes(environmentValue)}
      environment={environmentValue}
    />
  )
}

export default App
