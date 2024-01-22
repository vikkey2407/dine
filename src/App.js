import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you use Axios for HTTP requests
import './App.css';

const items = [
  { id: 1, name: 'Chicken Tandoori' , price: 550, preparationTime: 5},
  { id: 2, name: 'Pizza', price: 225, preparationTime: 4 },
  { id: 3, name: 'Burger', price: 150, preparationTime: 3 },
  { id: 4, name: 'Shawarma', price: 120, preparationTime: 2 }
  
];

const App = () => {

  const [cart, setCart] = useState([]);
  const [preparationTime, setPreparationTime] = useState(0);
  // api
  const [ads, setAds] = useState([]);

  useEffect(() => {
    
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/photos?_limit=3');
      setAds(response.data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const addToCart = (item) => {
    const tableNumber = allocateTable();
    const updatedCart = [...cart, { ...item, count: 1, table: tableNumber }];
    setCart(updatedCart);
    calculatePreparationTime(updatedCart);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
    calculatePreparationTime(updatedCart);
  };

  const updateItemCount = (itemId, count) => {
    count=Math.max(1,count)
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, count } : item
    );
    setCart(updatedCart);
    calculatePreparationTime(updatedCart);
  };

  const allocateTable = () => {
    
    return Math.floor(Math.random() * 10) + 1;
  };

  const calculatePreparationTime = (updatedCart) => {
    const totalPreparationTime = updatedCart.reduce(
      (total, item) => total + item.preparationTime * item.count,
      0
    );
    setPreparationTime(totalPreparationTime);
  };
 return (
    <div className="App">
      <h1>WIKKY-DINE</h1>
      <div className="menu">
        <h2>Menu</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price}
              <button onClick={() => addToCart(item)}>Add to Cart</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="ads">
        <h2>Advertisements</h2>
        {ads.map((ad) => (
          <div key={ad.id} className="ad-container">
            <img src={ad.imageUrl} alt={ad.title} />
            <p>{ad.description}</p>
          </div>
        ))}
      </div>
      <div className="cart">
        <h2>Cart</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Table</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>
                  <input
                    type="number"
                    value={item.count}
                    onChange={(e) => updateItemCount(item.id, e.target.value)}
                  />
                </td>
                <td>{item.table}</td>
                <td>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
        <strong>Total Cost:</strong> ${cart.reduce((total, item) => total + item.price * item.count, 0)}
        </div>
        <div>
          <strong>Preparation Time:</strong> {preparationTime} minutes
        </div>
      </div>
    </div>
  );
};

export default App;
