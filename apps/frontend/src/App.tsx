import './App.css'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import { TodoForm } from '@/features/todos/components/TodoForm';
import { TodoList } from '@/features/todos/components';
function App() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">


      <Header />

      {/* ── Main Content ───────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/*
          Mobile/Tablet  → stacked (single column)
          Desktop (lg+)  → two-column: sticky form sidebar + scrollable list
        */}
        <div className="lg:grid lg:grid-cols-[420px_1fr] lg:gap-8 xl:gap-12 lg:items-start">
          {/* LEFT — Add form (sticky on desktop) */}
          <div className="lg:sticky lg:top-[88px]">
            <TodoForm />
          </div>

          {/* RIGHT — Todo list */}
          <div>
            <TodoList />
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <Footer />
    </div>
  )
}

export default App
