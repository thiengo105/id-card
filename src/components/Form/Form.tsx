import { Button, Form, Input, Space, Upload, UploadFile } from "antd";
import React, { useEffect, useState } from "react";

type InfoFormProps = {
  name: string,
  onFileChange(file: File): void,
  onNameChange(name: string): void,
  onDownloadClick(): void
}

const InfoForm: React.FC<InfoFormProps> = ({ name, onFileChange, onNameChange, onDownloadClick }) => {

  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

  useEffect(() => {
    if (fileList.length === 1 && fileList[0].originFileObj) {
      onFileChange(fileList[0].originFileObj);
    }
  }, [fileList, onFileChange]);

  function onValuesChange(_: any, values: any) {
    onNameChange(values.name);
  }

  return (
    <div>
      <Form layout="vertical" onValuesChange={onValuesChange}>
        <Form.Item label="Họ và tên" name="name" initialValue={name}>
          <Input />
        </Form.Item>
      </Form>
      <Space direction="horizontal">
        <Upload
          maxCount={1}
          fileList={fileList}
          onChange={(info) => {
            setFileList(info.fileList);
          }}
          beforeUpload={() => false}
          showUploadList={false}
        >
          <Button type="primary" size="large" block>Chọn ảnh</Button>
        </Upload>
        <Button type="primary" size="large" block onClick={onDownloadClick}>Tải xuống</Button>
      </Space>
    </div>
  )
}

export default InfoForm;