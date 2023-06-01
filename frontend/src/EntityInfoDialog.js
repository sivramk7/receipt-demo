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
      className={`fixed inset-0 z-50 overflow-y-auto bg-white ${props.open ? 'block' : 'hidden'}`} 
      style={{ backdropFilter: 'blur(5px)' }}
    >
      <div className="my-20 mx-auto bg-white rounded-lg w-full max-w-2xl">
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold">Entity Details: {props.entity.type}</h2>
          <div className="mt-4 border border-gray-200 rounded-lg overflow-x-auto">
            <pre className="p-4">{JSON.stringify(props.entity, null, 2)}</pre>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-3 flex justify-end">
          <button className="px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-700" onClick={handleClose}>Close</button>
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
