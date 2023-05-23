import { useState, useEffect, useRef } from 'react';
import DrawDocument from "./DrawDocument"
import PageSelector from './PageSelector';
import NoData from './NoData';
import { Box, IconButton } from '@mui/material';
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
  }, [entityListOpen, pageSelectorOpen]);

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
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <Box sx={{ maxWidth: "25%" }}>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: "6px" }} onClick={() => setEntityListOpen(!entityListOpen)}>
          <IconButton edge="start" color="inherit" aria-label="menu" >
            {entityListOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
          </IconButton>
        </Box>
        {entityListOpen && (
          <EntityList data={props.data} entities={entities} entityOnClick={entityOnClick} hilight={hilight} />
        )}
      </Box>
      <Box ref={ref1} sx={{ flexGrow: 1, position: "relative", minWidth: "100" }}>
        <DrawDocument
          imageData={imageData}
          imageSize={imageSize}
          entities={entities}
          hilight={hilight}
          entityOnClick={entityOnClick}
          containerSize={containerSize}
        />
      </Box>
      <Box>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setPageSelectorOpen(!pageSelectorOpen)}>
          <IconButton edge="end" color="inherit" aria-label="menu" >
            {pageSelectorOpen ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
          </IconButton>
        </Box>
        {pageSelectorOpen && <PageSelector data={props.data} setSelectedViewPage={setSelectedViewPage} selectedViewPage={selectedViewPage} />}
      </Box>
    </Box>
  )
} // DocAIView

DocAIView.propTypes = {
  'data': PropTypes.object
}

export default DocAIView
