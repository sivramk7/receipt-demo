import { useState, useEffect, useRef } from 'react';
import DrawDocument from "./DrawDocument"
import PageSelector from './PageSelector';
import NoData from './NoData';
import { Box, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import EntityList from './EntityList';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


// let timer
// function debounce(fn, ms) {
//   return _ => {
//     clearTimeout(timer)
//     timer = setTimeout(_ => {
//       timer = null
//       fn.apply(this, arguments)
//     }, ms)
//   };
// }

function DocAIView(props) {
  const [hilight, setHilight] = useState(null);
  const [imageSize, setImageSize] = useState({width: 0, height: 0});
  const [entityListOpen, setEntityListOpen] = useState(true);
  const [pageSelectorOpen, setPageSelectorOpen] = useState(true);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const ref1 = useRef(null);

  function entityOnClick(entity) {
    setHilight(entity)
  }

  useEffect(() => {
    setImageSize({width: 0, height: 0})
  }, [props.data])

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

  const imageData = props.data.pages[0].image.content;

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
      <Box>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: "6px" }} onClick={() => setEntityListOpen(!entityListOpen)}>
          <IconButton edge="start" color="inherit" aria-label="menu" >
            {entityListOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
          </IconButton>
        </Box>
        {entityListOpen && (
          <EntityList data={props.data} entityOnClick={entityOnClick} hilight={hilight} />
        )}
      </Box>
      <Box ref={ref1} sx={{ flexGrow: 1, position: "relative", minWidth: 100 }}>
        <DrawDocument
          imageData={imageData}
          imageSize={imageSize}
          entities={props.data.entities}
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
        {pageSelectorOpen && <PageSelector data={props.data} />}
      </Box>
    </Box>
  )
} // DocAIView

DocAIView.propTypes = {
  'data': PropTypes.object
}

export default DocAIView
