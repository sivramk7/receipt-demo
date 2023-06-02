import axios from 'axios';
import React, { useState} from 'react';
import {LabelDrawing, LabelText} from './labelling'
import { fabric } from "fabric";

function Edit() {
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
    <div className="font-sans text-center">
      <div className="flex flex-row items-center justify-center space-x-5 my-5">
        <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={()=> document.getElementById("json-upload").click()}> Select Json </button>
        <input type="file" id="json-upload" accept=".json" hidden onChange={handleJsonChange} />
        <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={()=> document.getElementById("image-upload").click()}> Select Image </button>
        <input type="file" id="image-upload" accept="image/*" hidden onChange={handleFileChange} />
        <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={()=> document.getElementById("pdf-upload").click()}> Select PDF </button>
        <input type="file" id="pdf-upload" accept="application/pdf" hidden onChange={handleFileChange} />
        <button className="py-2 px-4 bg-blue-500 text-white rounded" id="edit" onClick={handleEdit}> {editBtnText} </button>
        {images.length > 1 && currentIndex > 0 && (<button className="py-2 px-4 bg-blue-500 text-white rounded" id="prev" onClick={handlePrev}> Prev </button>)} 
        {images.length > 1 && currentIndex < images.length - 1 && (<button className="py-2 px-4 bg-blue-500 text-white rounded" id="next" onClick={handleNext}> Next </button>)} 
        <button className="py-2 px-4 bg-blue-500 text-white rounded" id="submit" onClick={handleUpload}> Submit </button>
      </div>
      <div className='border-black border flex justify-center'>
        <canvas id="canvas"/>
      </div>
      <LabelText
        options={classData}
        onCancel={handleCloseDialog}
        onOk={handleOk}
        show={showDialog}
        x={anchorPoint.x} y={anchorPoint.y} />
    </div>
  );
}

export default Edit;



