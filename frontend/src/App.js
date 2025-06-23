import React, { useEffect, useState } from 'react';
import './App.css'; // Make sure you create App.css with styles

const App = () => {
  const [vegees, setVegee] = useState([]);
  const [newvegeesname, setNewvegeesname] = useState("");
  const [newvegeesprice, setNewvegeesprice] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateindex, setUpdateindex] = useState(null);

  const handlesubmit = () => {
    fetch("http://localhost:5000/vegees", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vegeename: newvegeesname, vegeeprice: newvegeesprice })
    })
      .then(res => res.json())
      .then(data => {
        loadData()
        setNewvegeesname("");
        setNewvegeesprice("");
      });
  };

  const loadData = () => {
    fetch("http://localhost:5000/vegees")
      .then(res => res.json())
      .then(data => setVegee(data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const updatevegee = (index) => {
    setIsUpdate(true);
    setUpdateindex(index);
    setNewvegeesname(vegees[index].vegeename);
    setNewvegeesprice(vegees[index].vegeeprice);
  };

  const updatesave = () => {
    const id = vegees[updateindex]._id;
    fetch(`http://localhost:5000/vegees/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vegeename: newvegeesname, vegeeprice: newvegeesprice })
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to update');
      })
      .then(() => {
        loadData();
        setIsUpdate(false);
        setUpdateindex(null);
        setNewvegeesname("")
        setNewvegeesprice("");
      });
  };

  const deletevegee = (index) => {
    const id = vegees[index]._id;
    fetch(`http://localhost:5000/vegees/${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Unable to delete");
        return res.json();
      })
      .then(() => loadData())
      .catch(err => console.error("Delete error:", err));
  };

  return (
    <div className="app-container">
      <h2 className="title">Vegetable Price Manager</h2>
      <table className="vegee-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Vegee Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            vegees.map((vege, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{vege.vegeename}</td>
                <td>{vege.vegeeprice}</td>
                <td>
                  <button className="btn update-btn" onClick={() => updatevegee(index)}>Update</button>
                  <button className="btn delete-btn" onClick={() => deletevegee(index)}>Delete</button>
                </td>
              </tr>
            ))
          }
          <tr className="input-row">
            <td></td>
            <td><input type="text" className="input" value={newvegeesname} onChange={(e) => setNewvegeesname(e.target.value)} /></td>
            <td><input type="number" className="input" value={newvegeesprice} onChange={(e) => setNewvegeesprice(e.target.value)} /></td>
            <td><button className="btn add-btn" onClick={handlesubmit}>Add</button></td>
          </tr>
        </tbody>
      </table>

      {isUpdate && (
        <div className="update-box">
          <h3>Update Vegetable</h3>
          <input
            type="text"
            className="input"
            value={newvegeesname}
            placeholder="Update name"
            onChange={(e) => setNewvegeesname(e.target.value)}
          />
          <input
            type="number"
            className="input"
            value={newvegeesprice}
            placeholder="Update price"
            onChange={(e) => setNewvegeesprice(e.target.value)}
          />
          <button className="btn save-btn" onClick={updatesave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default App;
