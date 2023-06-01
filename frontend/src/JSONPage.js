import PropTypes from 'prop-types';
import NoData from './NoData';

function JSONPage(props) {
  if (props.data === null) {
    return <NoData />
  }

  return (
    <div className="flex flex-grow overflow-y-auto">
      <div className="m-4 h-full border border-solid rounded">
        <pre>{JSON.stringify(props.data, null, 2)}</pre>
      </div>
    </div>
  );
} 

JSONPage.propTypes = {
  'data': PropTypes.object.isRequired
}

export default JSONPage;
