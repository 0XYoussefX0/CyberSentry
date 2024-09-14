import React, { useEffect, useRef } from "react";

function AudioVisualizer({
  containerWidth,
  analyser,
  dataArray,
  bufferLength,
}: {
  containerWidth: number | undefined;
  analyser: AnalyserNode | undefined;
  dataArray: Uint8Array | undefined;
  bufferLength: number | undefined;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (
      !canvasRef.current ||
      !containerWidth ||
      !analyser ||
      !dataArray ||
      !bufferLength
    )
      return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const lineWidth = 3;
    const maxLineHeight = 60;
    const minLineHeight = 3;
    const lineGap = 4;
    const growthDelay = 10;
    const animationSpeed = 1;
    const borderRadius = 1.5; // Half of lineWidth for rounded ends

    canvasRef.current.width = containerWidth;
    canvasRef.current.height = maxLineHeight;

    const totalLines = Math.floor(containerWidth / (lineWidth + lineGap));

    ctx.fillStyle = "#6941C6";

    let offset = 0;
    let targetHeights = new Array(totalLines).fill(minLineHeight);
    let currentHeights = new Array(totalLines).fill(minLineHeight);

    function updateVisualization(newAmplitudeValue: number) {
      // Increase sensitivity by applying a power function
      const sensitivity = 1; // Adjust this value to fine-tune sensitivity
      const amplifiedValue = Math.pow(newAmplitudeValue, 1 / sensitivity);

      const newHeight =
        minLineHeight + (maxLineHeight - minLineHeight) * amplifiedValue;
      targetHeights.unshift(newHeight);
      targetHeights.pop();
      currentHeights.unshift(minLineHeight);
      currentHeights.pop();
    }

    function drawLines() {
      if (!ctx || !canvasRef.current) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      for (let i = 0; i < totalLines; i++) {
        const xPosition =
          canvasRef.current.width - i * (lineWidth + lineGap) - offset;

        if (xPosition + lineWidth > 0 && xPosition < canvasRef.current.width) {
          const targetHeight = targetHeights[i];
          const distanceFromRight = canvasRef.current.width - xPosition;
          const growthProgress = Math.min(1, distanceFromRight / growthDelay);

          currentHeights[i] =
            minLineHeight + (targetHeight - minLineHeight) * growthProgress;

          const yOffset = (maxLineHeight - currentHeights[i]) / 2;

          // Draw rounded rectangle
          ctx.beginPath();
          ctx.moveTo(xPosition + borderRadius, yOffset);
          ctx.lineTo(xPosition + lineWidth - borderRadius, yOffset);
          ctx.quadraticCurveTo(
            xPosition + lineWidth,
            yOffset,
            xPosition + lineWidth,
            yOffset + borderRadius,
          );
          ctx.lineTo(
            xPosition + lineWidth,
            yOffset + currentHeights[i] - borderRadius,
          );
          ctx.quadraticCurveTo(
            xPosition + lineWidth,
            yOffset + currentHeights[i],
            xPosition + lineWidth - borderRadius,
            yOffset + currentHeights[i],
          );
          ctx.lineTo(xPosition + borderRadius, yOffset + currentHeights[i]);
          ctx.quadraticCurveTo(
            xPosition,
            yOffset + currentHeights[i],
            xPosition,
            yOffset + currentHeights[i] - borderRadius,
          );
          ctx.lineTo(xPosition, yOffset + borderRadius);
          ctx.quadraticCurveTo(
            xPosition,
            yOffset,
            xPosition + borderRadius,
            yOffset,
          );
          ctx.fill();
        }
      }

      offset += animationSpeed;
      if (offset > lineWidth + lineGap) {
        offset = offset % (lineWidth + lineGap);
      }

      requestAnimationFrame(drawLines);
    }

    drawLines();

    function getAudioData() {
      if (!analyser || !dataArray || !bufferLength) return;
      analyser.getByteFrequencyData(dataArray);
      const amplitude = dataArray.reduce((a, b) => a + b) / bufferLength / 255;
      updateVisualization(amplitude);
      requestAnimationFrame(getAudioData);
    }

    getAudioData();
  }, [containerWidth, analyser, dataArray, bufferLength]);

  return <canvas ref={canvasRef}></canvas>;
}

export default AudioVisualizer;
