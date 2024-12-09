import PropTypes from "prop-types";

const Shimmer = ({ rows = 5 }) => {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="space-y-4">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
};

Shimmer.propTypes = {
  rows: PropTypes.number,
};

export default Shimmer;
