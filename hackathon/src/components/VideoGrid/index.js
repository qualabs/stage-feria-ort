import React, { useEffect, useState } from 'react'
import totp from 'totp-generator'
import VideoTile from './VideoTile'
import { MARGIN } from './constants'
import './index.scss'
import { getBestFit } from './utils'

const secretKey = "JBSWY3DPEHPK3PXP"
const AWS_API_SELFIES = "https://xa4unlsrm8.execute-api.us-east-1.amazonaws.com/11oct"

const VideoGrid = ({ participants }) => {
  const containerRef = React.createRef()
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()
  const [counter, setCounter] = useState(0)
  const [currentTotp, setCurrentTotp] = useState('')
  const [selfies, setSelfies] = useState([]);
  const tileWidth = getBestFit(width, height, participants.length + selfies.length + 1, 4/3).width

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

  useEffect(() => {
    const getSelfies = async () => {
      const response = await fetch(`${AWS_API_SELFIES}/getselfies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const jsonResponse = await response.json()
      setSelfies(jsonResponse.selfiesList);
    }

    getSelfies().catch(console.error);
  }, [])

  const renderVideoTiles = () => {
    return participants.map((p, index) => {
      return (
        <VideoTile key={`video-tile-${index}`} data={p} width={tileWidth}/>
      )
    })
  }

  const renderSelfiesTiles = () => (
    selfies.map((selfie, i) => {
      return (
        <div
        key={i}
        style={{backgroundSize: 'cover'}}>
          <img
          key={i}
          alt='Selfie'
          src={`https://stand.qualabs.dev/${selfie}`}
          className='video-tile'
          style={{
            alignItems: 'center',
            background: 'black',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: tileWidth
          }}/>
        </div>
      )
    })
  )

  const renderTotpTile = () => {
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
        <div style={{fontSize: '6rem'}}>
          {currentTotp}
        </div>
        <div style={{fontSize: '1.8rem'}}>
          {counter} segundos
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="video-grid-container">
      {renderVideoTiles()}
      {renderSelfiesTiles()}
      {renderTotpTile()}
    </div>
  )
}

export default VideoGrid
