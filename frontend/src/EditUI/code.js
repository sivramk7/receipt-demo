Following is the code for labeling react app:

App.js:
import axios from 'axios';
import React, { useState} from 'react';
import {LabelDrawing, LabelText} from './labelling'
import { fabric } from "fabric";



function App() {
  const [labelInstance, setLabelInstance] = useState(null);
  const [oldImageInstance, setOldImageInstance] = useState(null);
  const [canvasInstance, setCanvasInstance] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({x:0, y:0});
  const [editBtnText, setEditBtnText] = useState(" Edit ");
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCloseDialog = () => {
    labelInstance.closedtextDialog(null);
    setShowDialog(false);
  };

  const handleOk = (text) => {
    labelInstance.closedtextDialog(text);
    setShowDialog(false);
    if (!classData.includes(text)){
      setClassData(classData=>[...classData, text]);
    }
  };

  function updateShow(show, x, y){
    setShowDialog(show);
    setAnchorPoint({x:x, y:y});
  }
  
  const handleJsonChange = (event) => {
    if (labelInstance != null && labelInstance.subscribed){
      alert("Please finish the current editing!");
      return;
    }

    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = function (e) {
      const content = e.target.result;
      try {
        const parsedData = JSON.parse(content);
        setJsonData(parsedData);
        const textArr = parsedData.map(item=>item.class);
        setClassData(textArr);
        if (labelInstance != null){
          labelInstance.clearObjects();
          labelInstance.setPrevData(textArr);
        }
      } catch (error) {
        console.log('Error parsing JSON file:', error);
      }
    };

    reader.readAsText(file);
  };

  function displayImage(currentImage) {
      
      const byteCharacters = atob(currentImage.image);
      const byteArrays = [];

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }

      const byteArray = new Uint8Array(byteArrays);
      const blob = new Blob([byteArray], { type: 'image/png' });
      // const imageBlob = new Blob([currentImage.image], {type:'image/png'});
      const imageUrl = URL.createObjectURL(blob);
      console.log(imageUrl);
      const img = new Image();
      img.onload = function () {
        
        console.log(img.width);
        
        let canvasObj = canvasInstance;
        let labellingInstance = labelInstance;

        const canvasimg = new fabric.Image(img, {
          selectable: false
        });
        
        if (canvasObj == null){
            canvasObj = new fabric.Canvas("canvas", {
            width: img.width,
            height: img.height,
            selectable: true
          });
        }
        else {
          if (oldImageInstance != null){
            canvasObj.remove(oldImageInstance);
            console.log("removed old image instance");
          }
          canvasObj.setWidth(img.width);
          canvasObj.setHeight(img.height);
        }
        canvasObj.add(canvasimg);
        setOldImageInstance(canvasimg);
        setCanvasInstance(canvasObj);
        setJsonData([]);
        
        console.log(canvasInstance);
        console.log(oldImageInstance);

        if (labellingInstance == null){
          labellingInstance = new LabelDrawing(canvasObj, fabric, null, updateShow);
          setLabelInstance(labellingInstance);
          console.log("create new labelinstance");
        }
        else {
          // labellingInstance.clearCanvas();
          labellingInstance.setCanvas(canvasObj);
          labellingInstance.setPrevData(jsonData);
          console.log("update labelinstance");
        }

      };
      img.src = imageUrl;
  };

  const handleNext = (event) => {
    if (labelInstance != null && labelInstance.subscribed){
      alert("Please finish the current editing!");
      return;
    }
    setCurrentIndex(currentIndex+1);
    displayImage(images[currentIndex+1]);
  };

  const handlePrev = (event) => {
    if (labelInstance != null && labelInstance.subscribed){
      alert("Please finish the current editing!");
      return;
    }
    setCurrentIndex(currentIndex-1);
    displayImage(images[currentIndex-1]);
  };

  const handleFileChange = async (event) => {
    if (labelInstance != null && labelInstance.subscribed){
      alert("Please finish the current editing!");
      return;
    }

    try {
      const file = event.target.files[0];
      const formData = new FormData();
      
      formData.append('file', file);
      formData.append('screenWidth', window.innerWidth);
      const response = await axios.post('http://127.0.0.1:5000/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      // Handle the response
      // const receivedFile = new Blob([response.data], { type: 'application/octet-stream' });
      const data = response.data;
      setImages(data);
      setCurrentIndex(0);
      displayImage(data[0]);
      
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleEdit = () => {
    
    if (labelInstance == null){
      return;
    }
    if (labelInstance.subscribed){
      labelInstance.unsubscribe();
      console.log("unsubscribed");
      setEditBtnText(" Edit ");
    }
    else {
      labelInstance.subscribe();
      setEditBtnText(" Finish ");
      console.log("subscribed");
    }
    
  }
  
  const handleUpload = async () => {
    if (labelInstance == null){
      return;
    }
    labelInstance.unsubscribe();

    const submitdata = labelInstance.getLabelData();
    console.log(submitdata);
    if (submitdata == null) {
      return;
    }

    const filename = images[currentIndex].filename;
    console.log(filename);
    try {
      
      const response = await axios.post('http://localhost:5000/upload-label', {filename:filename, data:submitdata});
      
      if (response.data === 'Ok') {
        // Handle success
        alert("Successed!");
        console.log('Post request succeeded');
      }  else {
        alert("Failed!");
        // Handle failure
        console.log('Post request failed');
      }
    } catch (error) {
      alert("Error on Server. Please reopen image and try again.");
      console.error('Error:', error);
    }
  };
  
  
  return (
    <div id="app-div">
      <label className="title"> Web Labelling Tool</label>
      <div id='body-contatiner'>
        <div className='group-button'>
          <button id="upload-json" onClick={()=> document.getElementById("json-upload").click()}> Select Json </button>
          <input type="file" id="json-upload" accept=".json" hidden onChange={handleJsonChange} />
          <button id="upload-image" onClick={()=> document.getElementById("image-upload").click()}> Select Image </button>
          <input type="file" id="image-upload" accept="image/*" hidden onChange={handleFileChange} />
          <button id="upload-pdf" onClick={()=> document.getElementById("pdf-upload").click()}> Select PDF </button>
          <input type="file" id="pdf-upload" accept="application/pdf" hidden onChange={handleFileChange} />
        </div>
        <div className='group-button'>
        <button id="edit" onClick={handleEdit}> {editBtnText} </button>
        
        {images.length > 1 && currentIndex > 0 && (<button id="prev" onClick={handlePrev}> Prev </button>)} 

        {images.length > 1 && currentIndex < images.length - 1 && (<button id="next" onClick={handleNext}> Next </button>)} 
        
        <button id="submit" onClick={handleUpload}> Submit </button>
        </div>
        <div className='canvas-div'>
          <canvas id="canvas" width={500} height={800}/>
        </div>
        <LabelText
          options={classData}
          onCancel={handleCloseDialog}
          onOk={handleOk}
          show={showDialog}
          x={anchorPoint.x} y={anchorPoint.y} />
        {/* <LabelText /> */}
      </div>
    </div>
    );
  }
  
  export default App;

const.js:
export const defaultRectOptions = {
    strokeWidth: 2,
    stroke: "red",
    fill: "transparent",
    width: 20,
    height: 20,
    strokeUniform: true,
    noScaleCache: false,
    objectCaching: false
  };
  
  

export const defaultLineOptions = {
    strokeWidth: 2,
    stroke: "red",
    fill: "red",
    strokeUniform: true,
    noScaleCache: false
  }
  
export const drawingMode = {
    RECTANGLE: "RECTANGLE",
    POLYGON: "POLYGON"
  };

index.js:
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

Edit.js:
import React, {useEffect, useRef, useState} from "react";

export default function Edit() {

}

reportWebVitals.js
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

labelling/index.js:
export { default as BaseDrawing } from "./basedrawing";

export { default as LabelDrawing } from "./labeldrawing";

export { default as LabelText} from "./labeltext";

labelling/labeltext.js:
import "../styles.css";
import React, { useState } from 'react';

 
const LabelText = ({ options, onCancel, onOk, show, x, y }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleInputChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleOk = () => {
    onOk(selectedOption);
  };

  return show ? (
    <React.Fragment>
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        border: '1px solid black',
        padding: '10px',
        backgroundColor: 'white',
        opacity:0.7,
      }}
    >
        <div className="clstitle-div">
            <label>Insert Class Name</label>
        </div>
            <input className="clstext-div" type="text" value={selectedOption} onChange={handleInputChange} />
        <div>
            {options.map((option) => (
            <div 
                className="clsmenu-div"
                key={option}
                onClick={() => handleOptionClick(option)}
            >
                {option}
            </div>
            ))}
        </div>
      <br />
      <div className="clsbtn-div">
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleOk}> O K </button>
      </div>
      
    </div>
    </React.Fragment>
  ) : null;
};

export default LabelText;

I'll share the labelling folders code too, remember this all.