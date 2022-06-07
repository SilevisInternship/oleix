import React, { FC, SyntheticEvent, useState } from 'react';
import { Carousel, CloseButton } from 'react-bootstrap';
import '../../assets/scss/components/gallery-view.scss';
import NoImage from '../../assets/png/noimage.png';

interface GalleryViewProps {
  images: string[] | undefined;
}

const GalleryView: FC<GalleryViewProps> = ({ images }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!images || images.length == 0) images = [NoImage];

  const toggleFullscreenMode = () => {
    setIsFullScreen(!isFullScreen);
  };

  const imageNotLoaded = (e: SyntheticEvent<HTMLImageElement>): void => {
    e.currentTarget.src = NoImage;
  };

  return (
    <>
      {isFullScreen && (
        <CloseButton
          onClick={() => setIsFullScreen(false)}
          className="position-fixed m-1 start-1-rem top-1-rem z-index-2001"
          variant="white"
        />
      )}
      <Carousel className={`gallery-view mx-5 mt-5 ${isFullScreen && 'fullscreen'}`}>
        {images?.map((image, idx) => (
          <Carousel.Item key={idx}>
            <img
              onError={imageNotLoaded}
              className="d-block w-100 cursor-pointer"
              src={image || NoImage}
              alt={image ? 'Advert image' : 'No image found'}
              onClick={() => toggleFullscreenMode()}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};

export default GalleryView;
