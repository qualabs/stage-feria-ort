import React from 'react';
import './index.scss';
import video from './video.mp4';

const VideoTile = ({ width }) => {
  return (
    <div className='video-tile' style={{width: width}}>
      <video src={video} />
    </div>
  )}

export default VideoTile;
