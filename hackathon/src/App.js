import { JanusPluginHandle, JanusSession } from 'minijanus';
import React, { useEffect, useState } from 'react';
import './App.scss';
import Counter from './components/Counter';
import Fireworks from './components/Fireworks';
import MuteButton from './components/MuteButton';
import VideoGrid from './components/VideoGrid';
import video from './media/videos/video.mp4';

const MAX_COUNT = 3
const ROOM_ID = 1234
const SERVER_URL = 'wss://webrtc.qualabs.dev/ws'

const ws = new WebSocket(SERVER_URL, 'janus-protocol');
const session = new JanusSession(ws.send.bind(ws));
const handle = new JanusPluginHandle(session);

const start = () => {
  console.log("Hola");
  ws.addEventListener('message', ev => session.receive(JSON.parse(ev.data)));
  ws.addEventListener('open', () => {
    session.create()
      .then(() => {
        handle.attach('janus.plugin.videoroom').then(handle.sendMessage({request: 'listparticipants', room: ROOM_ID}))
      })
      // .then(handle.sendMessage({request: 'listparticipants', room: ROOM_ID}))
      // .then(d => {
      //   const participants = d.plugindata.data.participants
      //   handle.sendMessage({
      //     request: 'join',
      //     room: ROOM_ID,
      //     ptype: 'subscriber',
      //     streams: participants.map(p => ({feed: p.id}))
      //   }).then(d => {
      //     console.log(d);
      //   })
      //   })
      // .then(() => { console.info('Connected to Janus: '); })
      // .catch(e => { console.error('Error connecting to Janus: ', e); });
  });
}

function App() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    start()
  }, [start])


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
    <div className='App'>
      <button className='add-videos' onClick={() => addVideo(<video src={video} autoPlay />)}>+</button>
      <MuteButton/>
      {renderCounter()}
      <div className='content'>
        <VideoGrid>
          {videos}
        </VideoGrid>
      </div>
    </div>
  );
}

export default App;
