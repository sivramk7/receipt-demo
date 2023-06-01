import { useState, useEffect, useRef } from 'react';
import DrawDocument from "./DrawDocument"
import PageSelector from './PageSelector';
import NoData from './NoData';
import PropTypes from 'prop-types';
import EntityList from './EntityList';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function DocAIView(props) {
  const [hilight, setHilight] = useState(null);
  const [imageSize, setImageSize] = useState({width: 0, height: 0});
  const [entityListOpen, setEntityListOpen] = useState(true);
  const [pageSelectorOpen, setPageSelectorOpen] = useState(true);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [selectedViewPage, setSelectedViewPage] = useState(0)
  const [entities, setEntities] = useState([])
  const ref1 = useRef(null);

  function entityOnClick(entity) {
    setHilight(entity)
  }

  useEffect(() => {
    setImageSize({width: 0, height: 0});
    if (props.data && props.data.entities) {
      setEntities(props.data.entities.filter(entity => parseInt(entity?.pageAnchor?.pageRefs[0]?.page) === selectedViewPage));
    }
  }, [props.data])

  useEffect(() => {
    if (props.data && props.data.entities) {
      setEntities(props.data.entities.filter(entity => parseInt(entity?.pageAnchor?.pageRefs[0]?.page) === selectedViewPage));
    }
  }, [selectedViewPage])

  useEffect(() => {
    const updateContainerSize = () => {
      if (ref1.current) {
        const w = ref1.current.offsetWidth;
        const h = ref1.current.offsetHeight;
        setContainerSize({ width: w, height: h });
      }
    };

    updateContainerSize();
  }, [entityListOpen, pageSelectorOpen, selectedViewPage]);

  if (!props.data) {
    return (<NoData />)
  }

  const imageData = props.data.pages[selectedViewPage].image.content;

  if (imageSize.width === 0 && imageSize.height === 0) {
    const img = document.createElement("img");
    img.onload = function (event)
    {
      setImageSize({width: img.width, height: img.height })
    }
    img.src=`data:image/png;base64,${imageData}`
    return <NoData/>
  }

  return (
    <div className="tw--flex tw--w-full tw--h-full">
      <div className="tw--max-w-1/5">
        <div className="tw--flex tw--justify-center tw--items-center tw--px-6" onClick={() => setEntityListOpen(!entityListOpen)}>
          <button className="tw--text-inherit">
            {entityListOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
          </button>
        </div>
        {entityListOpen && (
          <EntityList data={props.data} entities={entities} entityOnClick={entityOnClick} hilight={hilight} />
        )}
      </div>
      <div ref={ref1} className="tw--flex-grow tw--relative tw--min-w-0">
        <DrawDocument
          imageData={imageData}
          imageSize={imageSize}
          entities={entities}
          hilight={hilight}
          entityOnClick={entityOnClick}
          containerSize={containerSize}
        />
      </div>
      <div>
        <div className="tw--flex tw--justify-center tw--items-center" onClick={() => setPageSelectorOpen(!pageSelectorOpen)}>
          <button className="tw--text-inherit">
            {pageSelectorOpen ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
          </button>
        </div>
        {pageSelectorOpen && <PageSelector data={props.data} setSelectedViewPage={setSelectedViewPage} selectedViewPage={selectedViewPage} />}
      </div>
    </div>
  )
}

DocAIView.propTypes = {
  'data': PropTypes.object
}

export default DocAIView
