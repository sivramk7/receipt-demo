/*
# Copyright 2022, Google, Inc.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import React from "react";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import PropTypes from "prop-types";

/**
 * Display an Entity card for a given entity.
 * props
 * * entity - The entity to display
 * * hilight
 * * onClick - A callback invoked when the card is clicked.
 */
function Entity(props) {
  const [showChildren, setShowChildren] = React.useState(false);

  const cardRef = React.createRef(); // Create a ref for the containing card so that we can scroll it into view

  function onClick(event) {
    event.stopPropagation();
    if (props.onClick) {
      props.onClick(props.entity);
    }
  }

  // Determine whether or not we should hilight.  The rules are:
  // If no hilight is supplied then no hilight
  // If a string, then compare it to the enetity id value
  // If a boolean, then hilight based on the value of the boolean
  // If an object, assume it is an entity and hilight based on the id comparison
  //
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

  // When the entity has rendered, if this entity is hilighted, then scroll it into
  // view within the containing list.
  // useEffect(() => {
  //   if (hilight && cardRef.current) {
  //     cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //   }
  // });

  function toggleChildren(event) {
    event.stopPropagation();
    setShowChildren(!showChildren);
  }

  return (
    <>
      <List>
        <ListItemButton
          onClick={toggleChildren}
          onMouseEnter={onClick}
          ref={cardRef}
          style={{
            backgroundColor: hilight ? "rgba(63, 81, 181, 0.1)" : "",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <ListItemText
            style={{ fontWeight: "bold", overflowWrap: "break-word",
            wordWrap: "break-word",
            hyphens: "auto",
            width: "95%" }}
            primary={`${props.entity.type}:`}
          />
          {props.children ? (
            <>
              <ListItemText
                style={{
                  fontStyle: "italic",
                  overflowWrap: "break-word",
            wordWrap: "break-word",
            hyphens: "auto",
            width: "95%" 
                }}
                primary={`(${props.entity.mentionText})`}
              />
              {showChildren ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </>
          ) : (
            <ListItemText
              style={{ overflowWrap: "break-word",
              wordWrap: "break-word",
              hyphens: "auto",
              width: "95%"  }}
              primary={props.entity.mentionText}
            />
          )}
        </ListItemButton>
        {props.children && (
          <>
            <Collapse in={showChildren}>
              <Box ml={5}>
                {props.children.map((child, index) => (
                  <Entity
                    key={index}
                    entity={child}
                    onClick={props.onClick}
                    hilight={props.hilight}
                    style={{ marginLeft: "5%" }}
                  />
                ))}
              </Box>
            </Collapse>
          </>
        )}
      </List>
    </>
  );
} // Entity

Entity.propTypes = {
  onClick: PropTypes.func.isRequired,
  hilight: PropTypes.object,
  entity: PropTypes.object.isRequired,
  children: PropTypes.array,
};

export default Entity;
