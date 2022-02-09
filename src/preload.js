const { contextBridge, ipcRenderer  } = require('electron');
const pokemon = require('pokemontcgsdk');
const config = require('../config.js');

pokemon.configure({apiKey: config.pokeKey});

contextBridge.exposeInMainWorld("poke", {
  get: (data) => {
    console.log("preload", data);

    return pokemon.card.find(data)
  }
});
