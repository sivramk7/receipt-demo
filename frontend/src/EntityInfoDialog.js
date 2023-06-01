import React from 'react';
import PropTypes from 'prop-types';

function EntityInfoDialog(props) {
  const handleClose = () => {
    props.close();
  };

  if (props.entity === null) {
    return null;
  }

  return (
    <div 
      className={`tw--fixed tw--inset-0 tw--z-50 tw--overflow-y-auto tw--bg-white ${props.open ? 'tw--block' : 'tw--hidden'}`} 
      style={{ backdropFilter: 'blur(5px)' }}
    >
      <div className="tw--my-20 tw--mx-auto tw--bg-white tw--rounded-lg tw--w-full tw--max-w-2xl">
        <div className="tw--px-6 tw--py-4">
          <h2 className="tw--text-xl tw--font-bold">Entity Details: {props.entity.type}</h2>
          <div className="tw--mt-4 tw--border tw--border-gray-200 tw--rounded-lg tw--overflow-x-auto">
            <pre className="tw--p-4">{JSON.stringify(props.entity, null, 2)}</pre>
          </div>
        </div>
        <div className="tw--border-t tw--border-gray-200 tw--px-4 tw--py-3 tw--flex tw--justify-end">
          <button className="tw--px-4 tw--py-2 tw--rounded tw--bg-blue-500 tw--text-white tw--font-bold tw--hover:bg-blue-700" onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

EntityInfoDialog.propTypes = {
  'open': PropTypes.bool,
  'close': PropTypes.func,
  'entity': PropTypes.object,
}

export default EntityInfoDialog;
