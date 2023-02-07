import React, { useEffect, useState } from 'react'
import { MARGIN } from './constants'
import './index.scss'
import { getBestFit } from './utils'
import VideoTile from './VideoTile'

const VideoGrid = ({ videos }) => {
  const containerRef = React.createRef()
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()

  useEffect(() => {
    setWidth(containerRef.current.offsetWidth - (MARGIN * 2))
    setHeight(containerRef.current.offsetHeight - (MARGIN * 2))
  }, [containerRef, height, width])

  const renderVideoTiles = () => {
    const videoWidth = getBestFit(width, height, videos.length, 4/3).width
    return videos.map(() => {
      // eslint-disable-next-line react/jsx-key
      return (
        // eslint-disable-next-line react/jsx-key
          <VideoTile width={videoWidth}/>
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
