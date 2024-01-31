import { useEffect, useState, useRef } from 'react';
import {Text} from 'react-native';

import {Camera, CameraRecordingOptions} from "expo-camera";

import * as MediaLibrary from "expo-media-library";
import {shareAsync} from "expo-sharing";

import CameraView from './src/components/CameraView';
import VideoPlayer from './src/components/VideoPlayer';

export default function App() {

  const cameraRef = useRef<Camera>(null);
  const[isRecording, setIsRecording] = useState(false);

  const[hasCameraPermission, setHasCameraPermission] = useState(false);

  const [video, setVideo] = useState<any>();

  const[hasMicrophonePermission, setHasMicrophonePermission] = useState(false);

  const[hasMediaLibrayPermission, setHasMediaLibrayPermission] = useState(false);

  useEffect(()=>{
    (async()=>{
      const cameraPermission = await Camera.requestCameraPermissionsAsync();

      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();

      const mediaLibrayPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status == "granted");

      setHasMicrophonePermission(microphonePermission.status == "granted");

      setHasMediaLibrayPermission(mediaLibrayPermission.status == "granted");

    })() 
  },[]);

  if(hasCameraPermission== false || hasMicrophonePermission == false){
    return (
      <Text>Não tem permissão de camera ou audio</Text>
    )
  };

  if(hasMediaLibrayPermission == false){
    return (
      <Text>Não tem acesso a bibliotecas</Text>
    )
  };

  const recordVideo = () =>{
    setIsRecording(true);
    const options: CameraRecordingOptions ={
      quality: "1080p",
      maxDuration: 60,
      mute: false,
    };
    if(cameraRef && cameraRef.current){
    cameraRef.current?.recordAsync(options).then((recordVideo: any)=>{
      setVideo(recordVideo);
      setIsRecording(false);
    });
    };
  };

  const stopRecording = () =>{
    setIsRecording(false);
    if(cameraRef && cameraRef.current){
    cameraRef.current.stopRecording();
    };
  };

  if(video){
    const shareVideo = () =>{
      shareAsync(video.uri).then(()=>{
        setVideo(undefined);
      });
    };

    const saveVideo = () =>{
      MediaLibrary.saveToLibraryAsync(video.uri).then(()=>{
        setVideo(undefined);
      });
    };

    const discardVideo= () =>{
      setVideo(undefined)
    };

    return(
      <VideoPlayer
        video={video}
        onShare={shareVideo}
        onSave={saveVideo}
        onDiscard={discardVideo}
      />
    );
  };



  return (
    <CameraView
      cameraRef={cameraRef}
      isRecording={isRecording}
      onRecording={recordVideo} 
      onStopRecording={stopRecording}
    ></CameraView>
  );
}

