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
        className="absolute border border-black p-2 bg-white opacity-70"
        style={{top: y, left: x}}
      >
        <div className="text-center font-semibold text-lg">
          <label>Insert Class Name</label>
        </div>
        <input className="text-lg my-4 p-1" type="text" value={selectedOption} onChange={handleInputChange} />
        <div>
          {options.map((option) => (
            <div 
              className="cursor-pointer border border-gray-400 my-1 p-1 text-lg"
              key={option}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
        <br />
        <div className="flex justify-center space-x-8 h-6 text-lg">
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleOk}> O K </button>
        </div>
      </div>
    </React.Fragment>
  ) : null;
};

export default LabelText;
