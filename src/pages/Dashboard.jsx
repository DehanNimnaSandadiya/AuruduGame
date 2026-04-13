import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const [userData, setUserData] = useState(null);
  const [rank, setRank] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [email]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user data
      const userRef = doc(db, 'users', email);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        alert('User not found!');
        navigate('/');
        return;
      }

      const data = userDoc.data();
      setUserData(data);

      // Fetch all users for ranking
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const allUsers = [];
      
      usersSnapshot.forEach((doc) => {
        allUsers.push({ email: doc.id, ...doc.data() });
      });

      // Sort by totalCount DESC
      allUsers.sort((a, b) => b.totalCount - a.totalCount);
      
      // Find user rank
      const userRank = allUsers.findIndex(u => u.email === email) + 1;
      setRank(userRank);
      setTotalUsers(allUsers.length);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getFunMessage = () => {
    if (!userData || !rank) return '';

    const { kavum, kokis, kiribath, aluwa, totalCount, totalCalories } = userData;

    // Top performer messages
    if (rank === 1) return '👑 You are the AURUDU CHAMPION! 👑';
    if (rank <= 3) return '🥇 Top 3 eater! Amazing!';
    if (rank <= 10) return '🔥 Top 10 performer! You\'re crushing it!';

    // Calorie-based messages
    if (totalCalories > 3000) return '💀 Gym needed soon! But worth it! 😋';
    if (totalCalories > 2000) return '🔥 That\'s a LOT of festive energy!';

    // Food-specific messages
    if (kavum > 10) return '🍩 You are a Kavum Beast!';
    if (kokis > 15) return '🌀 Kokis Champion detected!';
    if (kiribath > 10) return '🍚 Kiribath King/Queen!';
    if (aluwa > 10) return '🍬 Sweet tooth champion!';

    // General messages
    if (totalCount > 30) return '🎉 Festival mode: ACTIVATED!';
    if (totalCount > 20) return '😋 Living your best Aurudu life!';
    if (totalCount > 10) return '🎊 Good start! Keep going!';
    
    return '🌟 Great job participating!';
  };

  const getRankColor = () => {
    if (rank === 1) return 'text-yellow-500';
    if (rank <= 3) return 'text-orange-500';
    if (rank <= 10) return 'text-red-500';
    return 'text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🌀</div>
          <p className="text-xl text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-aurudu-orange to-aurudu-red mb-2">
            Your Aurudu Dashboard
          </h1>
          <p className="text-xl text-gray-700">Welcome back, {userData.name}! 🎊</p>
        </div>

        {/* Fun Message Banner */}
        <div className="card bg-gradient-to-r from-aurudu-orange to-aurudu-red text-white mb-6">
          <p className="text-2xl md:text-3xl font-bold text-center">
            {getFunMessage()}
          </p>
        </div>

        {/* Rank Card */}
        <div className="card mb-6 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-2">Your Rank</p>
            <p className={`text-6xl font-bold ${getRankColor()}`}>
              #{rank}
            </p>
            <p className="text-gray-600 mt-2">
              out of {totalUsers} participants
            </p>
            {rank <= 3 && (
              <div className="text-6xl mt-4">
                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Total Items */}
          <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="text-center">
              <p className="text-gray-600 text-lg mb-2">Total Items Eaten</p>
              <p className="text-5xl font-bold text-purple-600">{userData.totalCount}</p>
              <p className="text-3xl mt-2">🍽️</p>
            </div>
          </div>

          {/* Total Calories */}
          <div className="card bg-gradient-to-br from-red-50 to-orange-50">
            <div className="text-center">
              <p className="text-gray-600 text-lg mb-2">Total Calories</p>
              <p className="text-5xl font-bold text-red-600">
                {userData.totalCalories.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">kcal</p>
              <p className="text-3xl mt-2">🔥</p>
            </div>
          </div>
        </div>

        {/* Food Breakdown */}
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Your Food Breakdown 📊
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Kavum */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-xl text-center">
              <div className="text-4xl mb-2">🍩</div>
              <p className="font-semibold text-gray-800">Kavum</p>
              <p className="text-3xl font-bold text-orange-600">{userData.kavum}</p>
              <p className="text-sm text-gray-600">{userData.kavum * 150} kcal</p>
            </div>

            {/* Kokis */}
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-xl text-center">
              <div className="text-4xl mb-2">🌀</div>
              <p className="font-semibold text-gray-800">Kokis</p>
              <p className="text-3xl font-bold text-yellow-600">{userData.kokis}</p>
              <p className="text-sm text-gray-600">{userData.kokis * 80} kcal</p>
            </div>

            {/* Kiribath */}
            <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-xl text-center">
              <div className="text-4xl mb-2">🍚</div>
              <p className="font-semibold text-gray-800">Kiribath</p>
              <p className="text-3xl font-bold text-red-600">{userData.kiribath}</p>
              <p className="text-sm text-gray-600">{userData.kiribath * 200} kcal</p>
            </div>

            {/* Aluwa */}
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-4 rounded-xl text-center">
              <div className="text-4xl mb-2">🍬</div>
              <p className="font-semibold text-gray-800">Aluwa</p>
              <p className="text-3xl font-bold text-pink-600">{userData.aluwa}</p>
              <p className="text-sm text-gray-600">{userData.aluwa * 120} kcal</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            ➕ Add More Food
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            🏆 View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
