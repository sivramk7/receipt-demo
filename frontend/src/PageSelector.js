
import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Display a vertically selectable list of pages
 * @param {*} props 
 * @returns 
 */
function PageSelector(props) {
  function pageChange(pageNumber) {
    setValue(pageNumber)
    props?.setSelectedViewPage(pageNumber)
  }

  const [value, setValue] = useState(0);  // Currently selected tab (page/image)
  return (
    <div className="flex flex-col bg-gray-200">
      {
        props.data.pages.map((page, index) => {
          let imageData = `data:image/png;base64,${page.image.content}`
          return (
            <div
              key={index}
              className={`p-4 ${value === index ? 'bg-blue-500' : ''}`}
              onClick={() => pageChange(index)}
            >
              <div>
                <img src={imageData} className="w-20" alt="page" />
                <br/>
                {page.pageNumber}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

PageSelector.propTypes = {
  'data': PropTypes.object.isRequired,
  'onPageChange': PropTypes.func
}

export default PageSelector