var filename = document.getElementById('filename');
var desc = document.getElementById('innerTextOutput');
var genBtn = document.getElementById('generate-btn');
var copyDescBtn = document.getElementById('copy-desc');
var copyFilenameBtn = document.getElementById('copy-filename');
var cardType = document.getElementsByName('card-type');
var imgBox = document.getElementById('image-box');
var nameBtns = document.getElementById('name-btns');
let listName = '';
let filePath = '';
let regenName = ''
let newName = []

const genDesc = (name) => {
  // fill text area with desc
  desc.innerText = `
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Dosis:wght@300;600&display=swap" rel="stylesheet">


  <div style="display:flex; justify-content: center; align-items: center; background-color: rgba(0,0,0,0.175); padding: 10px 15px;">
  <div style="font-size: 16pt; font-weight:600; font-family: 'Dosis', sans-serif; width: 80%; overflow-wrap: break-word;">${ name ? name : regenName}</div>

  <div style="margin-left: 2rem;">
  <ul>
  <li style="font-size: 12pt; margin-bottom: 1em; font-weight:300; font-family: 'Dosis', sans-serif;">One Card.</li>

  <li style="font-size: 12pt; margin-bottom: 1em; font-weight:300; font-family: 'Dosis', sans-serif;">Ships inside penny sleeve and top loader.</li>

  <li style="font-size: 12pt; margin-bottom: 1em; font-weight:300; font-family: 'Dosis', sans-serif;">Orders are usually shipped in a plain white envelope. Depending on the value and/or quantity of cards, orders will be shipped either in a bubble mailer or box.</li>

  <li style="font-size: 12pt; font-weight:300; font-family: 'Dosis', sans-serif;">Card shipped out from BC, Canada</li>
  </ul>
  </div>
  </div>
  `
}

// generate research link
const genEbaySite = (q) => {
  const searchQ = q ? q : listName

  const btnLink = document.createElement('a')
  btnLink.innerText = 'EBay search sold listings of card'

  btnLink.setAttribute('href', `https://www.ebay.ca/sch/i.html?_from=R40&_nkw=${encodeURIComponent(searchQ)}&_sacat=0&rt=nc&LH_Sold=1&LH_Complete=1`)
  btnLink.setAttribute('target', '_blank')

  document.getElementById('research-link-box').appendChild(btnLink)
}

const pokeApi = async (name, num, setTotal) => {
  return await window.electron.pokeGet({ q: `name:${name} number:${num} set.total:${setTotal}`}).then(r => r);
}

// callPokemonApi().then(e => { console.log("yaaww", e) }).catch(err => { console.log("err", err) });

const copyText = (e) => {
  navigator.clipboard.writeText(e)
    .then(() => {
      console.log("copied!")
    })
    .catch(err => console.log("fail", err))
}

const buildName = (str) => {
  if (str) {
    newName.push(str)
  }

  if (newName.length > 0) {
    filename.innerText = newName.join(' ')
  }
}

const createNameBtns = (blocks) => {
  if (!Array.isArray(blocks)) {
    blocks = [blocks]
  }

  blocks.forEach(b => {
    let block = document.createElement('button')
    block.onclick = buildName(b)
    block.textContent = b
    nameBtns.appendChild(block)
  })

  const wordsToAdd = ['Holo', 'Reverse Holo', 'Mock Set', 'Uncommon', 'Common', 'Rare']

  wordsToAdd.forEach((item, i) => {
    let block = document.createElement('button')
    block.addEventListener('click', function(){
      buildName(item)
    })
    block.textContent = item
    nameBtns.appendChild(block)
  })


}

