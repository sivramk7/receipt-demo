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
import {
  AppBar,
  Input,
  Toolbar,
  Box as Card,
  Button,
  Typography,
  Tab,
  Tabs,
  Divider,
  IconButton,
  responsiveFontSizes,
} from "@mui/material";
import Search from "./Search";
import Details from "./Details";
import JSONPage from "./JSONPage";
import DocAIView from "./DocAIView";
import AboutDialog from "./About";
import HelpIcon from "@mui/icons-material/Help";
import { Select, MenuItem } from "@mui/material";
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
        // const request = await fetch("http://127.0.0.1:5000/upload/", {
        // For prod
        const request = await fetch("/upload/", {
          method: "POST",
          body: formData,
        });
      const response = await request.json();
      setData(response);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(`ERROR: ${e}`);
      setData(null);
      }
  }
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, width: 70 }}>
            Doc AI
          </Typography>
          <Select
            value={fileType}
            onChange={handleFileTypeChange}
            sx={{
              marginRight: "8px",
              color: "white",
              "& .MuiSvgIcon-root": {
                color: "white",
              },
              "&:focus": {
                outline: "none",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <MenuItem value="invoice">Invoice</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="t4-tax-document">T4 Tax document</MenuItem>
            <MenuItem value="bank-statement">Bank Statement</MenuItem>
          </Select>
          <label htmlFor="contained-button-file">
            <Input
              style={{ display: "none" }}
              accept=".png,.jpg,.pdf,.jpeg"
              id="contained-button-file"
              multiple
              type="file"
              disabled={loading}
              onChange={loadJson}
            />
            <Button color="inherit" component="span">
              Load Image/PDF
            </Button>
          </label>
          <Button disabled={!uploadedFile} color="inherit" component="span" onClick={processFile}>
            {loading ? "Processing..." : "Process"}
          </Button>
        </Toolbar>
      </AppBar>
      <Tabs value={tabValue} onChange={tabChange}>
        <Tab label="Document" />
        <Tab label="JSON" />
        <Tab label="Details" />
        <Tab label="Search" />
      </Tabs>
      <Divider />
      <Card
        variant="outlined"
        sx={{
          flexGrow: 1,
          flexShrink: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {uploadedFile && !data && <FilePreview file={uploadedFile} />}
        {tabValue === 0 && <DocAIView data={data} />}
        {tabValue === 1 && <JSONPage data={data} />}
        {tabValue === 2 && <Details data={data} />}
        {tabValue === 3 && <Search data={data} />}
      </Card>
      <AboutDialog open={aboutOpen} close={() => setAboutOpen(false)} />
    </Card>
  );
} // DocAITopLevel

DocAITopLevel.propTypes = {};

export default DocAITopLevel;
