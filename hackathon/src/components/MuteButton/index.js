import React, { useEffect, useState } from "react";
import { ReactComponent as VolumeMute } from '../../media/icons/volume_mute.svg';
import { ReactComponent as VolumeOff } from '../../media/icons/volume_off.svg';
import './index.scss';

const MuteButton = () => {
  const [mute, setMute] = useState(true)

  useEffect(() => {
    const videos = document.getElementsByTagName('video')
    for (let index = 0; index < videos.length; index++) {
      const element = videos[index];
      element.muted = mute
    }
  }, [mute])

  return (
    <button className="mute-button" onClick={() => setMute(!mute)}>
      {mute ? <VolumeMute/> : <VolumeOff/>}
    </button>
  )
}

export default MuteButton;
