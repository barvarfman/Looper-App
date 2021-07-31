export default {
  getStream
}

// Returns a Promise that resolves to a MediaStream object.
// If the user denies permission,promise is rejected.
async function getStream() {
  let stream = "";
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      console.log('The following getUserMedia error occurred: ' + err);
    }
  } 
  return stream;
}





