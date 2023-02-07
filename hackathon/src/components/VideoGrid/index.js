import React, { Children, useEffect, useState } from 'react'
import { MARGIN } from './constants'
import './index.scss'
import { getBestFit } from './utils'
import VideoTile from './VideoTile'

const VideoGrid = ({ children }) => {
  const childrenArray = Children.toArray(children);
  const containerRef = React.createRef()
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()

  useEffect(() => {
    setWidth(containerRef.current.offsetWidth - (MARGIN * 2))
    setHeight(containerRef.current.offsetHeight - (MARGIN * 2))
  }, [containerRef, height, width])

  const renderVideoTiles = () => {
    const videoWidth = getBestFit(width, height, childrenArray.length, 4/3).width
    return Children.map(childrenArray, (video, index) => {
      return (
          <VideoTile key={`video-tile-${index}`} width={videoWidth}>
            {video}
          </VideoTile>
      )
    });
  }

  return (
    <div ref={containerRef} className="video-grid-container">
      {renderVideoTiles()}
    </div>
  )
}

export default VideoGrid
