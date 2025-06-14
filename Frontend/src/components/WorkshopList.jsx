import React from 'react';

const WorkshopList = ({ workshops, onSelectWorkshop }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    
    if (hasHalfStar) {
      stars.push('⭐');
    }

    return stars.join('') + ` (${rating})`;
  };

  if (workshops.length === 0) {
    return (
      <div className="card">
        <h3>No workshops found</h3>
        <p>No workshops found in your area. Please try refreshing your location.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Nearby Workshops ({workshops.length})</h2>
      <p>Click on a workshop to request a repair service.</p>
      
      <div className="workshop-list">
        {workshops.map((workshop) => (
          <div
            key={workshop.id}
            className="workshop-item"
            onClick={() => onSelectWorkshop(workshop)}
          >
            <div className="workshop-header">
              <div className="workshop-name">{workshop.name}</div>
              <div className="workshop-rating">
                {renderStars(workshop.rating)}
              </div>
            </div>
            
            <div className="workshop-info">
              📍 {workshop.address}
            </div>
            
            <div className="workshop-info">
              📞 {workshop.phone}
            </div>
            
            <div className="workshop-info">
              🔧 {workshop.specialties.join(', ')}
            </div>
            
            <div className="workshop-info">
              <span className="workshop-distance">
                📏 {workshop.distance} km • ⏱️ {workshop.estimatedTime}
              </span>
            </div>
            
            <div className="workshop-info">
              {workshop.isOpen ? (
                <span style={{ color: '#27ae60' }}>✅ Open Now</span>
              ) : (
                <span style={{ color: '#e74c3c' }}>❌ Closed</span>
              )}
              {' • '}
              <span style={{ color: '#7f8c8d', fontSize: '0.9em' }}>
                {workshop.responseTime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkshopList;