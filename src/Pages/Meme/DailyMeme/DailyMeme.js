import React, { useEffect, useState } from "react";
import '../../../App.css';
import './DailyMeme.css';


function GetDailyMeme() {
  const [dailyMeme, setDailyMeme] = React.useState({});
  React.useEffect(() => {
    fetch("http://localhost:3001/api/daily_meme")
      .then((res) => res.json())
      .then((dailyMeme) => setDailyMeme(dailyMeme))
      .catch(error => {
        console.error('error fetching daily meme',error);
      });
  }, []);
  console.log(dailyMeme);
  return dailyMeme;
}

const Modal = ({dailyMeme}) => {
  const handleClose = () => {
    const modal = document.querySelector(".modal");
    if (modal) {
      modal.style.display = "none";
    }
  };
  return(
      <div className="modal">
          <span className="close" onClick={handleClose}>&times;</span>
          <div className='modal-content'>
              <div className='modal-header'>
                  <h1 className='modal-title'>Today's Meme :</h1>
              </div>
              <div className='modal-body'>
              <div className="modal-container">
                {Object.keys(dailyMeme).length > 0 ? (
                  <>
                    <img
                      className="modal-img"
                      src={dailyMeme.url}
                      alt={dailyMeme.name}
                    />
                    <div className="overlay">
                      <div className="text">Hello World</div>
                    </div>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          </div>
      </div>
  )
}

function App() {

  const dailyMeme = GetDailyMeme();
  return (
    <div className="App">
      <Modal dailyMeme={dailyMeme}/>
    </div>
  );
}

export default App;
