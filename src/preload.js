const { contextBridge, ipcRenderer  } = require('electron');
const pokemon = require('pokemontcgsdk');
const config = require('../config.js');

pokemon.configure({apiKey: config.pokeKey});

contextBridge.exposeInMainWorld("electron", {
  pokeGet: (options) => {
    return pokemon.card.all(options)
  },
  tesseractGet: (filePath) => ipcRenderer.invoke('tess', filePath).then(res => {
    return res
  })
});
