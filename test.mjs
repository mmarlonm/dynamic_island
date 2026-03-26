import np from 'node-nowplaying';
console.log('Loaded API:', Object.keys(np));

try {
  console.log('Methods:', Object.getOwnPropertyNames(np));
  
  if (typeof np.on === 'function') {
      np.on('playing', (data) => console.log('Playing:', data));
      np.on('paused', (data) => console.log('Paused:', data));
  }
} catch (e) {
  console.error(e);
}

setTimeout(() => process.exit(0), 4000);
