import React, { FC, useCallback, useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { Col, Row, Stack, Image } from 'react-bootstrap';
import { XLg } from 'react-bootstrap-icons';
import { FileObject } from '../../interfaces/FileObject';
import PopupModal from '../PopupModal/PopupModal';
import Loader from '../Loader/Loader';
import toastr from 'toastr';
import { ImageObject } from '../../interfaces/DetailedAdvertListItemResponse';
import axios from 'axios';

interface DropZoneProps {
  uploadCallback: (newFile: File) => void;
  removeCallback: (file: File) => void;
  acceptedExtensions: Accept;
  alreadyUploaded?: ImageObject[];
  removeAlreadyUploadedCallback?: (image: ImageObject) => void;
}

const DropZone: FC<DropZoneProps> = ({
  uploadCallback,
  removeCallback,
  acceptedExtensions,
  alreadyUploaded,
  removeAlreadyUploadedCallback,
}) => {
  const MAX_FILE_SIZE = 4 * 1024 * 1024;
  const [files, setFiles] = useState<FileObject[]>([]);
  const [state, setState] = useState({
    showPopupModal: false,
    isLoading: false,
    isDropping: false,
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setState({ ...state, isLoading: true, isDropping: false });

    const uploaded = await Promise.all(
      acceptedFiles.map(async (file: File, index): Promise<FileObject> => {
        if (files.find((f) => f.file.name === file.name) === undefined) {
          await uploadCallback(file);
        }

        if (index === acceptedFiles.length - 1) {
          setState({ ...state, isLoading: false });
        }

        return { path: URL.createObjectURL(file), file: file };
      })
    );

    setFiles((prev) => [...uploaded, ...prev]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedExtensions,
    maxFiles: 6,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
    onDragEnter: () => setState({ ...state, isDropping: true }),
    onDragLeave: () => setState({ ...state, isDropping: false }),
    onDropRejected: () => toastr.error('Selected files are not image type'),
  });

  const removeFile = (file: File) => {
    if (!file) {
      return;
    }

    setFiles([...files.filter((f) => f.file.name != file.name)]);
    removeCallback(file);
    setState({ ...state, showPopupModal: false });
  };

  const removeAlreadyUploadedImage = async (image: ImageObject) => {
    if (!image) {
      return;
    }

    try {
      await axios.delete(`/api/images/${image?.imageId || null}`);
    } finally {
      if (removeAlreadyUploadedCallback) {
        removeAlreadyUploadedCallback(image);
      }
    }
  };

  return (
    <>
      <Row>
        <Col>
          <div
            className={`drop-zone d-flex flex-column align-items-center justify-content-center py-4 cursor-pointer ${
              state.isDropping ? 'is-dropping' : ''
            }`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {!state.isDropping && <p className="mb-0">Drag files into this area (Max 4MB)</p>}
            {state.isDropping && <p>Drop your files here</p>}
            {state.isLoading && <Loader small={true} />}
          </div>
        </Col>
      </Row>

      {(files && files.length > 0) || (alreadyUploaded && alreadyUploaded.length > 0) ? (
        <Stack className="mt-2" direction="horizontal" gap={2}>
          <>
            {alreadyUploaded &&
              alreadyUploaded.length > 0 &&
              alreadyUploaded.map((image) => (
                <div key={image.imageId}>
                  <Row>
                    <Col
                      className="icon-parent d-flex gap-2 flex-column align-items-center cursor-pointer"
                      onClick={() => setState({ ...state, showPopupModal: true })}
                    >
                      <XLg className="image-icon" />
                      <Image className="size-100-px object-fit-cover" src={image.imageUrl} />
                    </Col>
                  </Row>

                  <PopupModal
                    title="Delete uploaded image"
                    show={state.showPopupModal}
                    onAccept={() => removeAlreadyUploadedImage(image)}
                    onCancel={() => setState({ ...state, showPopupModal: false })}
                    buttonAcceptContent="Remove"
                  >
                    <p>Do you really want to delete this image?</p>
                  </PopupModal>
                </div>
              ))}

            {files.map((file) => (
              <div key={file.path}>
                <Row>
                  <Col
                    className="icon-parent d-flex gap-2 flex-column align-items-center cursor-pointer"
                    onClick={() => setState({ ...state, showPopupModal: true })}
                  >
                    <XLg className="image-icon" />
                    <Image className="size-100-px object-fit-cover" src={file.path} />
                  </Col>
                </Row>

                <PopupModal
                  title="Delete uploaded image"
                  show={state.showPopupModal}
                  onAccept={() => removeFile(file.file)}
                  onCancel={() => setState({ ...state, showPopupModal: false })}
                  buttonAcceptContent="Remove"
                >
                  <p>Do you really want to delete this uploaded image?</p>
                </PopupModal>
              </div>
            ))}
          </>
        </Stack>
      ) : (
        <p>Upload some files using drop zone or file select.</p>
      )}
    </>
  );
};

export default DropZone;
