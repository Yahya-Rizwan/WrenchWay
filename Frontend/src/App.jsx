import React, { useState, useEffect } from 'react';
import LocationService from './services/LocationService';
import WorkshopService from './services/WorkshopService';
import RequestService from './services/RequestService';
import WorkshopList from './components/WorkshopList';
import RequestForm from './components/RequestForm';
import MyRequests from './components/MyRequests';
import './App.css';

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // home, request-form, my-requests
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRequests, setUserRequests] = useState([]);

  useEffect(() => {
    // Load user requests from localStorage
    const savedRequests = RequestService.getUserRequests();
    setUserRequests(savedRequests);
  }, []);

  const handleGetLocation = async () => {
    try {
      setLoading(true);
      setError('');
      
      const location = await LocationService.getCurrentLocation();
      setUserLocation(location);
      
      // Get nearby workshops
      const nearbyWorkshops = WorkshopService.getNearbyWorkshops(location);
      setWorkshops(nearbyWorkshops);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWorkshop = (workshop) => {
    setSelectedWorkshop(workshop);
    setCurrentView('request-form');
  };

  const handleSubmitRequest = (requestData) => {
    const newRequest = RequestService.createRequest({
      ...requestData,
      workshop: selectedWorkshop,
      userLocation: userLocation
    });
    
    setUserRequests(prev => [newRequest, ...prev]);
    setCurrentView('home');
    setSelectedWorkshop(null);
  };

  const handleBackHome = () => {
    setCurrentView('home');
    setSelectedWorkshop(null);
  };

  const renderHome = () => (
    <div>
      <div className="card">
        <h2>Find Nearby Workshops</h2>
        <p>Get your location to find the nearest vehicle repair workshops.</p>
        
        {!userLocation && (
          <button 
            className="button" 
            onClick={handleGetLocation}
            disabled={loading}
          >
            {loading ? 'Getting Location...' : 'Get My Location'}
          </button>
        )}

        {userLocation && (
          <div>
            <p style={{ color: '#27ae60', marginBottom: '1rem' }}>
              ✓ Location found: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </p>
            <button 
              className="button" 
              onClick={handleGetLocation}
              disabled={loading}
            >
              Refresh Location
            </button>
          </div>
        )}
      </div>

      {workshops.length > 0 && (
        <WorkshopList 
          workshops={workshops}
          onSelectWorkshop={handleSelectWorkshop}
        />
      )}

      {userRequests.length > 0 && (
        <div className="card">
          <button 
            className="button"
            onClick={() => setCurrentView('my-requests')}
          >
            View My Requests ({userRequests.length})
          </button>
        </div>
      )}
    </div>
  );

  const renderRequestForm = () => (
    <RequestForm
      workshop={selectedWorkshop}
      onSubmit={handleSubmitRequest}
      onBack={handleBackHome}
    />
  );

  const renderMyRequests = () => (
    <MyRequests
      requests={userRequests}
      onBack={handleBackHome}
    />
  );

  return (
    <div className="App">
      <header className="header">
        <h1>🔧 WrenchWay</h1>
        <p>Find nearby workshops and request vehicle repairs</p>
      </header>

      <div className="container">
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {currentView === 'home' && renderHome()}
        {currentView === 'request-form' && renderRequestForm()}
        {currentView === 'my-requests' && renderMyRequests()}
      </div>
    </div>
  );
}

export default App;