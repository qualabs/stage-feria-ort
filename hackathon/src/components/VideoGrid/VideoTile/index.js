import React from 'react';
import './index.scss';

const VideoTile = ({ data, width }) => {
  return (
    <div className='video-tile' style={{width: width}}>
      <video id={data} playsInline autoPlay muted></video>
    </div>
  )}

export default VideoTile;
