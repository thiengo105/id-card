import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Group,
  Rect,
} from "react-konva";
import frame from "assets/images/id-card.svg";
import useImage from "use-image";
import styled from "styled-components";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Slider } from "antd";

const IMAGE_WIDTH = 946;
const IMAGE_HEIGHT = 1300;

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 20px;

  &::after {
    content: "";
    display: block;
    padding-top: calc(1300 / 946 * 100%);
  }

  .konvajs-content {
    position: initial !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;

    > canvas {
      top: 0;
      left: 0;
      width: 100% !important;
      height: 100% !important;
    }
  }
`;

type FrameProps = {
  name: string;
  image: HTMLImageElement | null;
};
const Frame = React.forwardRef<Konva.Stage, FrameProps>(
  ({ name, image }, ref) => {
    const [scale, setScale] = useState<number>(1);
    const [frameUrl] = useImage(frame);
    const parentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<Konva.Image>(null);
    const isDragging = useRef<boolean>(false);
    const initialPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
      setScale(1);
    }, [image]);

    const ratio = useMemo(() => {
      return parentRef.current
        ? parentRef.current.clientWidth / IMAGE_WIDTH
        : 1;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parentRef.current]);

    useEffect(() => {
      if (imageRef.current) {
        const img = imageRef.current;
        const currentScale = img.scaleX();
        const currentPosition = img.position();

        const center = {
          x: IMAGE_WIDTH / 2,
          y: 576,
        };

        const relatedTo = {
          x: (center.x - currentPosition.x) / currentScale,
          y: (center.y - currentPosition.y) / currentScale,
        };

        img.scale({ x: scale, y: scale });
        img.position({
          x: center.x - relatedTo.x * scale,
          y: center.y - relatedTo.y * scale,
        });
      }
    }, [scale, ratio]);

    function onMouseDown(e: KonvaEventObject<MouseEvent>) {
      if (imageRef.current) {
        initialPos.current = {
          x: e.evt.x - imageRef.current.x() * ratio,
          y: e.evt.y - imageRef.current.y() * ratio,
        };
        isDragging.current = true;
        document.onmousemove = onMouseMove;
        document.onmouseup = onMouseUp;
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (imageRef.current && isDragging.current) {
        const img = imageRef.current;
        const dx = e.clientX - initialPos.current.x;
        const dy = e.clientY - initialPos.current.y;

        img.x((img.offsetX() + dx) / ratio);
        img.y((img.offsetY() + dy) / ratio);
      }
    }

    function onMouseUp(e: MouseEvent) {
      initialPos.current = { x: e.clientX * ratio, y: e.clientY * ratio };
      isDragging.current = false;
    }

    return (
      <div>
        <Wrapper ref={parentRef}>
          <Stage ref={ref} width={IMAGE_WIDTH} height={IMAGE_HEIGHT}>
            <Layer>
              <Rect width={IMAGE_WIDTH} height={IMAGE_HEIGHT} fill="#ffffff" />
            </Layer>
            <Layer>
              <KonvaImage
                image={frameUrl}
                onMouseDown={onMouseDown}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                x={0}
                y={0}
              />
            </Layer>

            <Layer>
              <Group
                clipFunc={(ctx: any) => {
                  ctx.arc(IMAGE_WIDTH / 2, 567, 247, 0, Math.PI * 2, false);
                }}
              >
                {image && (
                  <KonvaImage
                    ref={imageRef}
                    image={image}
                    onMouseDown={onMouseDown}
                  />
                )}
              </Group>
            </Layer>
            <Layer>
              <Text
                x={0}
                width={946}
                y={1000}
                text={name}
                fill="#FAEE65"
                fontSize={72}
                align="center"
                fontFamily="VL Selphia"
              />
            </Layer>
          </Stage>
        </Wrapper>

        {image && (
          <>
            <p>Phóng to</p>
            <Slider
              defaultValue={1}
              value={scale}
              min={0.025}
              max={2}
              step={0.025}
              onChange={(value) => setScale(value)}
            />
          </>
        )}
      </div>
    );
  }
);

Frame.displayName = "Frame";
export default Frame;
