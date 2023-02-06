import React, { useEffect, useState } from 'react'
import { MARGIN, RATIO } from './constants'
import './index.scss'
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
    const width = resize()
    return videos.map(() => {
      return <VideoTile width={width}/>
    });
  }

    // calculate area of video grid:
    const calculateArea = (increment) => {
      let i = 0;
      let w = 0;
      let h = increment * RATIO + (MARGIN * 2);
      while (i < (videos.length)) {
          if ((w + increment) > width) {
              w = 0;
              h = h + (increment * RATIO) + (MARGIN * 2);
              console.log(h)
            }
          w = w + increment + (MARGIN * 2);
          i++;
      }
      if (h > height || increment > width) return false;
      else return increment;
    }

    const resize = () => {
      // loop (i recommend you optimize this)
      let max = 0
      let i = 1
      while (i < 5000) {
          let area = calculateArea(i);
          if (area === false) {
              max = i - 1;
              break;
          }
          i++;
      }

      // remove margins
      max = max - (MARGIN * 2);

      return max
    }

  return (
    <div ref={containerRef} className="video-grid-container">
      {renderVideoTiles()}
    </div>
  )
}

export default VideoGrid
