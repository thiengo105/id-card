import React, { useCallback, useRef, useState } from 'react';
import Frame from 'components/Frame/Frame';
import styled from 'styled-components';
import 'antd/dist/antd.css';
import Form from 'components/Form/Form';
import Konva from 'konva';
import { uploadToCloudinary } from 'services/upload';
import { Modal } from 'antd';

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
  const [loading, setLoading] = useState(false);

  function resetData() {
    setName("");
    setImage(null);
  }

  async function onDoneClick() {
    if (frameRef.current) {
      setLoading(true);
      const fileName = `${name}.png`
      const url = frameRef.current.toDataURL();
      frameRef.current.toBlob({
        async callback(blob) {
          const file = new File([blob], fileName);
          await uploadToCloudinary(file);
          setLoading(false);
          resetData();
          Modal.confirm({
            type: "success",
            title: "Đã tải lên ảnh thẻ tình nguyện viên",
            content: `Cảm ơn ${name} nha! Bạn có muốn tải ảnh xuống không?`,
            okText: "OK tải đi",
            cancelText: "Thôi khỏi",
            onOk: () => {
              const a = document.createElement("a");
              a.href = url;
              a.download = fileName;
              a.click();
            }
          })
        },
      });

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
          loading={loading}
          hasImage={!!image}
          onFileChange={onFileChange}
          onNameChange={(name) => {
            setName(name);
          }}
          onDoneClick={onDoneClick}
        />
      </ColRight>
    </Wrapper>
  );
}

export default App;
