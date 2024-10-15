import React, { useEffect, useRef } from "react";

function AudioVisualizer({
  containerWidth,
  analyser,
  dataArray,
  bufferLength,
  isRecording,
}: {
  containerWidth: number | undefined;
  analyser: AnalyserNode | undefined;
  dataArray: Uint8Array | undefined;
  bufferLength: number | undefined;
  isRecording: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  console.log("rerender");
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
    const borderRadius = 1.5;

    // Control the speed of height changes and movement
    const transitionSpeed = 0.5;
    const movementSpeed = 2; // Adjust this value to control the speed of right to left movement

    canvasRef.current.width = containerWidth;
    canvasRef.current.height = maxLineHeight;

    const totalLines = Math.floor(containerWidth / (lineWidth + lineGap));

    ctx.fillStyle = "#6941C6";

    let currentHeights = new Array(totalLines).fill(minLineHeight);
    let targetHeights = new Array(totalLines).fill(minLineHeight);
    let offset = 0;

    function updateVisualization(newAmplitudeValue: number) {
      const sensitivity = 1;
      const amplifiedValue = Math.pow(newAmplitudeValue, 1 / sensitivity);

      const newHeight =
        minLineHeight + (maxLineHeight - minLineHeight) * amplifiedValue;

      // Update target heights array with new height
      targetHeights[0] = newHeight;
    }

    function drawLines() {
      if (!ctx || !canvasRef.current) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Move offset for right to left movement
      offset += movementSpeed;
      if (offset >= lineWidth + lineGap) {
        offset = 0;
        // Shift heights arrays when a full bar width has passed
        currentHeights.unshift(currentHeights.pop()!);
        targetHeights.unshift(targetHeights.pop()!);
      }

      for (let i = 0; i < totalLines; i++) {
        // Smoothly transition current height towards target height
        currentHeights[i] +=
          (targetHeights[i] - currentHeights[i]) * transitionSpeed;

        const xPosition =
          canvasRef.current.width - (i * (lineWidth + lineGap) + offset);
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

      requestAnimationFrame(drawLines);
    }

    function getAudioData() {
      if (!analyser || !dataArray || !bufferLength) return;
      analyser.getByteFrequencyData(dataArray);
      const amplitude = dataArray.reduce((a, b) => a + b) / bufferLength / 255;
      updateVisualization(amplitude);
      requestAnimationFrame(getAudioData);
    }

    if (isRecording) {
      drawLines();
      getAudioData();
    }
  }, [containerWidth, analyser, dataArray, bufferLength, isRecording]);

  return <canvas ref={canvasRef}></canvas>;
}

export default AudioVisualizer;
