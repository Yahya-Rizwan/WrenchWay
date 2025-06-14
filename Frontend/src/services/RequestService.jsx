import WorkshopService from './WorkshopService';

class RequestService {
  static STORAGE_KEY = 'wrenchway_requests';

  static createRequest(requestData) {
    const request = {
      id: Date.now().toString(),
      workshopId: requestData.workshop.id,
      workshopName: requestData.workshop.name,
      workshopPhone: requestData.workshop.phone,
      vehicleType: requestData.vehicleType,
      problemDescription: requestData.problemDescription,
      urgency: requestData.urgency,
      userLocation: requestData.userLocation,
      status: 'pending', // pending, accepted, rejected
      createdAt: new Date().toISOString(),
      response: null
    };

    // Save to localStorage
    const existingRequests = this.getUserRequests();
    const updatedRequests = [request, ...existingRequests];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRequests));

    // Simulate workshop response
    this.simulateWorkshopResponse(request.id);

    return request;
  }

  static getUserRequests() {
    try {
      const requests = localStorage.getItem(this.STORAGE_KEY);
      return requests ? JSON.parse(requests) : [];
    } catch (error) {
      console.error('Error loading requests:', error);
      return [];
    }
  }

  static updateRequestStatus(requestId, status, response) {
    const requests = this.getUserRequests();
    const updatedRequests = requests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status,
          response,
          updatedAt: new Date().toISOString()
        };
      }
      return request;
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRequests));
    return updatedRequests;
  }

  static async simulateWorkshopResponse(requestId) {
    try {
      const response = await WorkshopService.simulateWorkshopResponse(requestId);
      const status = response.accepted ? 'accepted' : 'rejected';
      
      this.updateRequestStatus(requestId, status, response);
      
      // Trigger a custom event to update the UI
      window.dispatchEvent(new CustomEvent('requestStatusUpdate', {
        detail: { requestId, status, response }
      }));
      
    } catch (error) {
      console.error('Error simulating workshop response:', error);
    }
  }

  static getRequestById(requestId) {
    const requests = this.getUserRequests();
    return requests.find(request => request.id === requestId);
  }

  static deleteRequest(requestId) {
    const requests = this.getUserRequests();
    const updatedRequests = requests.filter(request => request.id !== requestId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRequests));
    return updatedRequests;
  }
}

export default RequestService;