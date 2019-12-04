import React, {useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import styled from 'styled-components';

// function MyDropzone({handleImages}) {
//   const onDrop = useCallback((acceptedFiles) => {
//     const reader = new FileReader();

//     reader.onabort = () => console.log('file reading was aborted');
//     reader.onerror = () => console.log('file reading has failed');
//     reader.onload = () => {
//       // Do whatever you want with the file contents
//       const binaryStr = reader.result;
//       console.log(binaryStr);
//     };
//     handleImages(acceptedFiles);
//     acceptedFiles.forEach((file) => reader.readAsArrayBuffer(file));
//   }, []);
//   const {getRootProps, getInputProps} = useDropzone({onDrop});

//   return (
//     <div {...getRootProps()} id='image-border'>
//       <input {...getInputProps()} />
//       <p>Drag 'n' drop some files here, or click to select files</p>
//     </div>
//   );
// }

// isDragActive

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
};


const getColor = (props) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return '#eeeeee';
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

function CustomImage(props) {
  const [files, setFiles] = useState([]);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          props.handleImages(acceptedFiles);
        };
        reader.readAsDataURL(file);
      });
      setFiles(acceptedFiles.map((file) => Object.assign(file, {
        preview: URL.createObjectURL(file),
      })));
    },
  });

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <div className="container">
      <Container {...getRootProps({isDragActive,
        isDragAccept,
        isDragReject,
        className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </Container>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </div>
  );
}

export default CustomImage;
