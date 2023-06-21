import React from 'react'

export const SvgPageSelector = (props) => {
    return (
        <div className="flex flex-col bg-gray-200">
          {
            props.data.map((page, index) => {
              let imageData = `data:image/png;base64,${page.image}`
              return (
                <div
                  key={index}
                  className={`p-4 ${props.currentImgFilename === page.filename ? 'bg-blue-500' : ''}`}
                  onClick={() => props.changeCurrentImgFilename(page.filename)}
                >
                  <div>
                    <img src={imageData} className="w-full" alt="page" />
                    <br/>
                    Page No.{index+1}
                    <hr/>
                  </div>
                </div>
              )
            })
          }
        </div>
    )
}
