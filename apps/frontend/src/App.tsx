import './App.css'
import Header from './components/shared/Header'
import Footer from './components/shared/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Main content goes here */}
      </main>

      <Footer />
    </div>
  )
}

export default App
