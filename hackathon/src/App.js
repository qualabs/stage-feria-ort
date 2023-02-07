import React, { useState } from 'react';
import './App.scss';
import Counter from './components/Counter';
import Fireworks from './components/Fireworks';
import MuteButton from './components/MuteButton';
import VideoGrid from './components/VideoGrid';
import video from './media/videos/video.mp4';

const MAX_COUNT = 3

function App() {
  const [videos, setVideos] = useState([])

  const renderCounter = () => {
    if(videos.length >= MAX_COUNT) {
      return <Fireworks/>
    }
    return (<Counter count={videos.length} maxCount={MAX_COUNT}/>)
  }

  const addVideo = (video) => {
    setVideos([...videos, ...[video]])
  }

  return (
    <div className="App">
      <button className="add-videos" onClick={() => addVideo(<video src={video} autoPlay />)}>+</button>
      <MuteButton/>
      {renderCounter()}
      <div className="content">
        <VideoGrid>
          {videos}
        </VideoGrid>
      </div>
    </div>
  );
}

export default App;
