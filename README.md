# 🎊 Aurudu Food Leaderboard

A fun, festive web application to track Sri Lankan Sinhala & Tamil New Year (Aurudu) food consumption with a competitive leaderboard!

## 🌟 Features

- **Submit Food Counts**: Track Kavum, Kokis, Kiribath, and Aluwa consumption
- **Personal Dashboard**: View your stats, rank, and fun achievement messages
- **Live Leaderboard**: Compete with others and see who's the Aurudu Champion
- **Calorie Tracking**: Automatic calorie calculation for all foods
- **Beautiful UI**: Festive design with warm colors and cultural themes
- **Mobile Responsive**: Works perfectly on all devices

## 🧱 Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Deployment**: Ready for Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Clone or extract this project

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy!

## 🔥 Firebase Setup

The Firebase configuration is already included in `src/firebase.js`. The Firestore database uses:

- **Collection**: `users`
- **Document ID**: User email (unique identifier)
- **Fields**:
  - name (string)
  - email (string)
  - kavum (number)
  - kokis (number)
  - kiribath (number)
  - aluwa (number)
  - totalCount (number)
  - totalCalories (number)
  - lastUpdated (timestamp)

### Firestore Rules (Recommended)

For production, set up these Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

**Note**: These rules allow anyone to read/write. For production, consider adding authentication.

## 🎮 How to Use

1. **Submit Page** (`/`):
   - Enter your name and email
   - Input how many of each food you ate
   - Submit to save your data
   - Automatically redirects to your dashboard

2. **Dashboard** (`/dashboard?email=YOUR_EMAIL`):
   - View your total count and calories
   - See your rank among all participants
   - Get fun achievement messages
   - View breakdown by food type

3. **Leaderboard** (`/leaderboard`):
   - See all participants ranked by total count
   - Top 3 highlighted with medals
   - Click any user to view their dashboard
   - Live statistics at the bottom

## 🍽️ Food Calorie Values

- 🍩 Kavum: 150 kcal
- 🌀 Kokis: 80 kcal
- 🍚 Kiribath: 200 kcal
- 🍬 Aluwa: 120 kcal

## 🎨 Color Scheme

- **Primary**: Orange (#FF6B35)
- **Secondary**: Yellow (#F7B801)
- **Accent**: Red (#E63946)
- **Gold**: (#FFD700)

## 📱 Responsive Design

The app is fully responsive and works beautifully on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktops
- 🖥️ Large screens

## 🚀 Deployment to Vercel

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com)

3. Click "New Project"

4. Import your GitHub repository

5. Vercel will auto-detect Vite and configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. Deploy! 🎉

## 📂 Project Structure

```
aurudu-leaderboard/
├── src/
│   ├── pages/
│   │   ├── Home.jsx          # Submit form page
│   │   ├── Dashboard.jsx     # User dashboard
│   │   └── Leaderboard.jsx   # Rankings page
│   ├── firebase.js           # Firebase config
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎯 Key Features Explained

### Unique User Logic
- Email is used as the document ID in Firestore
- If user exists: adds new counts to existing totals
- If new user: creates new document with submitted data

### Automatic Calculations
- Total count = sum of all food items
- Total calories = weighted sum using calorie map
- Both update automatically on each submission

### Fun Messages
The dashboard shows contextual messages based on:
- Your rank (Champion, Top 3, Top 10)
- Total calories consumed
- Specific food dominance
- Overall participation level

## 🐛 Troubleshooting

**Build fails?**
- Make sure Node.js 16+ is installed
- Delete `node_modules` and run `npm install` again

**Firebase errors?**
- Check your internet connection
- Verify Firestore rules allow read/write
- Make sure the Firebase config is correct

**Styles not loading?**
- Run `npm install` to ensure Tailwind is installed
- Check that `index.css` is imported in `main.jsx`

## 🎉 Contributing

Feel free to fork this project and make it your own! Some ideas:
- Add authentication
- Include more food types
- Add photo uploads
- Create teams/groups
- Add achievement badges

## 📝 License

This project is open source and available for personal and commercial use.

## 🙏 Credits

Created for celebrating Sri Lankan Sinhala & Tamil New Year (Aurudu) 🎊

Enjoy your festive food tracking! 🍩🌀🍚🍬
