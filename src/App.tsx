import { BrowserRouter } from 'react-router-dom'
import AppRouter from './presentation/router/AppRouter'
import ScrollToTop from './presentation/components/ScrollToTop'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRouter />
    </BrowserRouter>
  )
}
