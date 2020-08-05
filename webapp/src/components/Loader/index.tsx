import React from 'react';
import MDSpinner from 'react-md-spinner';
interface LoaderProps {
  size: number;
  color?: string;
  className?: string;
}

const Loader: React.FunctionComponent<LoaderProps> = ({
  size,
  color,
  className,
}) => (
  <div className={className}>
    <MDSpinner size={size} singleColor={color || '#000000'} borderSize={6} />
  </div>
);

export default Loader;