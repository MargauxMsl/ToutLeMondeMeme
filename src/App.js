import Edit from './Pages/Edit/Edit';
import Meme from './Pages/Meme/Meme';
import EditUpload from './Pages/EditUpload/EditUpload';
import UploadPage from './Pages/UploadMeme/UploadPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

function App() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.body.classList.add("dark");
    } else {
      setTheme("light");
      document.body.classList.remove("dark");
    }
  };

  return (
    <div className={`App ${theme}`}>
      <div className="dark-buttons">
        <button name="darkmode" onClick={toggleTheme}>
          Switch to {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>

      <div className="main">
        <Routes>
          <Route exact path='/' element={<Meme />} />
          <Route path='/edit/:id' element={<Edit />} />
          <Route path='/upload' element={<UploadPage />} />
          <Route path='/EditUpload/:url' element={<EditUpload />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
