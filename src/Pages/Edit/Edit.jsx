import React, { useEffect, useState, useRef } from "react";
import './edit.css';
import 'tui-image-editor/dist/tui-image-editor.css';
import ImageEditor from '@toast-ui/react-image-editor';
import { useParams } from 'react-router-dom';

const Edit = () => {
  const { id } = useParams();
  const imageEditorRef = useRef(null); // Move the useRef declaration here

  const [meme, setMeme] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/memes')
      .then(response => response.json())
      .then(data => {
        const foundMeme = data.find(meme => meme.id === id);
        setMeme(foundMeme);
      })
      .catch(error => {
        console.error('Error fetching meme data:', error);
      });
  }, [id]);

  if (!meme) {
    return <div>Loading...</div>;
  }

  const handleDownloadClick = () => {
    const imageEditorInstance = imageEditorRef.current?.getInstance();
    if (imageEditorInstance) {
      // Get the canvas data as a blob
      const canvasData = imageEditorInstance.toDataURL({
        format: 'jpeg',
        quality: 0.8,
      });

      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = canvasData;
      downloadLink.download = `edited_meme_${meme.id}.jpeg`;
      downloadLink.target = '_blank';

      // Trigger the download
      downloadLink.click();
    }
  };

  return (
    <>
      <header>
        <div className="container edit__container">
          <h5>Edit</h5>
          <h1>your meme</h1>
          <h5 className="text-light">Add custom quotes, etc.</h5>
        </div>
      </header>
      <div className="editor">
        <ImageEditor
          ref={imageEditorRef}
          includeUI={{
            loadImage: {
              path: meme.url,
              name: 'SampleImage',
            },
            theme: {},
            menu: ['shape', 'filter', 'text'],
            initMenu: 'filter',
            uiSize: {
              width: '90%',
              height: '70%',
            },
            menuBarPosition: 'bottom',
          }}
          cssMaxHeight={500}
          cssMaxWidth={700}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70,
          }}
          usageStatistics={false}
        />
      </div>
      <div className="button">
        <button onClick={handleDownloadClick}>Download</button>
      </div>
    </>
  );
}

export default Edit;
