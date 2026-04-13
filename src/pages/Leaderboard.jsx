import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Leaderboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const allUsers = [];
      
      usersSnapshot.forEach((doc) => {
        allUsers.push({ email: doc.id, ...doc.data() });
      });

      // Sort by totalCount DESC
      allUsers.sort((a, b) => b.totalCount - a.totalCount);
      setUsers(allUsers);

    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      alert('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 border-4 border-yellow-400 shadow-2xl scale-105';
    if (rank === 2) return 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 border-4 border-gray-400 shadow-xl scale-102';
    if (rank === 3) return 'bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 border-4 border-orange-400 shadow-xl scale-102';
    return 'bg-white border-2 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🏆</div>
          <p className="text-xl text-gray-700">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-aurudu-orange via-aurudu-yellow to-aurudu-red mb-4">
            🏆 Aurudu Leaderboard 🏆
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Hall of Fame - Festival Champions
          </p>
          <p className="text-lg text-gray-600">
            {users.length} brave participants and counting!
          </p>
        </div>

        {/* Top 3 Podium */}
        {users.length >= 3 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              🌟 Top Champions 🌟
            </h2>
            <div className="flex justify-center items-end gap-4 md:gap-8 mb-8">
              {/* Second Place */}
              <div className="flex-1 max-w-xs">
                <div className={`${getRankStyle(2)} rounded-2xl p-6 text-center transform transition-all hover:scale-105`}>
                  <div className="text-6xl mb-2">🥈</div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{users[1].name}</p>
                  <div className="text-3xl font-bold text-gray-700">{users[1].totalCount}</div>
                  <p className="text-sm text-gray-600">items</p>
                  <p className="text-lg font-semibold text-gray-700 mt-2">
                    {users[1].totalCalories.toLocaleString()} kcal
                  </p>
                </div>
              </div>

              {/* First Place */}
              <div className="flex-1 max-w-xs">
                <div className={`${getRankStyle(1)} rounded-2xl p-8 text-center transform transition-all hover:scale-105`}>
                  <div className="text-8xl mb-3">👑</div>
                  <div className="text-7xl mb-2">🥇</div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{users[0].name}</p>
                  <div className="text-5xl font-bold text-yellow-600">{users[0].totalCount}</div>
                  <p className="text-lg text-gray-700">items</p>
                  <p className="text-2xl font-bold text-gray-800 mt-3">
                    {users[0].totalCalories.toLocaleString()} kcal
                  </p>
                </div>
              </div>

              {/* Third Place */}
              <div className="flex-1 max-w-xs">
                <div className={`${getRankStyle(3)} rounded-2xl p-6 text-center transform transition-all hover:scale-105`}>
                  <div className="text-6xl mb-2">🥉</div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{users[2].name}</p>
                  <div className="text-3xl font-bold text-gray-700">{users[2].totalCount}</div>
                  <p className="text-sm text-gray-600">items</p>
                  <p className="text-lg font-semibold text-gray-700 mt-2">
                    {users[2].totalCalories.toLocaleString()} kcal
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="card">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Complete Rankings
          </h2>
          
          {users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl text-gray-500">No participants yet!</p>
              <p className="text-lg text-gray-400 mt-2">Be the first to join! 🎉</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-aurudu-yellow">
                    <th className="py-3 px-4 text-left font-bold text-gray-700">Rank</th>
                    <th className="py-3 px-4 text-left font-bold text-gray-700">Name</th>
                    <th className="py-3 px-4 text-center font-bold text-gray-700">Total Eaten</th>
                    <th className="py-3 px-4 text-center font-bold text-gray-700">Calories</th>
                    <th className="py-3 px-4 text-center font-bold text-gray-700">Foods</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const rank = index + 1;
                    return (
                      <tr 
                        key={user.email}
                        className={`border-b border-gray-200 hover:bg-aurudu-yellow/10 transition-colors cursor-pointer ${
                          rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                        }`}
                        onClick={() => navigate(`/dashboard?email=${user.email}`)}
                      >
                        <td className="py-4 px-4">
                          <span className={`text-2xl font-bold ${
                            rank === 1 ? 'text-yellow-500' :
                            rank === 2 ? 'text-gray-500' :
                            rank === 3 ? 'text-orange-600' :
                            'text-gray-600'
                          }`}>
                            {getRankEmoji(rank)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-gray-800 text-lg">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <p className="text-2xl font-bold text-aurudu-orange">
                            {user.totalCount}
                          </p>
                          <p className="text-sm text-gray-500">items</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <p className="text-xl font-bold text-aurudu-red">
                            {user.totalCalories.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">kcal</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center gap-3 text-2xl">
                            {user.kavum > 0 && <span title={`Kavum: ${user.kavum}`}>🍩</span>}
                            {user.kokis > 0 && <span title={`Kokis: ${user.kokis}`}>🌀</span>}
                            {user.kiribath > 0 && <span title={`Kiribath: ${user.kiribath}`}>🍚</span>}
                            {user.aluwa > 0 && <span title={`Aluwa: ${user.aluwa}`}>🍬</span>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            ➕ Submit Your Food Count
          </button>
          <button
            onClick={() => fetchLeaderboard()}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            🔄 Refresh Rankings
          </button>
        </div>

        {/* Fun Stats */}
        {users.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center bg-gradient-to-br from-orange-50 to-red-50">
              <p className="text-gray-600 mb-2">Total Food Items</p>
              <p className="text-4xl font-bold text-aurudu-orange">
                {users.reduce((sum, user) => sum + user.totalCount, 0)}
              </p>
            </div>
            <div className="card text-center bg-gradient-to-br from-yellow-50 to-orange-50">
              <p className="text-gray-600 mb-2">Total Calories Consumed</p>
              <p className="text-4xl font-bold text-aurudu-red">
                {users.reduce((sum, user) => sum + user.totalCalories, 0).toLocaleString()}
              </p>
            </div>
            <div className="card text-center bg-gradient-to-br from-red-50 to-pink-50">
              <p className="text-gray-600 mb-2">Average per Person</p>
              <p className="text-4xl font-bold text-aurudu-yellow">
                {Math.round(users.reduce((sum, user) => sum + user.totalCount, 0) / users.length)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
