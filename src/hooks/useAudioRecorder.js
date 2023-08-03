const useAudioRecorder = () => {
  let audioBlobs = [];
  let mediaRecorder;
  let streamBeingCaptured;

  const start = async () => {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      return Promise.reject(
        new Error('mediaDevices API or getUserMedia method is not supported in this browser.')
      );
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamBeingCaptured = stream;
      mediaRecorder = new MediaRecorder(stream);
      audioBlobs = [];

      mediaRecorder.ondataavailable = (event) => {
        audioBlobs.push(event.data);
      };

      mediaRecorder.start();
    }
  };

  const stopStream = () => {
    streamBeingCaptured.getTracks().forEach((track) => {
      track.stop();
    });
  };

  const resetRecordingProperties = () => {
    mediaRecorder = null;
    streamBeingCaptured = null;
  };

  const stop = () => {
    return new Promise((resolve) => {
      let mimeType = mediaRecorder.mimeType;

      mediaRecorder.onstop = (event) => {
        let audioBlob = new Blob(audioBlobs, { type: mimeType });

        resolve(audioBlob);

        stopStream();
        resetRecordingProperties();
      };

      mediaRecorder.stop();
    });
  };

  const cancel = () => {};

  return { start, stop, cancel };
};

export default useAudioRecorder;
