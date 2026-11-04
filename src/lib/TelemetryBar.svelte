<script>
  let {
    lastKey = null,
    activeKeysCount = 0,
    soundMode = 'hybrid',
    currentFont = 'jetbrains'
  } = $props();
</script>

<div class="telemetry-bar">
  <div class="telemetry-item">
    <span class="label">key</span>
    <span class="value">{lastKey ? (lastKey.label || lastKey.char) : '—'}</span>
  </div>

  <div class="telemetry-item">
    <span class="label">code</span>
    <span class="value">{lastKey ? lastKey.code.toLowerCase() : 'idle'}</span>
  </div>

  <div class="telemetry-item">
    <span class="label">pitch</span>
    <span class="value">{lastKey?.noteName ? `${lastKey.noteName} (${lastKey.freq}hz)` : '—'}</span>
  </div>

  <div class="telemetry-item">
    <span class="label">voices</span>
    <span class="value">{activeKeysCount}</span>
  </div>

  <div class="telemetry-item hidden-mobile">
    <span class="label">sound</span>
    <span class="value">{soundMode}</span>
  </div>

  <div class="telemetry-item hidden-mobile">
    <span class="label">font</span>
    <span class="value">{currentFont}</span>
  </div>
</div>

<style>
  .telemetry-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 16px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 11px;
    line-height: 1;
    overflow-x: auto;
  }

  .telemetry-item {
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }

  .label {
    color: var(--text-muted);
    font-size: 10px;
    letter-spacing: 0.05em;
  }

  .value {
    color: var(--text-primary);
    font-weight: 600;
  }

  @media (max-width: 680px) {
    .hidden-mobile {
      display: none;
    }
    .telemetry-bar {
      font-size: 10px;
      padding: 6px 10px;
    }
  }
</style>