const generateName = (val) => {
  // let isPoke = false;
  // let isYugi = false;

  if (val === 'auto') {
    if (!listName.toLowerCase().split('').includes('/')) {
      for (const card of cardType) {
        if (card.value === 'yugi') {
          card.checked = true
        }
        if (card.value === 'poke') {
          card.checked = false
        }
      }
    } else {
      for (const card of cardType) {
        if (card.value === 'poke') {
          card.checked = true
        }
        if (card.value === 'yugi') {
          card.checked = false
        }
      }
    }
  }


  var ebaySearchQuery = ''

  for (const card of cardType) {
    if (card.checked) {
      if (card.value === 'poke') {
        const nameSplit = listName.split(' ')

        // if its not an old card
        if (!nameSplit.includes('Set') && !nameSplit.includes('set')) {
          const nameSplitCopy = nameSplit.slice();

          let num = 0
          let total = 0
          let name = []

          for (const e of nameSplitCopy) {
            if (e.includes('/')) {
              let x = e.split('/');
              num = Number(x[0]);
              total = Number(x[1]) ;
            } else {
              // we dont want the multi rename parenthesis if it has it
              if (!e.includes('(')) {
                name.push(e)
              }
            }
          }

          name = name.join(' ')

          ebaySearchQuery = `${name} ${num}/${total}`

          // TODO issues with more than one word names
          pokeApi(encodeURIComponent(name), num, total)
            .then(result => {
              console.log("pokemon card", result)

              if (result && result.length === 0) {
                console.log("No card found")
                genEbaySite(ebaySearchQuery)

                filename.innerText = ''

                createNameBtns([name, `${num}/${total}`])
              } else {
                if (result.length > 1) {
                  console.warn("More than 1 card matched! Accepting the first card")
                }

                const cardName = `${result[0].name} ${result[0].number}/${result[0].set.total} ${result[0].rarity} ${result[0].set.name} Set Pokemon TCG`

                regenName = cardName

                filename.innerText = cardName

                genDesc(cardName)
                genEbaySite(ebaySearchQuery)
              }
            })
        } else {
          regenName = `${listName} Pokemon TCG`
          genDesc()
          genEbaySite()
          filename.innerText = regenName
        }
      } else if (card.value === 'yugi') {
        regenName = `${listName} Yugioh TCG`
        genDesc()
        genEbaySite()
        filename.innerText = regenName
      }
    }
  }

  // for (const card of cardType) {
  //   if (card.checked) {
  //     if (card.value === 'poke') {
  //       regenName = `${listName} Pokemon TCG`
  //     } else {
  //       regenName = `${listName} Yugioh TCG`
  //     }
  //   }
  // }

  // generate image
  imgBox.innerHTML = ''
  const img = document.createElement('img')
  img.setAttribute('src', filePath)
  img.classList.add('card-img')
  imgBox.appendChild(img)

  // document.getElementById('research-link-box').innerHTML = ''
}


document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    newName = []
    nameBtns.innerHTML = ""
    document.getElementById('research-link-box').innerHTML = ""

    // TODO generate a description for manually created names for cards not found in API
    // desc.innerText = ""

    for (const f of event.dataTransfer.files) {
        var file = f.name.replace(/\.[^/.]+$/, "").replace(/\+/, "/")
        filename.innerText = file
        listName = file
        filePath = f.path

        console.log('check f', f)

        console.log("check btn", genBtn)

        // No file name, use tesseract
        if (Number(listName.split('-')[0]) > 2020) {
          const runTesseract = async () => {
            const text = await window.electron.tesseractGet(filePath)

            //TODO not getting back result from tesseract
            console.log("check the text", text)
          }
          runTesseract()
        } else {
          // generateName('auto')
        }
      }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

document.addEventListener('dragenter', (event) => {
    // console.log('File is in the Drop Space');
});

document.addEventListener('dragleave', (event) => {
    // console.log('File has left the Drop Space');
});

genBtn.addEventListener('click', generateName);

copyDescBtn.addEventListener('click', function () {
  var parsedList = desc.innerHTML
  navigator.clipboard.writeText(parsedList)
    .then(() => {
      // TODO create element then remove at the end of animation
      // msgCopy.classList.add('show-success-message')
      // setTimeout(() => {
      //   msgCopy.classList.remove('show-success-message')
      // }, 2500)
      console.log("copied desc")
    })
    .catch(err => console.log("fail copy desc", err))
});

copyFilenameBtn.addEventListener('click', function () {
  var parsedList = filename.innerText
  navigator.clipboard.writeText(parsedList)
    .then(() => {
      // TODO create element then remove at the end of animation
      // msgCopy.classList.add('show-success-message')
      // setTimeout(() => {
      //   msgCopy.classList.remove('show-success-message')
      // }, 2500)
      console.log("copied filename")
    })
    .catch(err => console.log("fail copy filename", err))
});
