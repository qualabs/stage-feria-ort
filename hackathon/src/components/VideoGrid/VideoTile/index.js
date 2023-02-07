import React from 'react';
import './index.scss';

const VideoTile = ({ children, width }) => {

  return (
    <div className='video-tile' style={{width: width}}>
      {children}
    </div>
  )}

export default VideoTile;
