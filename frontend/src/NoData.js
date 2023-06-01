function NoData(props) {
  return (
    <div className="flex flex-col flex-grow p-5 bg-white shadow-md rounded">
      <h4 className="text-2xl font-bold">No data.</h4>
      <p className="text-base">
        Load a JSON document from the local file system that is the saved result of a Document AI parse output.
      </p>
    </div>
  );
} 

export default NoData;
