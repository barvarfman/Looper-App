import React, { useState, useEffect, } from "react";
import './HomePage.scss';
import utilsService from "../../services/utilsService";
import soundStorageService from "../../services/soundStorageService";
import { blobToArrayBuffer, arrayBufferToBlob } from 'blob-util';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import StopIcon from '@material-ui/icons/Stop';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import StopOutlinedIcon from '@material-ui/icons/StopOutlined';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import Modal from "../../cmps/Modal/Modal.jsx"
import Box from "@material-ui/core/Box";
import audio1 from "../../sounds/120_future_funk_beats_25.mp3"
import audio2 from "../../sounds/120_stutter_breakbeats_16.mp3"
import audio3 from "../../sounds/Bass Warwick heavy funk groove on E 120 BPM.mp3"
import audio4 from "../../sounds/electric guitar coutry slide 120bpm - B.mp3"
import audio5 from "../../sounds/FUD_120_StompySlosh.mp3"
import audio6 from "../../sounds/GrooveB_120bpm_Tanggu.mp3"
import audio7 from "../../sounds/MazePolitics_120_Perc.mp3"
import audio8 from "../../sounds/PAS3GROOVE1.03B.mp3"
import audio9 from "../../sounds/SilentStar_120_Em_OrganSynth.mp3"



