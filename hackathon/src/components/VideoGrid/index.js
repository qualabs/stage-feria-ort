import base32 from 'hi-base32'
import React, { useEffect, useState } from 'react'
import totp from 'totp-generator'
import VideoTile from './VideoTile'
import { MARGIN } from './constants'
import './index.scss'
import { getBestFit } from './utils'

const secretKey = "A4BBMN3543BKJ4B2KFB4783RHYHCOINE"

const VideoGrid = ({ participants }) => {
  const containerRef = React.createRef()
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()
  const [counter, setCounter] = useState(0)
  const [currentTotp, setCurrentTotp] = useState('')

  useEffect(() => {
    setWidth(containerRef.current.offsetWidth - (MARGIN * 2))
    setHeight(containerRef.current.offsetHeight - (MARGIN * 2))
  }, [containerRef, height, width])

  useEffect(() => {
    const counterInterval = setInterval(() => {
      if (counter > 0) {
        setCounter(counter - 1)
      } else {
        setCounter(30)
        const base32Key = base32.encode(secretKey)
        const token = totp(base32Key)
        setCurrentTotp(token)
      }
    }, 1000)

    return () => {
      clearInterval(counterInterval)
    }
  }, [counter])

  const renderVideoTiles = () => {
    const videoWidth = getBestFit(width, height, participants.length, 4/3).width
    return participants.map((p, index) => {
      return (
        <VideoTile key={`video-tile-${index}`} data={p} width={videoWidth}/>
      )
    })
  }

  const renderTotpTile = () => {
    const tileWidth = getBestFit(width, height, participants.length, 4/3).width
    return (
      <div
      className='video-tile'
      style={{
        alignItems: 'center',
        background: 'black',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        fontSize: '62px',
        width: tileWidth
      }}>
        {currentTotp}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="video-grid-container">
      {renderVideoTiles()}
      {renderTotpTile()}
    </div>
  )
}

export default VideoGrid
