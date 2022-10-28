import { useCallback, useRef, useState } from "react"

const CreatePage = () => {
  const imagePreviewRef = useRef(null)

  const [hasImage, setHasImage] = useState(false)

  const onChangeImage = useCallback(
    (event) => {
      const imagePreview = imagePreviewRef.current;
      if (!imagePreview) return;
      const files = event.target.files;
      if (files.length === 1 && files[0].type.match(/^image\//)) {
        imagePreview.src = URL.createObjectURL(files[0]);
        setHasImage(true);
      }
    },
    [imagePreviewRef, setHasImage]
  );

  const onSubmitImage = useCallback(
    (event) => {
      event.preventDefault()
    },
    []
  )

  return (
    <>
      <form onSubmit={onSubmitImage}>
        <input type="file" accept="image/*" capture onChange={onChangeImage}/>
      </form>
      <img hidden={!hasImage} ref={imagePreviewRef} />
    </>
  )
}

export default CreatePage
