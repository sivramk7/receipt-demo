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
      <div className={`tw--list-reset ${hilight ? "tw--bg-blue-200" : ""} tw--w-full tw--items-center tw--space-y-4 tw--p-4`}>
        <button
          onClick={toggleChildren}
          onMouseEnter={onClick}
          ref={cardRef}
          className="tw--flex tw--flex-col tw--items-start tw--w-full tw--text-left"
        >
          <p
            className="tw--font-bold tw--break-words tw--w-11/12"
          >{`${props.entity.type}:`}</p>
          {props.children ? (
            <>
              <p
                className="tw--italic tw--break-words tw--w-11/12"
              >{`(${props.entity.mentionText})`}</p>
              {showChildren ? "▲" : "▼"}
            </>
          ) : (
            <p
              className="tw--break-words tw--w-11/12"
            >{props.entity.mentionText}</p>
          )}
        </button>
        {props.children && (
          <div className={`${showChildren ? "" : "tw--hidden"} tw--ml-5`}>
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
