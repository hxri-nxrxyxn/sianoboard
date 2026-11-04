<script>
  import Keyboard from './lib/Keyboard.svelte';
  import SettingsModal from './lib/SettingsModal.svelte';
  import { sound } from './lib/soundEngine.js';

  let layout = $state('colemak'); // 'colemak' | 'qwerty'
  let volume = $state(0.7);
  let touchCurve = $state('normal'); // 'normal' | 'intimate' | 'concert'
  let reverbOn = $state(true);
  let isSettingsOpen = $state(false);

  function handleWindowKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      isSettingsOpen = !isSettingsOpen;
    }
  }

  function handleLayoutChange(nextLayout) {
    layout = nextLayout;
  }

  function handleVolumeChange(nextVol) {
    volume = nextVol;
    sound.setVolume(volume);
  }

  function handleTouchChange(nextTouch) {
    touchCurve = nextTouch;
    sound.setTouchCurve(touchCurve);
  }

  function handleReverbChange(nextReverb) {
    reverbOn = nextReverb;
    if (sound.reverbEnabled !== reverbOn) {
      sound.toggleReverb();
    }
  }
</script>

<svelte:window onkeydown={handleWindowKeyDown} />

<main class="viewport">
  <Keyboard
    {layout}
    disabled={isSettingsOpen}
  />

  <SettingsModal
    isOpen={isSettingsOpen}
    {layout}
    {volume}
    {touchCurve}
    {reverbOn}
    onclose={() => (isSettingsOpen = false)}
    onlayoutchange={handleLayoutChange}
    onvolumechange={handleVolumeChange}
    ontouchchange={handleTouchChange}
    onreverbchange={handleReverbChange}
  />
</main>

<style>
  .viewport {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 14px;
    background: var(--bg-page);
  }

  @media (max-width: 768px) {
    .viewport {
      padding: 10px 6px;
    }
  }
</style>
