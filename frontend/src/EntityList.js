import { useEffect } from "react";
import Entity from "./Entity";
import PropTypes from "prop-types";

function EntityList(props) {

  return (
    <div
      className="h-full overflow-y-auto"
    >
      {
        props.entities
          .slice()
          .sort((a, b) => {
            if (a.type > b.type) return 1;
            if (a.type < b.type) return -1;
            return 0;
          })
          .map((entity, index) => {
            const childEntities = entity.properties;
            return (
              <Entity
                key={`${entity.id}-${entity.mentionText}-${index}`}
                entity={entity}
                hilight={props.hilight}
                onClick={props.entityOnClick}
                children={childEntities.length > 0 ? childEntities : null}
              />
            );
          })
      }
    </div>
  );
}

EntityList.propTypes = {
  entityOnClick: PropTypes.func.isRequired,
  hilight: PropTypes.object,
  data: PropTypes.object.isRequired,
  entities: PropTypes.array,
};

export default EntityList;
