import { Container } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'
import {
  api_key, app_id, measurement_id, messaging_sender_id, storage_bucket,
} from './config'

const firebaseConfig = {
  apiKey: api_key,
  authDomain: 'jason-ren.firebaseapp.com',
  projectId: 'jason-ren',
  storageBucket: storage_bucket,
  messagingSenderId: messaging_sender_id,
  appId: app_id,
  measurementId: measurement_id,
}



const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage()
const storageRef = ref(storage, 'images/plant');

const Photo = () => {
  const [url, setURL] = useState()

  useEffect(() => {
    const uploadPictureButton = document.querySelector(".photo-upload")

    uploadPictureButton.addEventListener('change', function () {
      displayPicture(this);
    });

    const displayPicture = (input) => {
      // console.log(input.value)
      // console.log(input.files[0])
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = async (e) => {
          console.log(e.target.result)
          document.getElementById('the-picture').setAttribute('src', e.target.result);
          uploadString(storageRef, e.target.result, 'data_url').then((snapshot) => {
            console.log('Uploaded a base64 string!');
          });
          await getDownloadURL(storageRef)
            .then((url) => {
              console.log(url)
            })
            .catch((error) => {
              console.log(error)
            });
          // console.log(e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
        // console.log(input.files[0])
      }
    }
  }, [])

  return (
    <>
      <h1 className="w-full text-center">
        Welcome to Plantr!
      </h1>
      <h3 className="w-full text-center">
        choose an image to get started!
      </h3>
      <Container className="d-flex justify-content-center">
        <input
          role="button"
          id="myImage"
          className="w-fit border border-5 d-flex justify-content-center mx-auto photo-upload"
          type="file"
          accept=".png,.jpg,.jpeg,.raw,.eps,.gif,.tif,.tiff,.bmp,.heic"></input>

      </Container>
      <Container>
        <img id="the-picture" width="full" />
      </Container>
    </>
  )
}

export default Photo