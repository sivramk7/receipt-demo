import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import ImagePanZoomRotate from 'react-image-pan-zoom-rotate';

function FilePreview(props) {
  const { file } = props;
  const blob = URL.createObjectURL(file);

  return (
    <Box
      sx={{
        flexGrow: 1,
        flexShrink: 1,
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {file.name.toLowerCase().endsWith('.pdf') ? (
        <embed
          src={blob}
          type="application/pdf"
          width="100%"
          height="100%"
          style={{ objectFit: 'contain' }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ImagePanZoomRotate
            image={blob}
            alt="uploaded document"
            style={{ objectFit: 'contain' }}
          />
        </Box>
      )}
    </Box>
  );
}

FilePreview.propTypes = {
  file: PropTypes.object.isRequired,
};

export default FilePreview;
