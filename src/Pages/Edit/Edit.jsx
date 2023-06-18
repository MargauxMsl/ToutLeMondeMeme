import React, { useEffect, useState, useRef } from "react";
import "./edit.css";
import "tui-image-editor/dist/tui-image-editor.css";
import ImageEditor from "@toast-ui/react-image-editor";
import { useParams } from "react-router-dom";

const Edit = () => {
  const { id } = useParams();
  const imageEditorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [meme, setMeme] = useState(null);

  useEffect(() => {
    fetch("https://localhost:3001/api/memes")
      .then((response) => response.json())
      .then((data) => {
        const foundMeme = data.find((meme) => meme.id === id);
        setMeme(foundMeme);
      })
      .catch((error) => {
        console.error("Error fetching meme data:", error);
      });
  }, [id]);

  if (!meme) {
    return <div>Loading...</div>;
  }
  const handleDownloadClick = () => {
    const imageEditorInstance = imageEditorRef.current?.getInstance();
    if (imageEditorInstance) {
      const canvasData = imageEditorInstance.toDataURL({
        format: "jpeg",
        quality: 0.8,
      });

      const downloadLink = document.createElement("a");
      downloadLink.href = canvasData;
      downloadLink.download = `edited_meme_${meme.id}.jpeg`;
      downloadLink.target = "_blank";

      downloadLink.click();
    }
  };

  const Loadimagefromdir = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageEditorInstance = imageEditorRef.current?.getInstance();
      if (imageEditorInstance) {
        imageEditorInstance.loadImageFromURL(e.target.result, "SampleImage");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <header>
        <div className="container edit__container">
          <h5>Edit</h5>
          <h1>YOUR MEME</h1>
          <h5 className="text-light">Add custom quotes, etc.</h5>
        </div>
      </header>
      <div className="editor">
        <ImageEditor
          ref={imageEditorRef}
          includeUI={{
            loadImage: {
              path: meme.url,
              name: "SampleImage",
            },
            theme: {},
            menu: ["shape", "filter", "text"],
            initMenu: "filter",
            uiSize: {
              width: "90%",
              height: "70%",
            },
            menuBarPosition: "bottom",
          }}
          cssMaxHeight={500}
          cssMaxWidth={700}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70,
          }}
          usageStatistics={false}
        />
        <div className="button">
          <input
            type="file"
            accept="image/*"
            onChange={Loadimagefromdir}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <button onClick={() => fileInputRef.current.click()}>
            Load Image
          </button>
          <button onClick={handleDownloadClick}>Download</button>
        </div>
      </div>
    </>
  );
};

export default Edit;
