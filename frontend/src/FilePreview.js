import React from 'react';
import PropTypes from 'prop-types';
import ImagePanZoomRotate from 'react-image-pan-zoom-rotate';

function FilePreview(props) {
  const { file } = props;
  const blob = URL.createObjectURL(file);

  return (
    <div className="flex flex-grow flex-shrink overflow-auto justify-center items-center relative w-full h-full">
      {file.name.toLowerCase().endsWith('.pdf') ? (
        <embed
          src={blob}
          type="application/pdf"
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <ImagePanZoomRotate
            image={blob}
            alt="uploaded document"
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
}

FilePreview.propTypes = {
  file: PropTypes.object.isRequired,
};

export default FilePreview;
