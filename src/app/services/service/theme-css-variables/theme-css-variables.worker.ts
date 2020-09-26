/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const keys = Object.keys(data);
  const keyLength = keys.length;

  let response = ':root{';
  for (let i = 0; i < keyLength; i = (i + 1) | 0) {
    const key = keys[i];
    response += ('--theme-' + key + ':' + data[key] + ';');
  }

  postMessage(response + '}');
});
