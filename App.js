import React, { useState, useEffect } from 'react'; // useEffect add kiya
import axios from 'axios';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [places, setPlaces] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showDeleteHistoryModal, setShowDeleteHistoryModal] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Naya state location ko save rakhne ke liye
  const [coords, setCoords] = useState(null);

  // --- LOCATION LOGIC ---
  // Jaise hi user login ho, location maango
  useEffect(() => {
    if (user && !coords) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          console.log("Location enabled! 📍");
        },
        () => {
          alert("Please enable location to see nearby vibes! 🧭");
        }
      );
    }
  }, [user, coords]);

  // --- Auth ---
  const handleAuth = async (e) => {
    e.preventDefault();
    const API_URL = `http://127.0.0.1:5000/api/auth/${isLogin ? 'login' : 'register'}`;
    try {
      const res = await axios.post(API_URL, formData);
      if (isLogin) {
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
      } else {
        alert("✨ Account Created! Please Sign In.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Server error");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCoords(null); // Location reset
    setPlaces([]);
    setShowHistory(false);
    setShowLogoutModal(false);
  };

  // --- Places ---
  const fetchPlaces = async (mood) => {
    // Agar location pehle se mil chuki hai toh seedha API call
    let lat = coords?.lat;
    let lon = coords?.lon;

    // Agar location abhi tak nahi mili toh dobara koshish
    if (!lat || !lon) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
        callPlacesAPI(latitude, longitude, mood);
      }, () => alert("Location permission required!"));
    } else {
      callPlacesAPI(lat, lon, mood);
    }
  };

  const callPlacesAPI = async (lat, lon, mood) => {
    setLoading(true);
    setShowHistory(false);
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/api/places/recommendations`,
        { params: { lat: lat, lon: lon, mood, userId: user.id } }
      );
      setPlaces(res.data.features);
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/places/history/${user.id}`);
      setHistory(res.data);
      setShowHistory(true);
      setPlaces([]);
    } catch {
      alert("📜 History error");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIN ---
  if (!user) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>Nearby 📍</h2>
          <p>Explore the vibe around you</p>

          <form onSubmit={handleAuth}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                required
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            )}
            <input
              type="email"
              placeholder="abc123@gmail.com"
              required
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="..."
              required
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />

            <button type="submit" className="main-btn">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "New Explorer? Create Account" : "Back to Login"}
          </p>
        </div>
      </div>
    );
  }

  // --- DASHBOARD (Baqi pura code bilkul waisa hi hai) ---
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">Nearby📍</div>
        <div className="nav-actions">
          <button className="mood-pill" 
        style={{ background: '#e17055', marginLeft: '10px' }}
          onClick={getHistory}>📜 Show History </button>

          <button
            className="mood-pill"
            style={{ background: '#e17055', marginLeft: '10px' }}
            onClick={() => setShowDeleteHistoryModal(true)}
          >
            🗑 Delete History
          </button>

          <button
            className="mood-pill"
            style={{ background: '#e17055', marginLeft: '10px' }}
            onClick={() => setShowDeleteAccountModal(true)}
          >
            Delete Account
          </button>

          <button
            className="mood-pill"
            style={{ background: '#e17055', marginLeft: '10px' }}
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </nav>

      <header className="hero">
        <h1 className="floating-user">
          Hello, <span>{user.name}</span>! 👋
        </h1>
        <p>Where does your heart want to go today?</p>
        {/* Status indicator (Optional) */}
        <p style={{fontSize: '0.8rem', color: coords ? '#55efc4' : '#fab1a0'}}>
          {coords ? "● Location Enabled" : "○ Waiting for Location..."}
        </p>

        <div className="mood-grid">
          <button className="mood-pill" onClick={() => fetchPlaces('work')}>☕ Work</button>
          <button className="mood-pill" onClick={() => fetchPlaces('relax')}>🍃 Chill</button>
          <button className="mood-pill" onClick={() => fetchPlaces('date')}>💖 Vibe</button>
        </div>
      </header>

      <main>
        {loading && <div className="loading-center">✨ Mapping the world for you...</div>}

        {showHistory && (
          <div className="history-wrapper">
            <div className="auth-card history-card">
              <h3>Your Adventure Log 📜</h3>
              {history.map((h, i) => (
                <div key={i} className="history-row enhanced">
                  <div className="history-emoji">
                    {h.mood === 'work' && '☕'}
                    {h.mood === 'relax' && '🍃'}
                    {h.mood === 'date' && '💖'}
                  </div>
                  <div className="history-text">
                    <p>You were in a <b>{h.mood}</b> mood</p>
                    <small>{new Date(h.createdAt).toDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="places-grid">
          {places.map((place, index) => (
            <div
              key={index}
              className="place-card"
              onClick={() => setSelectedPlace(place.properties)}
            >
              <div>🧭</div>
              <h3>{place.properties.name || "Hidden Gem"}</h3>
              <p>{place.properties.city}</p>
            </div>
          ))}
        </div>
      </main>

      {/* PLACE MODAL */}
      {selectedPlace && (
        <div className="modal-overlay" onClick={() => setSelectedPlace(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Spot Intel 🔍</h2>
            <p><b>{selectedPlace.name}</b></p>
            <p>{selectedPlace.formatted}</p>
            <a
              className="directions-btn"
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lon}`}
              target="_blank"
              rel="noreferrer"
            >
              🚗 Take Me There
            </a>
          </div>
        </div>
      )}

      {/* DELETE HISTORY MODAL */}
      {showDeleteHistoryModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteHistoryModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#e17055' }}>Delete all history? 🗑</h2>
            <p style={{ color: '#636e72' }}>
              This action cannot be undone. Are you sure you want to erase your adventure log?
            </p>

            <div className="delete-actions">
              <button
                className="delete-confirm"
                onClick={async () => {
                  try {
                    await axios.delete(`http://127.0.0.1:5000/api/places/history/${user.id}`);
                    setHistory([]);
                    setShowHistory(false);
                    setShowDeleteHistoryModal(false);
                    alert("📜 History deleted successfully!");
                  } catch {
                    alert("⚠️ Failed to delete history");
                  }
                }}
              >
                Yes, Delete
              </button>
              <button
                className="delete-cancel"
                onClick={() => setShowDeleteHistoryModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT MODAL */}
      {showDeleteAccountModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteAccountModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#d63031' }}>Delete your account? 💀</h2>
            <p style={{ color: '#636e72' }}>
              This will permanently remove your account and all data. Are you sure?
            </p>

            <div className="delete-actions">
              <button
                className="delete-confirm"
                onClick={async () => {
                  try {
                    await axios.delete(`http://127.0.0.1:5000/api/auth/${user.id}`);
                    handleLogout();
                    setShowDeleteAccountModal(false);
                    alert("💀 Account deleted successfully!");
                  } catch {
                    alert("⚠️ Failed to delete account");
                  }
                }}
              >
                Yes, Delete
              </button>
              <button
                className="delete-cancel"
                onClick={() => setShowDeleteAccountModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#ff7675' }}>Leaving so soon? 🥺</h2>
            <p style={{ color: '#636e72' }}>
              Your nearby adventures will miss you.
            </p>

            <div className="logout-actions">
              <button className="logout-confirm" onClick={handleLogout}>
                🚪 Yes, Logout
              </button>
              <button
                className="logout-cancel"
                onClick={() => setShowLogoutModal(false)}
              > 
                Stay ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION POPUP */}
      {notification && (
        <div className="modal-overlay" style={{ background: 'transparent', pointerEvents: 'none' }}>
          <div className="modal-content" style={{
              maxWidth: '300px',
              padding: '20px',
              background: notification.type === 'success' ? '#00b894' : '#d63031',
              color: 'white',
              borderRadius: '20px',
              pointerEvents: 'auto'
            }}>
            {notification.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;