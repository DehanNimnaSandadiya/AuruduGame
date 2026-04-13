import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 bg-aurudu-pattern flex flex-col">
        {/* Header with Logo */}
        <header className="bg-gradient-to-r from-orange-400 via-yellow-300 to-red-400 shadow-lg py-6 px-4 border-b-4 border-orange-600">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 md:gap-6">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <img src="/Logo.png" alt="Aurudu Logo" className="h-24 md:h-32 w-auto drop-shadow-lg" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-2" style={{textShadow: '3px 3px 6px rgba(139, 69, 19, 0.8)'}}>
                🎊 Aurudu Leaderboard 🎊
              </h1>
              <p className="text-white text-lg md:text-xl font-bold drop-shadow-md">
                Festival Food Challenge Champion!
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>

        {/* Footer with Credits */}
        <footer className="bg-white border-t border-gray-200 py-4 px-4 mt-8">
          <div className="max-w-5xl mx-auto text-center text-gray-600 text-sm">
            <p>Built by <span className="font-semibold text-gray-800">Dehan Nimna Sandadiya</span></p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
