import { JanusPluginHandle, JanusSession } from 'minijanus';
import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import VideoGrid from './components/VideoGrid';

const ROOM_ID = 1234
const SERVER_URL = 'wss://webrtc.qualabs.dev/ws'

let pc;
const ws = new WebSocket(SERVER_URL, 'janus-protocol');
const session = new JanusSession(ws.send.bind(ws));
const handle = new JanusPluginHandle(session);
const handleSubs = new JanusPluginHandle(session);


function App() {
  const [participants, _setParticipants] = useState([])
  const participantsRef = useRef(participants)
  const setParticipants = data => {
    participantsRef.current = data
    _setParticipants(data)
  }

  const subscribe = (participantIds) => {
    setParticipants([...participantsRef.current, ...participantIds])
    if (participantIds.length === 0)
      return

    if (!pc) {
      handleSubs.attach("janus.plugin.videoroom")
        .then(() => handleSubs.sendMessage({
          request: 'join',
          room: ROOM_ID,
          ptype: 'subscriber',
          use_msid: true,
          streams: participantIds.map(p => ({feed: p}))
        }))
    }
    else {
      handleSubs.sendMessage({
        request: 'subscribe',
        streams: participantIds.map(p => ({feed: p}))
      })
    }
  }

  const unsubscribe = (participantId) => {
    let ps = [...participantsRef.current]
    ps = ps.filter(p => p !== participantId)
    setParticipants(ps)

    handleSubs.sendMessage({
      request: 'unsubscribe',
      streams: [{feed: participantId}]
    })
  }

  const start = () => {
    handle.on('event', (e) => publisherDataHandler(e));
    handleSubs.on('event', (e) => signalingDataHandler(e));
    session.on('trickle', ({candidate}) => {
      if (candidate.candidate)
        pc.addIceCandidate(candidate);
    } )

    ws.addEventListener("message", ev => session.receive(JSON.parse(ev.data)));
    ws.addEventListener("open", () => {
      session.create()
        .then(() => handle.attach("janus.plugin.videoroom"))
        .then(() => handle.sendMessage({request: 'join', room: ROOM_ID, ptype: 'publisher'}))
        .then(() => { console.info("Connected to Janus: "); })
        .catch(e => { console.error("Error connecting to Janus: ", e); });
    });

  }

  const sendAnswer = () => {
    console.log("Sending answer");
    pc.createAnswer().then(setAndSendLocalDescription, (error) => {
      console.error("Send answer failed: ", error);
    });
  };

  const setAndSendLocalDescription = (sessionDescription) => {
    pc.setLocalDescription(sessionDescription);
    console.log("Local description set");
    handleSubs.send("message", {
      body: {
        request: "start"
      },
      jsep: sessionDescription
    })
  };

  const signalingDataHandler = (data) => {
    const {plugindata, jsep} = data
    if (plugindata.data.videoroom === "attached") {
      createPeerConnection();
      pc.setRemoteDescription(jsep);
      sendAnswer();
    }
    if (plugindata.data.videoroom === "updated") {
      if (jsep) {
        pc.setRemoteDescription(jsep);
        sendAnswer();
      }
    }
  };

  const publisherDataHandler = (data) => {
    const {plugindata} = data

    if (plugindata.data.publishers) {
      console.log('New publishers: ', plugindata.data.publishers);
      const newParticipants = plugindata.data.publishers.map(p => p.id)
      subscribe(newParticipants)
    }

    if (plugindata.data.leaving) {
      const leaving = plugindata.data.leaving
      console.log('Publisher leaving: ', leaving);
      unsubscribe(leaving)
    }
  };

  const createPeerConnection = () => {
    try {
      pc = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          }
        ],
      });
      pc.onicecandidate = onIceCandidate;
      pc.ontrack = onTrack;
      console.log("PeerConnection created");
    } catch (error) {
      console.error("PeerConnection failed: ", error);
    }
  };

  const onIceCandidate = (event) => {
    if (event.candidate) {
      console.log("Sending ICE candidate");
    }
  }

  const onTrack = (event) => {
    const stream = event.streams[0]
    const video = document.getElementById(stream.id)
    video.srcObject = stream
  };

  useEffect(() => {
    start()
  }, [])


  return (
    <div className='App'>
      <div className='content'>
        <VideoGrid participants={participants} />
      </div>
    </div>
  );
}

export default App;
