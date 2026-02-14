const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

class ShipRocketService {
  constructor() {
    this.token = process.env.SHIPROCKET_TOKEN;
  }

  async createOrder(orderData) {
    // Mock response for testing since API key is placeholder
    console.log('ShipRocket createOrder called with:', orderData);
    return {
      awb: 'SHIPROCKET123456789',
      courier_name: 'Delhivery',
      tracking_url: 'https://www.delhivery.com/tracking?awb=SHIPROCKET123456789'
    };
    // Uncomment below for real API call
    /*
    const response = await fetch(`${BASE_URL}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(orderData)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`ShipRocket API error: ${data.message || response.statusText}`);
    }
    return data;
    */
  }

  async createShipment(shipmentData) {
    const response = await fetch(`${BASE_URL}/shipments/create/forward-shipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(shipmentData)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`ShipRocket API error: ${data.message || response.statusText}`);
    }
    return data;
  }

  async trackShipment(awb) {
    // Mock response for testing
    console.log('ShipRocket trackShipment called for AWB:', awb);
    return {
      tracking_data: {
        shipment_track: [
          {
            awb_code: awb,
            current_status: 'Delivered',
            delivered_date: new Date().toISOString(),
            shipment_status: 'DELIVERED'
          }
        ]
      }
    };
    // Uncomment below for real API call
    /*
    const response = await fetch(`${BASE_URL}/courier/track?awb=${awb}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`ShipRocket API error: ${data.message || response.statusText}`);
    }
    return data;
    */
  }
}

module.exports = new ShipRocketService();