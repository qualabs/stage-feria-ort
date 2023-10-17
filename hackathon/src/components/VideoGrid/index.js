import React, { useEffect, useState } from 'react'
import totp from 'totp-generator'
import VideoTile from './VideoTile'
import { MARGIN } from './constants'
import './index.scss'
import { getBestFit } from './utils'

const secretKey = "JBSWY3DPEHPK3PXP"

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
      var ttl = Math.round(Date.now() / 1000 % 30)
      setCounter(30 - ttl)
      const token = totp(secretKey, { period: 30 })
      setCurrentTotp(token)
    }, 1000)

    return () => {
      clearInterval(counterInterval)
    }
  }, [counter])

  const renderVideoTiles = () => {
    const videoWidth = getBestFit(width, height, participants.length + 1, 4/3).width
    return participants.map((p, index) => {
      return (
        <VideoTile key={`video-tile-${index}`} data={p} width={videoWidth}/>
      )
    })
  }

  const renderTotpTile = () => {
    const tileWidth = getBestFit(width, height, participants.length + 1, 4/3).width
    return (
      <div
      className='video-tile'
      style={{
        alignItems: 'center',
        background: 'black',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: tileWidth
      }}>
        <div style={{fontSize: '30rem'}}>
          {currentTotp}
        </div>
        <div style={{fontSize: '12rem'}}>
          {counter} segundos
        </div>
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
