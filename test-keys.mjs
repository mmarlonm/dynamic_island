import { NowPlaying } from 'node-nowplaying';
const np = new NowPlaying((msg) => {
  console.log('KEYS AVAILABLE:', Object.keys(msg));
  console.log('DEVICE INFO:', msg.device, msg.id, msg.deviceId);
  process.exit();
});
np.subscribe();
setTimeout(() => process.exit(), 5000);
