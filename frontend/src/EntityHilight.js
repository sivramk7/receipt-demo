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
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * props:
 * hilight
 * imageSize
 * onClick
 * entity
 */
function EntityHilight(props) {
  const renderEntity = (entity) => {
    const onClick = (event) => {
      if (props.onClick) {
        props.onClick(entity, event);
      }
    };

    const isHilighted = () => {
      if (!props.hilight) return false;
      if (typeof props.hilight === 'string') return props.hilight === entity.id;
      if (typeof props.hilight === 'boolean') return props.hilight;
      return JSON.stringify(entity) === JSON.stringify(props.hilight);
    };

    const points = entity.pageAnchor?.pageRefs[0].boundingPoly?.normalizedVertices
      .map((point) => `${point.x * props.imageSize.width + props.imageSize.x},${point.y * props.imageSize.height + props.imageSize.y}`)
      .join(' ');

    return (
      <polygon
        key={`${entity.id}-${entity.mentionText}`}
        points={points}
        fillOpacity="0.1"
        stroke="blue"
        fill={isHilighted() ? 'blue' : 'yellow'}
        onClick={onClick}
        onMouseOver={onClick}
      ></polygon>
    );
  };

  return (
    <>
      {renderEntity(props.entity)}
      {props.childEntities && props.childEntities.map(renderEntity)}
    </>
  );
} // EntityHilight

EntityHilight.propTypes = {
  imageSize: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  hilight: PropTypes.object,
  entity: PropTypes.object,
  childEntities: PropTypes.array,
};

export default EntityHilight;