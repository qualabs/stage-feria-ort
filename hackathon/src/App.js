import React, { useState } from 'react';
import './App.scss';
import Counter from './components/Counter';
import Fireworks from './components/Fireworks';
import MuteButton from './components/MuteButton';
import VideoGrid from './components/VideoGrid';

const MAX_COUNT = 3

function App() {
  const [videos, setVideos] = useState([...Array(0).keys()])

  const renderCounter = () => {
    if(videos.length >= MAX_COUNT) {
      return <Fireworks/>
    }
    return (<Counter count={videos.length} maxCount={MAX_COUNT}/>)

  }

  return (
    <div className="App">
      <button className="add-videos" onClick={() => setVideos([...videos, {}])}>+</button>
      <MuteButton/>
      {renderCounter()}
      <div className="content">
        <VideoGrid videos={videos}/>
      </div>
    </div>
  );
}

export default App;
