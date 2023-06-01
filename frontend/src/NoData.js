function NoData(props) {
  return (
    <div className="tw--flex tw--flex-col tw--flex-grow tw--p-5 tw--bg-white tw--shadow-md tw--rounded">
      <h4 className="tw--text-2xl tw--font-bold">No data.</h4>
      <p className="tw--text-base">
        Load a JSON document from the local file system that is the saved result of a Document AI parse output.
      </p>
    </div>
  );
} 

export default NoData;
