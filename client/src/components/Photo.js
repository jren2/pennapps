import { Container } from 'react-bootstrap'
import { useState, useEffect } from 'react'

const Photo = () => {
  const [url, setURL] = useState()

  useEffect(() => {
    const uploadPictureButton = document.querySelector(".photo-upload")

    uploadPictureButton.addEventListener('change', function () {
      displayPicture(this);
    });

    const displayPicture = (input) => {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          document.getElementById('the-picture').setAttribute('src', e.target.result);
          console.log(e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
        console.log(input.files[0])
      }
    }
  })

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
          accept=".png,.jpg,.jpeg,.raw,.eps,.gif,.tif,.tiff,.bmp"></input>

      </Container>
      <Container>
        <img id="the-picture" width="full" />
      </Container>
    </>
  )
}

export default Photo