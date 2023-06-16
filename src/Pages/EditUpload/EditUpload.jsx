import React from 'react';
import './editupload.css'
import 'tui-image-editor/dist/tui-image-editor.css';
import ImageEditor from '@toast-ui/react-image-editor';
import { useParams } from 'react-router-dom';

const EditUpload = () => {
    const {url}= useParams()

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
                    includeUI={{
                        loadImage: {
                            path: url,
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
        </>
    )
}
export default EditUpload