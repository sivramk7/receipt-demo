import PropTypes from 'prop-types';
import NoData from './NoData';

function JSONPage(props) {
  if (props.data === null) {
    return <NoData />
  }

  return (
    <div className="tw--flex tw--flex-grow tw--overflow-y-auto">
      <div className="tw--m-4 tw--h-full tw--border tw--border-solid tw--rounded">
        <pre>{JSON.stringify(props.data, null, 2)}</pre>
      </div>
    </div>
  );
} 

JSONPage.propTypes = {
  'data': PropTypes.object.isRequired
}

export default JSONPage;
