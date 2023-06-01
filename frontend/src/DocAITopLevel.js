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
import { useState } from "react";
import Search from "./Search";
import Details from "./Details";
import JSONPage from "./JSONPage";
import DocAIView from "./DocAIView";
import FilePreview from "./FilePreview";
//import PropTypes from 'prop-types';

/**
 * props:
 * - None
 * @param {*} props
 * @returns
 */
function DocAITopLevel(props) {
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [fileType, setFileType] = useState("invoice");
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  function tabChange(event, newValue) {
    setTabValue(newValue);
  }

  function handleFileTypeChange(event) {
    setFileType(event.target.value);
  }

  function loadJson(event) {
    //debugger;
    setTabValue(0)
    setData(null)
    setFile(null);
    setUploadedFile(null);
    if (event.target.files.length === 0) {
      setData(null);
      return;
    }

    const file = event.target.files[0];
    setFile(file);
    setUploadedFile(file);
  }

  async function processFile() {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_type", fileType);

      // For local
        const request = await fetch("http://127.0.0.1:5000/upload/", {
        // For prod
        // const request = await fetch("/upload/", {
          method: "POST",
          body: formData,
        });
      const response = await request.json();
      setData(response);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setData(null);
      }
  }
  return (
    <div className="tw--h-full tw--flex tw--flex-col">
      <div className="tw--sticky tw--top-0">
        <div className="tw--flex tw--justify-end tw--px-6 tw--py-3 tw--bg-blue-600 tw--text-white">
          <div className="tw--flex tw--items-center">
            <select
              value={fileType}
              onChange={handleFileTypeChange}
              className="tw--mr-4 tw--text-black tw--border-none tw--outline-none"
            >
              <option value="invoice">Invoice</option>
              <option value="expense">Expense</option>
              <option value="t4-tax-document">T4 Tax document</option>
              <option value="bank-statement">Bank Statement</option>
            </select>
            <label htmlFor="contained-button-file">
              <span className=" tw--mr-4">Load Image/PDF</span>
            </label>
            <input
              style={{ display: "none" }}
              accept=".png,.jpg,.pdf,.jpeg"
              id="contained-button-file"
              multiple
              type="file"
              disabled={loading}
              onChange={loadJson}
            />
            <button disabled={!uploadedFile} className="tw--bg-white tw--text-black tw--px-2 tw--py-2" onClick={processFile}>
              {loading ? "Processing..." : "Process"}
            </button>
          </div>
        </div>
        <div className="tw--flex tw--justify-around tw--py-2 tw--bg-blue-500 tw--text-white">
          <button onClick={() => setTabValue(0)}>Document</button>
          <button onClick={() => setTabValue(1)}>JSON</button>
          <button onClick={() => setTabValue(2)}>Details</button>
          <button onClick={() => setTabValue(3)}>Search</button>
        </div>
      </div>
      <div className="tw--flex-grow tw--flex-shrink tw--overflow-hidden tw--flex tw--flex-col">
        {uploadedFile && !data && <FilePreview file={uploadedFile} />}
        {tabValue === 0 && <DocAIView data={data} />}
        {tabValue === 1 && <JSONPage data={data} />}
        {tabValue === 2 && <Details data={data} />}
        {tabValue === 3 && <Search data={data} />}
      </div>
    </div>
  );
} // DocAITopLevel

DocAITopLevel.propTypes = {};

export default DocAITopLevel;
