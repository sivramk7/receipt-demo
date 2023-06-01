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
import { useState } from 'react';
import EntityInfoDialog from './EntityInfoDialog';
import PropTypes from 'prop-types';
import NoData from './NoData';

/**
 * props
 * * data - The JSON object
 * @param {*} props 
 * @returns 
 */
function Details(props) {
  const [open, setOpen] = useState(false)
  const [entity, setEntity] = useState(null)
  if (props.data === null) {
    return <NoData />
  }
  const doc = props.data;
  return (
    <div className="tw--overflow-y-auto">
      <div className="tw--m-1 tw--bg-white tw--shadow-md tw--rounded">
        <div className="tw--flex tw--flex-col tw--space-y-2">
          {/* Details Card */}
          <div className="tw--p-4 tw--border tw--rounded">
            <h6 className="tw--text-lg tw--font-bold">Details</h6>
            <ul className="tw--text-base">
              <li>Uri: {doc.uri ? doc.uri : "<none>"}</li>
              <li>MimeType: {doc.mimeType}</li>
              <li>Page Count: {doc.pages.length}</li>
              <li>Human review status: {props.data.humanReviewStatus ? props.data.humanReviewStatus.state : "undefined"}</li>
            </ul>
          </div>
          {/* Pages Card */}
          <div className="tw--p-4 tw--border tw--rounded">
            <h6 className="tw--text-lg tw--font-bold">Pages</h6>
            <div className="tw--overflow-auto">
              <table className="tw--min-w-full tw--divide-y tw--divide-gray-200">
                <thead className="tw--bg-gray-50">
                  <tr>
                    <th>Page Number</th>
                    <th>Width</th>
                    <th>Height</th>
                    <th>Units</th>
                    <th>Languages</th>
                    <th>Blocks</th>
                    <th>Paragraphs</th>
                    <th>Lines</th>
                    <th>Tokens</th>
                    <th>Tables</th>
                    <th>Form Fields</th>
                  </tr>
                </thead>
                <tbody className="tw--bg-white tw--divide-y tw--divide-gray-200">
                  {doc.pages.map((page) => (
                    <tr key={page.pageNumber}>
                      <td>{page.pageNumber}</td>
                      <td>{page.dimension ? page.dimension.width : "undefined"}</td>
                      <td>{page.dimension ? page.dimension.height : "undefined"}</td>
                      <td>{page.dimension ? page.dimension.unit : "undefined"}</td>
                      <td>{page.detectedLanguages ? page.detectedLanguages.map((detectedLanguage) => (`${detectedLanguage.languageCode} `)) : "undefined"}</td>
                      <td>{page.blocks ? page.blocks.length : "undefined"}</td>
                      <td>{page.paragraphs ? page.paragraphs.length : "undefined"}</td>
                      <td>{page.lines ? page.lines.length : "undefined"}</td>
                      <td>{page.tokens ? page.tokens.length : "undefined"}</td>
                      <td>{page.tables ? page.tables.length : "undefined"}</td>
                      <td>{page.formFields ? page.formFields.length : "undefined"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Entities Card */}
          <div className="tw--p-4 tw--border tw--rounded">
            <h6 className="tw--text-lg tw--font-bold">Entities</h6>
            <div className="tw--overflow-auto">
              <table className="tw--min-w-full tw--divide-y tw--divide-gray-200">
                <thead className="tw--bg-gray-50">
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Confidence</th>
                    <th>Text</th>
                    <th>Normalized</th>
                    <th>Properties</th>
                  </tr>
                </thead>
                <tbody className="tw--bg-white tw--divide-y tw--divide-gray-200">
                  {doc.entities.map((entity, index) => (
                    <tr key={`${entity.id}-${entity.mentionText}-${index}`}>
                      <td>
                        <button className="tw--text-primary tw--text-sm tw--focus:outline-none" onClick={() => { setOpen(true); setEntity(entity) }}>
                          <i className="material-icons">I</i>
                        </button>
                        {entity.id}
                      </td>
                      <td>{entity.type}</td>
                      <td>{entity.confidence}</td>
                      <td>{entity.mentionText}</td>
                      <td>{entity.normalizedValue ? entity.normalizedValue.text : ""}</td>
                      <td>{entity.properties ? entity.properties.length : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <EntityInfoDialog open={open} entity={entity} close={() => { setOpen(false) }} />
  </div>
  );
}

Details.propTypes = {
  'data': PropTypes.object.isRequired
}

export default Details