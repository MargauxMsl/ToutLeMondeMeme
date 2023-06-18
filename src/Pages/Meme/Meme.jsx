//to push data , firstly, create memeData

// const createMeme = async (memeData) => {
//   try {
//     const response = await axios.post('http://localhost:3000/memes', memeData);
//     console.log('Meme created:', response.data);
//     // Perform any necessary actions after successful creation
//   } catch (error) {
//     console.error('Error creating meme:', error);
//     // Handle error if creation fails
//   }
// };

//to modify data, firstly, create updateData and give memeID
// const updateMeme = async (memeId, updatedData) => {
//   try {
//     const response = await axios.put(`http://localhost:3000/memes/${memeId}`, updatedData);
//     console.log('Meme updated:', response.data);
//     // Perform any necessary actions after successful update
//   } catch (error) {
//     console.error('Error updating meme:', error);
//     // Handle error if update fails
//   }
// };

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./meme.css";
import { Link, useNavigate } from "react-router-dom";
import "./logo-lightmode.png";

function MemeComponent() {
  const navigate = useNavigate();
  const [memes, setMemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMemes, setFilteredMemes] = useState([]);
  const [clickedMemeId, setClickedMemeId] = useState(null);

  useEffect(() => {
    axios
      .get("https://localhost:3001/api/memes")
      .then((response) => {
        const fetchedMemes = response.data;
        const formattedMemes = fetchedMemes.map((meme) => ({
          ...meme,
          square: meme.width * meme.height,
        }));
        const sortedMemes = formattedMemes.sort((a, b) => a.square - b.square);
        setMemes(sortedMemes);
        setFilteredMemes(sortedMemes);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = memes.filter(
      (meme) =>
        meme &&
        meme.name &&
        meme.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMemes(filtered);
  };

  const handleMemeClick = (memeId) => {
    if (clickedMemeId === memeId) {
      setClickedMemeId(null);
    } else {
      setClickedMemeId(memeId);
    }
  };

  const handleDownloadClick = (memeUrl, memeName) => {
    fetch(memeUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const blobURL = window.URL.createObjectURL(new Blob([blob]));
        const filename = memeName + ".jpg";
        const link = document.createElement("a");
        link.href = blobURL;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  };

  const handleEditClick = (memeId) => {
    navigate(`/edit/${memeId}`);
    //window.open(`/edit/${memeId}`, "_blank");
  };

  return (
    <>
      <header>
        <div className="container edit__container">
          <img
            src={require("./logo-lightmode.png")}
            alt="logo"
            class="black-logo"
          />
          <img
            src={require("./logo-darkmode.png")}
            alt="logo"
            class="white-logo"
          />
        </div>
      </header>
      <div className="meme-container">
        <div className="search_bar">
          <input
            type="text"
            placeholder="Recherche memes"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button type="submit">
            <img
              src={require("./search.png")}
              alt="Logo"
              height="60px"
              width="60px"
            />
          </button>
        </div>

        <div className="meme-grid">
          {filteredMemes.length > 0 ? (
            filteredMemes.map((meme) => (
              <div
                className={`meme-item ${
                  clickedMemeId === meme.id ? "clicked" : ""
                }`}
                key={meme.id}
              >
                <h5 className="names">{meme.name}</h5>
                <img
                  className="thumbnail"
                  src={meme.url}
                  alt={meme.name}
                  onClick={() => handleMemeClick(meme.id)}
                />
                {clickedMemeId === meme.id && (
                  <div className="meme-buttons">
                    <button
                      onClick={() => handleDownloadClick(meme.url, meme.name)}
                    >
                      Download
                    </button>
                    <Link to={`/edit/${meme.id}`}>
                      <button onClick={() => handleEditClick(meme.id)}>
                        Edit
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No memes found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default MemeComponent;