export function HomePage() {
//Madia screen breakpoints.
  const theme = createTheme({
    breakpoints: {
      values: {
        sm: 300,
        md: 500,
        lg: 750
      },
    },
  })

  // Create all audio elements and store them at sounds state.
  const [sounds, setSounds] = useState({
    audioElement1: { audio: new Audio(audio1), isOn: false, name: 'Funk Beats' },
    audioElement2: { audio: new Audio(audio2), isOn: false, name: 'Break Beats' },
    audioElement3: { audio: new Audio(audio3), isOn: false, name: 'Bass Warwick' },
    audioElement4: { audio: new Audio(audio4), isOn: false, name: 'Electric Guitar' },
    audioElement5: { audio: new Audio(audio5), isOn: false, name: 'Stompy Slosh' },
    audioElement6: { audio: new Audio(audio6), isOn: false, name: 'Tanggu' },
    audioElement7: { audio: new Audio(audio7), isOn: false, name: 'Maze Politics' },
    audioElement8: { audio: new Audio(audio8), isOn: false, name: 'Groove' },
    audioElement9: { audio: new Audio(audio9), isOn: false, name: 'Silent Star' }
  });

  const [mediaRecorder, setMediaRecorder] = useState();

  const [playList, setPlayList] = useState();

  const [isSavedSound, setIsSavedSound] = useState();

  const [record, setRecord] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isRecording, setIsRecording] = useState(false);

  // Get MediaStream object, and create new MediaRecorder, for recording ability.
  useEffect(() => {
    (async () => {
      try {
        let stream = await utilsService.getStream();
        setMediaRecorder(new MediaRecorder(stream));
      } catch (e) {
        setMediaRecorder(false);
        console.log(e);
      }
    })()
  }, [])

  // Check is there are any saved sounds.
  useEffect(() => {
    (async () => {
      const keys = await soundStorageService.getKeys()
      setIsSavedSound((keys.length != 0))
    })()
  }, [])

  function toggleAudioElement(audioElement) {
    setPlayList("");
    // Check if audioElement is waiting to enter setTimeOut function, and cancel his progress. 
    if (sounds[audioElement].clearTimeOut) {
      clearTimeout(sounds[audioElement].clearTimeOut);
    }
    // If audioElement is on, then stop his audio, 
    // else check if other audio element are played, and set setTimeout function.
    if (sounds[audioElement].isOn) {
      setSounds({ ...sounds, [audioElement]: { audio: sounds[audioElement].audio, isOn: false, name: sounds[audioElement].name } });
      sounds[audioElement].audio.pause();
      sounds[audioElement].audio.currentTime = 0;
    } else {
      let timeBeforePlaying = getWaitTimeBeforePlaying();
      setSounds({ ...sounds, [audioElement]: { audio: sounds[audioElement].audio, isOn: true, name: sounds[audioElement].name } });
      if (timeBeforePlaying) {
        let clearTimeout = setTimeout(function () {
          sounds[audioElement].audio.play();
          sounds[audioElement].audio.loop = true;
        }, timeBeforePlaying);
        setSounds({ ...sounds, [audioElement]: { audio: sounds[audioElement].audio, isOn: true, name: sounds[audioElement].name, clearTimeOut: clearTimeout } });
      } else {
        sounds[audioElement].audio.play();
        sounds[audioElement].audio.loop = true;
      }
    }
  }

  // Check if any audio element are played, and return the time for the next cicle. 
  function getWaitTimeBeforePlaying() {
    for (const audioElement in sounds) {
      if (sounds[audioElement].audio.currentTime > 0) {
        return (sounds[audioElement].audio.duration - sounds[audioElement].audio.currentTime) * 1000;
      }
    }
    return 0;
  }

  // Stop all active sounds.
  function stopSound() {
    if (!getWaitTimeBeforePlaying()) {
      return;
    }
    let updatedSounds = {};
    let activeSounds = {}
    for (const audioElement in sounds) {
      if (sounds[audioElement].isOn) {
        // Save all active audio key name.
        activeSounds[audioElement] = true;
      }
      // Update all audio element to off mode.
      updatedSounds[audioElement] = { audio: sounds[audioElement].audio, isOn: false, name: sounds[audioElement].name }
     // Check if audioElement is waiting to enter setTimeOut function, and cancel his progress. 
      if (sounds[audioElement].clearTimeOut) {
        clearTimeout(sounds[audioElement].clearTimeOut);
      }
      sounds[audioElement].audio.pause();
      sounds[audioElement].audio.currentTime = 0;
    }
    setSounds(updatedSounds)
    setPlayList(activeSounds);
  }

  // Update all audio element, Using playList state.
  function playSound() {
    if (!playList) {
      return;
    }
    let updatedSounds = {};
    for (const audioElement in sounds) {
      if (playList[audioElement]) {
        updatedSounds[audioElement] = { audio: sounds[audioElement].audio, isOn: true, name: sounds[audioElement].name }
        sounds[audioElement].audio.play();
        sounds[audioElement].audio.loop = true;
      } else {
        updatedSounds[audioElement] = { audio: sounds[audioElement].audio, isOn: false, name: sounds[audioElement].name }
      }
    }
    setSounds(updatedSounds)
  }

  async function startRecording() {
    if (!mediaRecorder) {
      return;
    }
    setIsRecording(true);
    let chunks = [];
    mediaRecorder.start();
    mediaRecorder.ondataavailable = function (e) {
      // Get all recording data.
      chunks.push(e.data);
    }
    // On recording stoped, create a blob from "chunks" array, and then create audio element.
    mediaRecorder.onstop = function () {
      const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      let audio = new Audio()
      audio.src = audioURL;
      setIsModalOpen(true)
      setIsRecording(false);
      // Convert the blob to arrayBuffer, For storage purposes.
      blobToArrayBuffer(blob).then(function (arrayBuffer) {
        setRecord({ audio, arrayBuffer })
      }).catch(function (err) {
        console.log(err)
      });
    }
  }

  function playRecord() {
    record.audio.play();
  }

  async function saveSound() {
    await soundStorageService.set(record.arrayBuffer);
    setIsSavedSound(true);
  }

  async function playSavedSound() {
    // get arrayBuffer from data base.
    const arrayBuffer = await soundStorageService.get()
    if (arrayBuffer) {
      // Convert arrayBuffer to blob, and then create audio element.
      var blob = arrayBufferToBlob(arrayBuffer, 'audio/ogg; codecs=opus');
      const audioURL = window.URL.createObjectURL(blob);
      let audio = new Audio()
      audio.src = audioURL;
      audio.play();
    } 
  }

  function setIsModalOpenToFalse() {
    setIsModalOpen(false);
  }
  
  // Create all pads.
  const pads = Object.keys(sounds).map((key, idx) =>
    <div key={idx} className={`pad flex align-center justify-center ${sounds[key].isOn ? 'play-sound' : 'stop-sound'}`}
      onClick={() => toggleAudioElement(key)}>{sounds[key].name}</div>
  )

  return (
    <main className="home-page-container flex align-center justify-center">
      <div className="main-looper-container flex align-center justify-center column">
        <div className="sound-control-btn-container flex align-center justify-center">
          {/* If no mediaRecorder object is exist disable record button  */}
          <button disabled={typeof mediaRecorder != "object"} className="record-btn flex align-center justify-center"
          // Make sure there is state for mediaRecorder before calling stop function.
           onClick={isRecording ? () => (mediaRecorder.state != "inactive") && mediaRecorder.stop() : () => startRecording()}>
            <div className="record-logo flex align-center justify-center">
              {
                isRecording ?
                  <ThemeProvider theme={theme}>
                    <Box
                      clone
                      fontSize={{ sm: 16, md: 13, lg: 18 }}
                    >
                      <StopIcon />
                    </Box>
                  </ThemeProvider>

                  :

                  <ThemeProvider theme={theme}>
                    <Box
                      clone
                      fontSize={{ sm: 22, md: 19, lg: 26 }}
                    >
                      <FiberManualRecordIcon />
                    </Box>
                  </ThemeProvider>
              }
            </div>
          </button>
          <button className="play-btn flex align-center justify-center" onClick={() => playSound()}>
            <ThemeProvider theme={theme}>
              <Box
                clone
                fontSize={{ sm: 32, md: 35, lg: 45 }}
              >
                <PlayArrowOutlinedIcon />
              </Box>
            </ThemeProvider>
          </button>
          <button className="stop-btn flex align-center justify-center" onClick={() => stopSound()}>
            <ThemeProvider theme={theme}>
              <Box
                clone
                fontSize={{ sm: 32, md: 35, lg: 45 }}
              >
                <StopOutlinedIcon />
              </Box>
            </ThemeProvider>
          </button>
        </div>
        <div className="looper-container flex space-between">
          {pads}
        </div>
        <Modal isModalOpen={isModalOpen} setIsModalOpenToFalse={setIsModalOpenToFalse} playRecord={playRecord} saveSound={saveSound} />
      </div>
      {
        isSavedSound &&
        <button className="play-saved-sound flex align-center justify-center" onClick={() => playSavedSound()}><span>PLAY</span>
          <ThemeProvider theme={theme}>
            <Box
              clone
              fontSize={{ sm: 16, md: 20, lg: 20 }}
            >
              <BookmarkIcon />
            </Box>
          </ThemeProvider>

        </button>
      }
    </main>
  );
}

