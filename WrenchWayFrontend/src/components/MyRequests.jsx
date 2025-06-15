import React, { useState, useEffect } from 'react';
import RequestService from '../services/RequestService';

const MyRequests = ({ requests, onBack }) => {
  const [localRequests, setLocalRequests] = useState(requests);

  useEffect(() => {
    setLocalRequests(requests);

    // Listen for request status updates
    const handleStatusUpdate = (event) => {
      const { requestId, status, response } = event.detail;
      setLocalRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status, response }
            : request
        )
      );
    };

    window.addEventListener('requestStatusUpdate', handleStatusUpdate);

    return () => {
      window.removeEventListener('requestStatusUpdate', handleStatusUpdate);
    };
  }, [requests]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: 'Pending', icon: '⏳' },
      accepted: { class: 'status-accepted', text: 'Accepted', icon: '✅' },
      rejected: { class: 'status-rejected', text: 'Rejected', icon: '❌' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      low: '#27ae60',
      medium: '#f39c12',
      high: '#e67e22',
      emergency: '#e74c3c'
    };
    return colors[urgency] || colors.medium;
  };

  const handleCallWorkshop = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  if (localRequests.length === 0) {
    return (
      <div>
        <div className="back-button">
          <button className="button" onClick={onBack}>
            ← Back to Home
          </button>
        </div>
        
        <div className="card">
          <h2>My Requests</h2>
          <p>You haven't made any repair requests yet.</p>
          <button className="button" onClick={onBack}>
            Find Workshops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="back-button">
        <button className="button" onClick={onBack}>
          ← Back to Home
        </button>
      </div>

      <div className="card">
        <h2>My Requests ({localRequests.length})</h2>
        <p>Track the status of your repair requests.</p>
      </div>

      <div className="my-requests">
        {localRequests.map((request) => (
          <div key={request.id} className="request-item">
            <div className="request-header">
              <div className="request-workshop">{request.workshopName}</div>
              <div>{getStatusBadge(request.status)}</div>
            </div>
            
            <div className="request-date">
              Requested on {formatDate(request.createdAt)}
            </div>
            
            <div style={{ margin: '1rem 0' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Vehicle:</strong> {request.vehicleType}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Urgency:</strong> 
                <span style={{ 
                  color: getUrgencyColor(request.urgency),
                  fontWeight: 'bold',
                  marginLeft: '0.5rem',
                  textTransform: 'capitalize'
                }}>
                  {request.urgency}
                </span>
              </div>
            </div>
            
            <div className="request-description">
              <strong>Problem:</strong> {request.problemDescription}
            </div>

            {request.response && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: request.status === 'accepted' ? '#f0f9f0' : '#fdf2f2',
                borderRadius: '4px',
                border: `1px solid ${request.status === 'accepted' ? '#27ae60' : '#e74c3c'}`
              }}>
                <strong>Workshop Response:</strong>
                <div style={{ marginTop: '0.5rem' }}>
                  {request.response.message}
                </div>
              </div>
            )}

            <div style={{ 
              marginTop: '1rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                📞 {request.workshopPhone}
              </div>
              
              {request.status === 'accepted' && (
                <button
                  className="button success"
                  onClick={() => handleCallWorkshop(request.workshopPhone)}
                  style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                >
                  📞 Call Workshop
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h3>Need to make another request?</h3>
        <button className="button" onClick={onBack}>
          Find More Workshops
        </button>
      </div>
    </div>
  );
};

export default MyRequests;