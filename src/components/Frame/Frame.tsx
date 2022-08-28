import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Group,
  Rect,
  Transformer,
} from "react-konva";
import frame from "assets/images/id-card.svg";
import useImage from "use-image";
import styled from "styled-components";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useSize } from "ahooks";

const IMAGE_WIDTH = 945;
const IMAGE_HEIGHT = 1299;

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

type FrameProps = {
  name: string;
  image: HTMLImageElement | null;
};
const Frame = React.forwardRef<Konva.Stage, FrameProps>(
  ({ name, image }, ref) => {
    const [isSelected, setSelected] = useState(true);
    const [frameUrl] = useImage(frame);
    const parentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<Konva.Image>(null);
    const exportImageRef = useRef<Konva.Image>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const size = useSize(parentRef);

    const scaleRatio = useMemo(() => {
      if (size) {
        return size.width / IMAGE_WIDTH;
      }
      return 1;
    }, [size]);

    const imageRatio = useMemo(() => {
      return IMAGE_WIDTH / IMAGE_HEIGHT;
    }, []);

    useEffect(() => {
      if (trRef.current && imageRef.current) {
        if (image && isSelected) {
          trRef.current.nodes([imageRef.current]);
          trRef.current.getLayer()?.batchDraw();
        }
      }
    }, [image, isSelected]);

    const imageSize = useMemo(() => {
      let width = 0,
        height = 0;
      if (image && size) {
        width = image.width;
        height = image.height;
        const ratio = image.width / image.height;

        if (ratio >= 1) {
          if (image.width > size.width) {
            width = size.width - 100;
            const scaleRatio = width / image.width;
            height = image.height * scaleRatio;
          }
        } else if (ratio < 1) {
          if (image.height > size.height) {
            height = size.height - 100;
            const scaleRatio = height / image.height;
            width = image.width * scaleRatio;
          }
        }
      }
      return { width, height };
    }, [image, size]);

    function selectImage(e: KonvaEventObject<MouseEvent>) {
      if (e.target.attrs.id === "photo") {
        setSelected(true);
      }
    }

    function onStageClick(e: KonvaEventObject<MouseEvent>) {
      if (e.target.attrs.id === "frame") {
        setSelected(false);
      }
    }

    function copySize() {
      if (imageRef.current && exportImageRef.current) {
        const img = imageRef.current;
        const exImg = exportImageRef.current;

        const { width, height } = img.size();
        const { x: sx, y: sy } = img.scale();
        const { x: px, y: py } = img.position();

        exImg.size({
          width: width / scaleRatio,
          height: height / scaleRatio,
        });

        exImg.scale({
          x: sx,
          y: sy,
        });

        exImg.position({
          x: px / scaleRatio,
          y: py / scaleRatio,
        });
      }
    }

    return (
      <div>
        <Wrapper ref={parentRef}>
          {size && (
            <Stage
              width={size.width}
              height={size.width / imageRatio}
              onMouseDown={onStageClick}
              preventDefault={false}
            >
              <Layer>
                <Rect
                  width={size.width}
                  height={size.width / imageRatio}
                  fill="#ffffff"
                />
                <KonvaImage
                  id="frame"
                  image={frameUrl}
                  width={size.width}
                  height={size.width / imageRatio}
                  x={0}
                  y={0}
                  preventDefault={false}
                />
                <Group
                  clipFunc={(ctx: any) => {
                    ctx.arc(
                      size.width / 2 - 1,
                      (size.height * 567) / IMAGE_HEIGHT,
                      (size.width * 247) / IMAGE_WIDTH,
                      0,
                      Math.PI * 2,
                      false
                    );
                  }}
                >
                  {image && (
                    <KonvaImage
                      onClick={selectImage}
                      onTap={selectImage}
                      onDragStart={selectImage}
                      id="photo"
                      ref={imageRef}
                      image={image}
                      draggable
                      width={imageSize.width}
                      height={imageSize.height}
                      x={(size.width - imageSize.width) / 2}
                      y={
                        ((size.height - imageSize.height) * 576) / IMAGE_HEIGHT
                      }
                      onDragEnd={copySize}
                      onTransformEnd={copySize}
                    />
                  )}
                </Group>
                {image && isSelected && (
                  <Transformer
                    id="transformer"
                    ref={trRef}
                    centeredScaling={true}
                    keepRatio={true}
                    enabledAnchors={[
                      "top-left",
                      "top-right",
                      "bottom-left",
                      "bottom-right",
                    ]}
                  />
                )}
                <Text
                  x={0}
                  width={size.width}
                  y={(size.height * 980) / IMAGE_HEIGHT}
                  text={name}
                  fill="#FAEE65"
                  fontSize={(size.width * 72) / IMAGE_WIDTH}
                  align="center"
                  fontFamily="VL Selphia"
                  preventDefault={false}
                />
              </Layer>
            </Stage>
          )}
        </Wrapper>

        <Stage
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          ref={ref}
          style={{ display: "none" }}
        >
          <Layer>
            <Rect width={IMAGE_WIDTH} height={IMAGE_HEIGHT} fill="#ffffff" />
            <KonvaImage
              image={frameUrl}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              x={0}
              y={0}
            />
            <Group
              clipFunc={(ctx: any) => {
                ctx.arc(IMAGE_WIDTH / 2 - 1, 567, 247, 0, Math.PI * 2, false);
              }}
            >
              {image && (
                <KonvaImage
                  ref={exportImageRef}
                  image={image}
                  width={imageSize.width / scaleRatio}
                  height={imageSize.height / scaleRatio}
                  x={(IMAGE_WIDTH - imageSize.width / scaleRatio) / 2}
                  y={
                    ((IMAGE_HEIGHT - imageSize.height / scaleRatio) * 576) /
                    IMAGE_HEIGHT
                  }
                />
              )}
            </Group>
            <Text
              x={0}
              width={IMAGE_WIDTH}
              y={980}
              text={name}
              fill="#FAEE65"
              fontSize={72}
              align="center"
              fontFamily="VL Selphia"
            />
          </Layer>
        </Stage>
      </div>
    );
  }
);

Frame.displayName = "Frame";
export default Frame;
