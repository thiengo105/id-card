import React, { useCallback, useRef, useState } from 'react';
import Frame from 'components/Frame/Frame';
import styled from 'styled-components';
import 'antd/dist/antd.css';
import Form from 'components/Form/Form';
import Konva from 'konva';

const Wrapper = styled.div`
  display: flex;
  padding: 40px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding: 15px;
  }
`

const ColLeft = styled.div`
  width: 480px;
  max-width: 100%;
  margin-right: 40px;
`

const ColRight = styled.div`

`

function App() {

  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const frameRef = useRef<Konva.Stage>(null);

  function onDownloadClick() {
    if (frameRef.current) {
      const url = frameRef.current.toDataURL();
      console.log(url);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.png`;
      a.click();
    }
  }

  const onFileChange = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.crossOrigin = "anonymous"
    image.src = url;
    image.onload = () => {
      setImage(image);
    }
  }, []);

  return (
    <Wrapper>
      <ColLeft>
        <Frame ref={frameRef} name={name} image={image} />
      </ColLeft>
      <ColRight>
        <Form
          name={name}
          onFileChange={onFileChange}
          onNameChange={(name) => {
            setName(name);
          }}
          onDownloadClick={onDownloadClick}
        />
      </ColRight>
    </Wrapper>
  );
}

export default App;
