import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';

const Purchases = () => {
  const [custId, setCustId] = useState('');
  const [orders, setOrders] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/purchase?customer_id=${custId}`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <div style={{ textAlign: 'center', marginLeft: '200px', marginTop: '50px', border: '2px solid black', padding: '10px', width: '700px', height: '500px' }}>
          {orders.map(order => (
              <div key={order.order_id} style={{ border: '1px solid black', marginBottom: '10px', padding: '10px' }}>
                <p>Order ID: {order.order_id}</p>
                <p>Book ID: {order.book_id}</p>
                <p>Customer ID: {order.customer_id}</p>
                <p>Order Date: {order.order_date}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Total Price: {order.total_price}</p>
              </div>
              ))}
        </div>
        <div>
          <h3 style={{ marginTop: '50px', marginLeft: '200px' }}>Search for orders</h3>
          <div style={{ marginTop: '10px', marginLeft: '200px', float: 'right', marginRight: '100px', width: '300px', height: '200px' }} className="search">
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <label htmlFor="custId">Customer ID:</label>
              <input
                type="text"
                id="custId"
                value={custId}
                onChange={(e) => setCustId(e.target.value)}
                style={{ marginLeft: '20px' }}
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleSubmit} style={{ width: '80px' }}>Submit</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Purchases;
