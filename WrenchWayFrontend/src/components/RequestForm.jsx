import React, { useState } from 'react';

const RequestForm = ({ workshop, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    vehicleType: '',
    problemDescription: '',
    urgency: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.vehicleType.trim() || !formData.problemDescription.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="back-button">
        <button className="button" onClick={onBack}>
          ← Back to Workshops
        </button>
      </div>

      <div className="request-form">
        <h2>Request Repair Service</h2>
        
        <div className="card" style={{ marginBottom: '1rem', backgroundColor: '#f8f9fa' }}>
          <h3>Selected Workshop</h3>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>{workshop.name}</strong>
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            📍 {workshop.address}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            📞 {workshop.phone}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            📏 {workshop.distance} km • ⏱️ {workshop.estimatedTime}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="vehicleType">Vehicle Type *</label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              required
            >
              <option value="">Select your vehicle type</option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="truck">Truck</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="problemDescription">Problem Description *</label>
            <textarea
              id="problemDescription"
              name="problemDescription"
              value={formData.problemDescription}
              onChange={handleChange}
              placeholder="Please describe the problem with your vehicle in detail..."
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="urgency">Urgency Level</label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
            >
              <option value="low">Low - Can wait a few days</option>
              <option value="medium">Medium - Need repair within 1-2 days</option>
              <option value="high">High - Need repair today</option>
              <option value="emergency">Emergency - Vehicle not drivable</option>
            </select>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button
              type="submit"
              className="button success"
              disabled={isSubmitting}
              style={{ marginRight: '1rem' }}
            >
              {isSubmitting ? 'Sending Request...' : 'Send Repair Request'}
            </button>
            
            <button
              type="button"
              className="button"
              onClick={onBack}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e8f4f8', borderRadius: '4px' }}>
          <h4>What happens next?</h4>
          <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
            <li>Your request will be sent to {workshop.name}</li>
            <li>The workshop will review your request and respond within their usual response time</li>
            <li>If accepted, they will call you to discuss details and schedule the repair</li>
            <li>You can track the status of your request in "My Requests"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;