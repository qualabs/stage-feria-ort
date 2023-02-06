import React, { useEffect, useState } from 'react';
import './App.scss';
import Counter from './components/Counter';
import VideoGrid from './components/VideoGrid';

function App() {
  const [videos, setVideos] = useState([...Array(1).keys()])

  useEffect(() => {
    console.log(videos.length)
  }, [videos])

  return (
    <div className="App">
      <button onClick={() => setVideos([...videos, {}])}>+</button>
      <div className="content">
        <Counter count={videos.length} maxCount={20}/>
        <VideoGrid videos={videos}/>
      </div>
    </div>
  );
}

export default App;
