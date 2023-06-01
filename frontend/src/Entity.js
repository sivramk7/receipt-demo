import React from "react";
import PropTypes from "prop-types";

function Entity(props) {
  const [showChildren, setShowChildren] = React.useState(false);

  const cardRef = React.createRef();

  function onClick(event) {
    event.stopPropagation();
    if (props.onClick) {
      props.onClick(props.entity);
    }
  }

  let hilight = false;
  if (props.hilight) {
    if (
      typeof props.hilight === "string" &&
      props.hilight === props.entity.id
    ) {
      hilight = true;
    } else if (typeof props.hilight === "boolean") {
      hilight = props.hilight;
    } else if (JSON.stringify(props.entity) === JSON.stringify(props.hilight)) {
      hilight = true;
    }
  }

  function toggleChildren(event) {
    event.stopPropagation();
    setShowChildren(!showChildren);
  }

  return (
    <>
      <div className={`list-reset ${hilight ? "bg-blue-200" : ""} w-full items-center space-y-4 p-4`}>
        <button
          onClick={toggleChildren}
          onMouseEnter={onClick}
          ref={cardRef}
          className="flex flex-col items-start w-full text-left"
        >
          <p
            className="font-bold break-words w-11/12"
          >{`${props.entity.type}:`}</p>
          {props.children ? (
            <>
              <p
                className="italic break-words w-11/12"
              >{`(${props.entity.mentionText})`}</p>
              {showChildren ? "▲" : "▼"}
            </>
          ) : (
            <p
              className="break-words w-11/12"
            >{props.entity.mentionText}</p>
          )}
        </button>
        {props.children && (
          <div className={`${showChildren ? "" : "hidden"} ml-5`}>
            {props.children.map((child, index) => (
              <Entity
                key={index}
                entity={child}
                onClick={props.onClick}
                hilight={props.hilight}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

Entity.propTypes = {
  onClick: PropTypes.func.isRequired,
  hilight: PropTypes.object,
  entity: PropTypes.object.isRequired,
  children: PropTypes.array,
};

export default Entity;
