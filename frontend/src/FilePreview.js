import React from 'react';
import PropTypes from 'prop-types';
import ImagePanZoomRotate from 'react-image-pan-zoom-rotate';

function FilePreview(props) {
  const { file } = props;
  const blob = URL.createObjectURL(file);

  return (
    <div className="tw--flex tw--flex-grow tw--flex-shrink tw--overflow-auto tw--justify-center tw--items-center tw--relative tw--w-full tw--h-full">
      {file.name.toLowerCase().endsWith('.pdf') ? (
        <embed
          src={blob}
          type="application/pdf"
          className="tw--w-full tw--h-full tw--object-contain"
        />
      ) : (
        <div className="tw--w-full tw--h-full tw--flex tw--justify-center tw--items-center">
          <ImagePanZoomRotate
            image={blob}
            alt="uploaded document"
            className="tw--object-contain"
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
