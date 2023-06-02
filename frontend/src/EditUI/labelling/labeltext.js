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
