import React, { useRef, useState, useEffect } from 'react';
import { ReactSVGPanZoom, TOOL_NONE, POSITION_NONE } from 'react-svg-pan-zoom';
import PropTypes from 'prop-types';
import { SvgPageSelector } from './SvgPageSelector';

function SVG_Viewer(props) {
  const viewerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [currentImg, setCurrentImg] = useState("");
  const [currentImgFilename, setCurrentImgFilename] = useState("");
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);


  const [responseImgData, setResponseImgData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (props.imageData.name.toLowerCase().endsWith('.pdf')) {
        const formData = new FormData();
        formData.append("file", props.imageData);
        try {
          // const response = await fetch("http://127.0.0.1:5000/pdf_to_image", {
          const response = await fetch("/pdf_to_image/", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          console.log(data);
          const image = new Image();
          image.src = `data:image/png;base64,${data[0].image}`;

          setResponseImgData(data);
          setCurrentImgFilename(data[0].filename);

          image.onload = () => {
            const imageWidth = image.width;
            const imageHeight = image.height;
            if (isMounted) {
              setCurrentImg(image.src);
              setImgSize({ width: imageWidth, height: window.innerHeight });
              setContainerSize({ width: window.innerWidth * 0.85, height: window.innerHeight+200 });
              setImageLoaded(true);
            }
          };
        } catch (error) {
          console.error("Error converting PDF to image:", error);
        }
      } else {
        const image = new Image();
        image.src = URL.createObjectURL(props.imageData);
        image.onload = () => {
          const imageWidth = image.width;
          const imageHeight = image.height;
          if (isMounted) {
            setCurrentImg(image.src);
            setImgSize({ width: imageWidth, height: imageHeight });
            setContainerSize({ width: window.innerWidth, height: imageHeight });
            setImageLoaded(true);
          }
        };
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      // Clean up the URL object when component unmounts
      URL.revokeObjectURL(currentImg);
    };
  }, [props.imageData]);


  const changeCurrentImgFilename = (filename) => {
    setCurrentImgFilename(filename);
    const result = responseImgData.find(item => item.filename === filename);
    setCurrentImg(`data:image/png;base64,${result.image}`);
    console.log(`data:image/png;base64,${result.image}`);
  };

  return (
    <div className="w-full h-full flex">
      <div style={{ display: "flex" }}>
        {imageLoaded ? (
          <ReactSVGPanZoom
            ref={viewerRef}
            width={containerSize.width}
            height={containerSize.height}
            tool={TOOL_NONE}
            miniatureProps={{ position: POSITION_NONE }}
            SVGBackground="none"
            detectAutoPan={false}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={containerSize.width}
              height={containerSize.height}
              className="border-lightgrey border-solid border"
            >
              <image
                href={currentImg}
                width={containerSize.width}
                height={imgSize.height}
              />
            </svg>
          </ReactSVGPanZoom>
        ) : null}
      </div>
      {
        props.imageData.name.toLowerCase().endsWith('.pdf') &&
        <div className="flex" style={{ overflowY: 'auto' }}>
          <SvgPageSelector  
            data={responseImgData} 
            currentImgFilename={currentImgFilename}
            changeCurrentImgFilename={changeCurrentImgFilename}
          />
        </div>
      }
    </div>
  );
}

SVG_Viewer.propTypes = {
  imageData: PropTypes.object.isRequired,
};

export default SVG_Viewer;
