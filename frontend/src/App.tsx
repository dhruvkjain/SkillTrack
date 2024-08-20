import Dashboard from './pages/Dashboard';
import { ThemeProvider } from "./components/theme-provider.tsx";
import './App.css'

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className='max-h-[100lvh]'>
        <Dashboard />
      </div>
    </ThemeProvider>
  )
}

export default App
