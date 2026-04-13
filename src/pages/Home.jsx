import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const CALORIE_MAP = {
  kavum: 150,
  kokis: 80,
  kiribath: 200,
  aluwa: 120
};

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    kavum: 0,
    kokis: 0,
    kiribath: 0,
    aluwa: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email' || name === 'name' ? value : Math.max(0, parseInt(value) || 0)
    }));
  };

  const calculateTotals = (data) => {
    const totalCount = data.kavum + data.kokis + data.kiribath + data.aluwa;
    const totalCalories = 
      (data.kavum * CALORIE_MAP.kavum) +
      (data.kokis * CALORIE_MAP.kokis) +
      (data.kiribath * CALORIE_MAP.kiribath) +
      (data.aluwa * CALORIE_MAP.aluwa);
    
    return { totalCount, totalCalories };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name) {
      alert('Please fill in your name and email!');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const userRef = doc(db, 'users', formData.email);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // User exists - add to existing counts
        const existingData = userDoc.data();
        const updatedData = {
          kavum: existingData.kavum + formData.kavum,
          kokis: existingData.kokis + formData.kokis,
          kiribath: existingData.kiribath + formData.kiribath,
          aluwa: existingData.aluwa + formData.aluwa,
        };
        
        const { totalCount, totalCalories } = calculateTotals(updatedData);
        
        await updateDoc(userRef, {
          ...updatedData,
          totalCount,
          totalCalories,
          lastUpdated: serverTimestamp()
        });
      } else {
        // New user - create document
        const { totalCount, totalCalories } = calculateTotals(formData);
        
        await setDoc(userRef, {
          name: formData.name,
          email: formData.email,
          kavum: formData.kavum,
          kokis: formData.kokis,
          kiribath: formData.kiribath,
          aluwa: formData.aluwa,
          totalCount,
          totalCalories,
          lastUpdated: serverTimestamp()
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(`/dashboard?email=${formData.email}`);
      }, 1500);

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-aurudu-orange via-aurudu-yellow to-aurudu-red mb-4">
            🎊 Aurudu Food Challenge 🎊
          </h1>
          <p className="text-xl text-gray-700">
            Track your festive food journey!
          </p>
          <div className="mt-4 flex gap-3 justify-center flex-wrap text-3xl">
            <span>🍩</span>
            <span>🌀</span>
            <span>🍚</span>
            <span>🍬</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your@email.com"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be your unique ID
              </p>
            </div>

            {/* Food Inputs */}
            <div className="border-t-2 border-aurudu-yellow/30 pt-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                What did you eat? 🍽️
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kavum */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                  <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-2">
                    <span className="text-3xl">🍩</span>
                    Kavum
                    <span className="text-sm font-normal text-gray-600">(150 kcal)</span>
                  </label>
                  <input
                    type="number"
                    name="kavum"
                    value={formData.kavum}
                    onChange={handleChange}
                    min="0"
                    className="input-field"
                    placeholder="0"
                  />
                </div>

                {/* Kokis */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl">
                  <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-2">
                    <span className="text-3xl">🌀</span>
                    Kokis
                    <span className="text-sm font-normal text-gray-600">(80 kcal)</span>
                  </label>
                  <input
                    type="number"
                    name="kokis"
                    value={formData.kokis}
                    onChange={handleChange}
                    min="0"
                    className="input-field"
                    placeholder="0"
                  />
                </div>

                {/* Kiribath */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl">
                  <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-2">
                    <span className="text-3xl">🍚</span>
                    Kiribath
                    <span className="text-sm font-normal text-gray-600">(200 kcal)</span>
                  </label>
                  <input
                    type="number"
                    name="kiribath"
                    value={formData.kiribath}
                    onChange={handleChange}
                    min="0"
                    className="input-field"
                    placeholder="0"
                  />
                </div>

                {/* Aluwa */}
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
                  <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-2">
                    <span className="text-3xl">🍬</span>
                    Aluwa
                    <span className="text-sm font-normal text-gray-600">(120 kcal)</span>
                  </label>
                  <input
                    type="number"
                    name="aluwa"
                    value={formData.aluwa}
                    onChange={handleChange}
                    min="0"
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : success ? (
                  <span className="flex items-center gap-2">
                    ✅ Success! Redirecting...
                  </span>
                ) : (
                  'Submit My Food Count 🎉'
                )}
              </button>
            </div>

            {/* Navigation Links */}
            <div className="text-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/leaderboard')}
                className="text-aurudu-orange hover:text-aurudu-red font-semibold transition-colors"
              >
                🏆 View Leaderboard
              </button>
            </div>
          </form>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mt-6 bg-green-100 border-2 border-green-500 text-green-800 px-6 py-4 rounded-xl text-center animate-bounce">
            <p className="text-xl font-bold">🎊 Submission Successful!</p>
            <p>Taking you to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
