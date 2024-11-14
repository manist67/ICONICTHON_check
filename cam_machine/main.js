import axios from "axios";

const startAudio = document.getElementById('start-button');
const startCamera = document.getElementById('start-camera');


(() => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Media Device not supported");
    return;
  }
  const camInit = (stream) => {
    const cameraView = document.getElementById("cameraview");
    const cameraCanvas = document.getElementById("cameracanvas");

    cameraView.style.transform = "scaleX(-1)";
    cameraCanvas.style.transform = "scaleX(-1)";
    cameraView.srcObject = stream;
    cameraView.play();
    sendImageToServer();
  }

  const camInitFailed = (error) => {
    console.log("카메라 권한 설정 실패: ", error);
  }
  

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(camInit)
    .catch(camInitFailed);

})();

let animation = null;
let frame = 0 ;
function sendImageToServer() {
  if(frame++ % 60 == 0) {
    var cameraView = document.getElementById("cameraview");
    var cameraCanvas = document.getElementById("cameracanvas");
    var context = cameraCanvas.getContext("2d");
  
    // Set canvas size to match video size
    context.drawImage(cameraView, 0, 0, cameraCanvas.width, cameraCanvas.height);
    var imageBase64 = cameraCanvas.toDataURL("image/png");
    
    axios.post("http://localhost:3000/upload/image", {
      file: imageBase64,
      studentId: 10
    });
  }
  animation = requestAnimationFrame(()=>sendImageToServer());
}


startAudio.addEventListener("click", async function() {
  // Check if the browser supports the required APIs
  if (!window.AudioContext || 
    !window.MediaStreamAudioSourceNode || 
    !window.AudioWorkletNode) {
    alert('Your browser does not support the required APIs');
    return;
  }
  
  const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(micStream);

  mediaRecorder.ondataavailable = (e) => {
    const chunks = [e.data];

    const blob = new Blob(chunks, { type: "audio/mpeg-3" });
    const reader = new FileReader();
      
    reader.readAsDataURL(blob); 
    reader.onloadend = async () => {
      const base64data = reader.result;
      // base64 converted!
      console.log(base64data);
      await axios.post("http://localhost:3000/upload/audio", {
        file: base64data,
        studentId: 10
      })
    }
  };

  mediaRecorder.start();

  setTimeout(()=>{
    mediaRecorder.stop();
  }, 2000);
})