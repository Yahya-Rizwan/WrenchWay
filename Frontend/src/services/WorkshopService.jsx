import LocationService from './LocationService';

class WorkshopService {
  // Mock workshop data - In real app, this would come from your backend API
  static mockWorkshops = [
    {
      id: 1,
      name: "Quick Fix Auto Repair",
      address: "123 Main Street, Downtown",
      phone: "+1-234-567-8901",
      rating: 4.5,
      specialties: ["Engine Repair", "Brake Service", "Oil Change"],
      latitude: 26.8467,
      longitude: 80.9462,
      isOpen: true,
      responseTime: "Usually responds within 30 minutes"
    },
    {
      id: 2,
      name: "City Motors Workshop",
      address: "456 Oak Avenue, City Center",
      phone: "+1-234-567-8902",
      rating: 4.2,
      specialties: ["Transmission", "AC Repair", "Electrical"],
      latitude: 26.8500,
      longitude: 80.9500,
      isOpen: true,
      responseTime: "Usually responds within 1 hour"
    },
    {
      id: 3,
      name: "Express Auto Care",
      address: "789 Pine Road, Industrial Area",
      phone: "+1-234-567-8903",
      rating: 4.7,
      specialties: ["General Repair", "Bodywork", "Painting"],
      latitude: 26.8400,
      longitude: 80.9400,
      isOpen: false,
      responseTime: "Usually responds within 2 hours"
    },
    {
      id: 4,
      name: "Professional Auto Service",
      address: "321 Elm Street, Business District",
      phone: "+1-234-567-8904",
      rating: 4.3,
      specialties: ["Luxury Cars", "Import Vehicles", "Diagnostics"],
      latitude: 26.8520,
      longitude: 80.9480,
      isOpen: true,
      responseTime: "Usually responds within 45 minutes"
    },
    {
      id: 5,
      name: "Rapid Repair Station",
      address: "654 Maple Drive, Suburb",
      phone: "+1-234-567-8905",
      rating: 4.0,
      specialties: ["Quick Service", "Tire Change", "Battery"],
      latitude: 26.8380,
      longitude: 80.9520,
      isOpen: true,
      responseTime: "Usually responds within 20 minutes"
    }
  ];

  static getNearbyWorkshops(userLocation, radiusKm = 50) {
    const workshopsWithDistance = this.mockWorkshops.map(workshop => {
      const distance = LocationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        workshop.latitude,
        workshop.longitude
      );

      const estimatedTime = LocationService.calculateEstimatedTime(distance);

      return {
        ...workshop,
        distance,
        estimatedTime
      };
    });

    // Filter workshops within radius and sort by distance
    return workshopsWithDistance
      .filter(workshop => workshop.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }

  static getWorkshopById(id) {
    return this.mockWorkshops.find(workshop => workshop.id === id);
  }

  // Simulate workshop response to request
  static simulateWorkshopResponse(requestId) {
    return new Promise((resolve) => {
      // Simulate random response after 2-5 seconds
      const responseTime = Math.random() * 3000 + 2000;
      const willAccept = Math.random() > 0.3; // 70% chance of acceptance
      
      setTimeout(() => {
        resolve({
          accepted: willAccept,
          message: willAccept 
            ? "Request accepted! We'll call you shortly to discuss details."
            : "Sorry, we're currently busy. Please try another workshop."
        });
      }, responseTime);
    });
  }
}

export default WorkshopService;