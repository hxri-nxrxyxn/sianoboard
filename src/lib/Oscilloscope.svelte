<script>
  import { sound } from './soundEngine.js';

  let canvas = $state(null);

  $effect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const bufferLength = sound.analyser ? sound.analyser.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      animId = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      // Clear with background
      ctx.clearRect(0, 0, width, height);

      // Draw subtle center baseline
      ctx.strokeStyle = 'rgba(128, 128, 128, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (sound.analyser && sound.ctx && sound.ctx.state === 'running' && !sound.isMuted) {
        sound.analyser.getByteTimeDomainData(dataArray);

        // Check if there is actual audio activity
        let hasSignal = false;
        for (let i = 0; i < bufferLength; i++) {
          if (Math.abs(dataArray[i] - 128) > 2) {
            hasSignal = true;
            break;
          }
        }

        ctx.lineWidth = hasSignal ? 1.75 : 1;
        ctx.strokeStyle = hasSignal ? 'rgba(255, 255, 255, 0.95)' : 'rgba(128, 128, 128, 0.4)';

        // In light theme, adapt stroke
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
          ctx.strokeStyle = hasSignal ? 'rgba(0, 0, 0, 0.9)' : 'rgba(100, 100, 100, 0.35)';
        }

        ctx.beginPath();
        const sliceWidth = width / (bufferLength - 1);
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.stroke();
      } else {
        // Flat line
        ctx.strokeStyle = 'rgba(128, 128, 128, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  });
</script>

<div class="oscilloscope-container">
  <canvas bind:this={canvas} width="320" height="42"></canvas>
  <div class="oscilloscope-tag">live waveform</div>
</div>

<style>
  .oscilloscope-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 3px 6px;
    overflow: hidden;
  }

  canvas {
    display: block;
    width: 140px;
    height: 28px;
  }

  .oscilloscope-tag {
    position: absolute;
    right: 6px;
    bottom: 3px;
    font-size: 7px;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    pointer-events: none;
    opacity: 0.6;
  }

  @media (max-width: 640px) {
    canvas {
      width: 100px;
      height: 24px;
    }
  }
</style>
