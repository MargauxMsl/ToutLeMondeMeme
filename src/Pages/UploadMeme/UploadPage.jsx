import { useNavigate } from 'react-router-dom';
import React,{useState} from 'react';
import './uploadpage.css'
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DoneIcon from '@mui/icons-material/Done';

function UploadPage() {
    const navigate = useNavigate();
    const SearchBar = () => {
        const navigate = useNavigate();
        const [viewUrl, setViewUrl] = useState(false);
        const [viewDoc, setViewDoc] = useState(false);
        const [selectedFile, setSelectedFile] = useState(null);
        const [imageUrl, setImageUrl] = useState('');
      
        const handleButtonClick =  url => {
          // Ouvrir une nouvelle page avec l'image
          const encodeurl=encodeURIComponent(url);
          navigate(`/EditUpload/${encodeurl}`)
        };
        const HandleImage = (event) => {
          const file = event.target.files[0];
          setViewDoc(false);
          setSelectedFile(URL.createObjectURL(file));
        };
        const handleInputChange = (event) => {
          setImageUrl(event.target.value);
          setViewUrl(false);
        };
        const handleSubmit = () =>{
          navigate(`/EditUpload/${encodeURIComponent(selectedFile)}`)
        };
        const handleViewDoc = () =>{
          setViewDoc(true);
        };

        const handleViewUrl = () =>{
          setViewUrl(true);
        };
        const handleStopViewDoc = () =>{
          setViewDoc(false);
        }

        const handleStopViewUrl = () =>{
          setViewUrl(false);
        }
      
        return (
          <>
            <div className='searchbars'>
              <input type="text" placeholder='Coller URL' value={imageUrl} onChange={handleInputChange} />
              {imageUrl && <DoneIcon className='done' fontSize='medium' onClick={() => handleButtonClick(imageUrl)}/>}
            </div>
            <div className='searchbars'>
              <input type="file" name="file" onChange={HandleImage} />
              {selectedFile && <DoneIcon className='done'fontSize='medium' onClick={handleSubmit}/>}
            </div>
            <div className='uploadZone'>
              {!viewUrl && <VisibilityIcon onClick={handleViewUrl}/>}
              {viewUrl && (
                <>
                  <VisibilityOffIcon onClick={handleStopViewUrl}/>
                  <img src={imageUrl} alt="Pb affichage" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </>)
                }
            </div>
            <div className='uploadZone'>
              {!viewDoc && <VisibilityIcon onClick={handleViewDoc}/>}
              {viewDoc && selectedFile && (
                <>
                  <VisibilityOffIcon onClick={handleStopViewDoc}/>
                  <img src={selectedFile} alt="Document invalide" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </>)
                }
            </div>
          </>
        );
      }
    const handleGoback = () => {
        navigate('/'); // Redirige vers la route '/'
    };
    return(
      <>
    
          <CloseIcon className="close" onClick ={handleGoback} fontSize='large'/>
        <div>
          <SearchBar />
        </div>
      </>
    )
}

export default UploadPage;