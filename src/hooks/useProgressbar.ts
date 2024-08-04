import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Waypoint: any;
  }
}

const useProgressbar = (progress: number) => {
  const lineRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  useEffect(() => {
    require('plugins/waypoints');
    const ProgressBar = require('plugins/progressbar');

    const pline = document.querySelectorAll('.progressbar.line');
    const pcircle = document.querySelectorAll('.progressbar.semi-circle');

    pline.forEach((e) => {
      if (!lineRef.current) {
        lineRef.current = new ProgressBar.Line(e, {
          strokeWidth: 6,
          trailWidth: 6,
          duration: 300,
          easing: 'easeInOut',
          text: {
            style: {
              color: 'inherit',
              position: 'absolute',
              right: '0',
              top: '-30px',
              padding: 0,
              margin: 0,
              transform: null
            },
            autoStyleContainer: false
          },
          step: (_: any, line: any) => {
            line.setText(Math.round(line.value() * 100) + ' %');
          }
        });
      }
    });

    pcircle.forEach((e) => {
      if (!circleRef.current) {
        circleRef.current = new ProgressBar.SemiCircle(e, {
          strokeWidth: 6,
          trailWidth: 6,
          duration: 300,
          easing: 'easeInOut',
          step: (_: any, circle: any) => {
            circle.setText(Math.round(circle.value() * 100));
          }
        });
      }
    });

    return () => {
      if (lineRef.current) lineRef.current.destroy();
      if (circleRef.current) circleRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    const value = progress / 100;
    if (lineRef.current) lineRef.current.animate(value);
    if (circleRef.current) circleRef.current.animate(value);
  }, [progress]);

  return;
};

export default useProgressbar;