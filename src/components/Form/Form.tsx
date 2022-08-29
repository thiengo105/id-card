import { Alert, Button, Form, Select, Space, Upload, UploadFile } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import names from "data/db.json";
import { normalizeVietnamese } from "utils/string";

const options = names.map(({ id, name }) => ({
  label: name,
  value: id,
}));

const Wrapper = styled.div`
  .upload-wrapper {
    display: block;
  }

  .ant-upload.ant-upload-select {
    display: block;
  }
`;

type InfoFormProps = {
  name: string;
  loading: boolean;
  imageLoading: boolean;
  hasImage: boolean;
  onFileChange(file: File): void;
  onIdChange(id: number): void;
  onDoneClick(): void;
};

const InfoForm: React.FC<InfoFormProps> = ({
  name,
  loading,
  imageLoading,
  hasImage,
  onFileChange,
  onIdChange,
  onDoneClick,
}) => {
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

  useEffect(() => {
    if (fileList.length === 1 && fileList[0].originFileObj) {
      onFileChange(fileList[0].originFileObj);
    }
  }, [fileList, onFileChange]);

  return (
    <Wrapper>
      <Form layout="vertical">
        <Form.Item>
          <Alert
            showIcon
            type="info"
            message="Lưu ý"
            description={
              <div>
                Hãy chọn ảnh có mặt của mình nhé, vì không có ảnh của mình thì
                thẻ này sẽ không được duyệt và in, nếu đi chương trình mà không
                có thẻ tình nguyện viên thì sẽ buồn lắm đó{" "}
                <span role="img">{String.fromCodePoint(0x1f641)}</span>
              </div>
            }
          />
        </Form.Item>
        <Form.Item label="Họ và tên">
          <Select
            showSearch
            allowClear
            size="large"
            options={options}
            onChange={(value) => onIdChange(value)}
            filterOption={(input, option) => {
              return normalizeVietnamese(option!.label).includes(
                normalizeVietnamese(input)
              );
            }}
          />
        </Form.Item>
      </Form>
      <Space direction="horizontal" style={{ width: "100%" }}>
        <Upload
          maxCount={1}
          fileList={fileList}
          onChange={(info) => {
            setFileList(info.fileList);
          }}
          beforeUpload={() => false}
          showUploadList={false}
          accept="image/*,.heic"
          style={{ width: "100%" }}
          className="upload-wrapper"
        >
          <Button type="primary" size="large" block loading={imageLoading}>
            Chọn ảnh
          </Button>
        </Upload>
        <Button
          type="primary"
          size="large"
          block
          onClick={onDoneClick}
          loading={loading}
          disabled={!hasImage || !name}
        >
          Tải lên
        </Button>
      </Space>
    </Wrapper>
  );
};

export default InfoForm;
