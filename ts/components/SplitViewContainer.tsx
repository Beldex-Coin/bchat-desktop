import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

type SplitViewProps = {
  top: React.ReactElement;
  bottom: React.ReactElement;
  disableTop: boolean;
};

const SlyledSplitView = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Divider = styled.div`
  width: 100%;
  cursor: row-resize;
  height: 5px;
  background-color: var(--color-cell-background);
  margin-top: 2px;
`;

const DividerHandle = styled.div`
  width: 10%;
  height: 5px;
  cursor: row-resize;
  background-color: var(--color-text);
  flex-shrink: 0;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledTop = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const TopSplitViewPanel = ({
  children,
  topHeight,
  setTopHeight,
}: {
  children: React.ReactNode;
  topHeight: number | undefined;
  setTopHeight: (value: number) => void;
}) => {
  const topRef = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (topRef.current) {
      if (!topHeight) {
        setTopHeight(Math.max(MIN_HEIGHT_TOP, topRef.current?.clientHeight / 2));
        return;
      }

      topRef.current.style.height = `${topHeight}px`;
      topRef.current.style.minHeight = `${topHeight}px`;
    }
  }, [topRef, topHeight, setTopHeight]);

  return <StyledTop ref={topRef}>{children}</StyledTop>;
};

const MIN_HEIGHT_TOP = 200;
const MIN_HEIGHT_BOTTOM = 0;

export const SplitViewContainer: React.FunctionComponent<SplitViewProps> = ({
  disableTop,
  top,
  bottom,
}) => {
  const [topHeight, setTopHeight] = useState<undefined | number>(undefined);
  const [separatorYPosition, setSeparatorYPosition] = useState<undefined | number>(undefined);
  const [dragging, setDragging] = useState(false);

  const splitPaneRef = useRef<HTMLDivElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);

  function onMouseDown(e: any) {
    setSeparatorYPosition(e.clientY);
    setDragging(true);
  }

  function onWindowResize() {
    if ((dividerRef?.current?.offsetTop || 0) + 200 > window.innerHeight) {
      const clientY = Math.max(MIN_HEIGHT_TOP + 200, window.innerHeight / 2);
      onMouseMove({ clientY }, true);
    }
  }

  function onMouseUp() {
    setDragging(false);
  }
  function onMouseMove(e: { clientY: number }, overrideIsDragging = false) {
    if ((dragging || overrideIsDragging) && topHeight && separatorYPosition) {
      const newTopHeight = topHeight + e.clientY - separatorYPosition;
      setSeparatorYPosition(e.clientY);
      if (newTopHeight < MIN_HEIGHT_TOP) {
        setTopHeight(MIN_HEIGHT_TOP);
        return;
      }
      if (splitPaneRef.current) {
        const splitPaneHeight = splitPaneRef.current.clientHeight;

        if (newTopHeight > splitPaneHeight - MIN_HEIGHT_BOTTOM) {
          setTopHeight(splitPaneHeight - MIN_HEIGHT_BOTTOM);
          return;
        }
      }
      setTopHeight(newTopHeight);
    }
  }
  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    window.addEventListener('resize', onWindowResize);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onWindowResize);
    };
  });

  return (
    <SlyledSplitView ref={splitPaneRef}>
      {!disableTop && (
        <TopSplitViewPanel topHeight={topHeight} setTopHeight={setTopHeight}>
          {top}
          <Divider ref={dividerRef} onMouseDown={onMouseDown}>
            <DividerHandle />
          </Divider>
        </TopSplitViewPanel>
      )}
      {bottom}
    </SlyledSplitView>
  );
};
