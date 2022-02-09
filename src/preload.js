const { contextBridge, ipcRenderer  } = require('electron');
const pokemon = require('pokemontcgsdk');
const config = require('../config.js');

pokemon.configure({apiKey: config.pokeKey});

contextBridge.exposeInMainWorld("poke", {
  get: (options) => {
    return pokemon.card.all(options)
  }
});
