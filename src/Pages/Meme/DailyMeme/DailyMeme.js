import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../App.css";
import "./DailyMeme.css";

function GetDailyMeme() {
  const [dailyMeme, setDailyMeme] = React.useState({});
  React.useEffect(() => {
    fetch("http://localhost:3001/api/daily_meme")
      .then((res) => res.json())
      .then((dailyMeme) => setDailyMeme(dailyMeme))
      .catch((error) => {
        console.error("error fetching daily meme", error);
      });
  }, []);
  console.log(dailyMeme);
  return dailyMeme;
}

const Modal = ({ dailyMeme }) => {
  const handleClose = () => {
    const modal = document.querySelector(".modal");
    if (modal) {
      modal.style.display = "none";
    }
  };

  return (
    <div className="modal">
      <span className="close_modal" onClick={handleClose}>
        &times;
      </span>
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title">Le meme du jour :</h1>
        </div>
        <div className="modal-body">
          <div className="modal-container">
            {Object.keys(dailyMeme).length > 0 ? (
              <div className="image_container">
                <Link to={'/edit/'+dailyMeme.id}>
                  <img
                    className="modal-img"
                    src={dailyMeme.url}
                    alt={dailyMeme.name}
                    onClick={handleClose}
                  />
                </Link>
              </div>
            ) : (
              <p>Loading...</p>
            )}
            <h1 className="description">Créer le prochain meme tendance!</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const dailyMeme = GetDailyMeme();

  return (
    <div className="App">
      <Modal dailyMeme={dailyMeme} />
    </div>
  );
}

export default App;
