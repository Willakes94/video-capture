import { Camera } from "expo-camera"

export interface CameraViewProps{
 cameraRef: React.RefObject<Camera>;
 isRecording: boolean;
 onRecording: () => void;
 onStopRecording: () => void;
};