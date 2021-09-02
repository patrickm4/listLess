
var filename = document.getElementById('filename');
var desc = document.getElementById('innerTextOutput');
var genBtn = document.getElementById('generate-btn');
var isPoke = document.getElementById('pokemon');
var isYugi = document.getElementById('yugioh');
var imgBox = document.getElementById('image-box');
let listName = '';
let filePath = '';

const copyText = (e) => {
  navigator.clipboard.writeText(e)
    .then(() => {
      console.log("copied!")
    })
    .catch(err => console.log("fail", err))
}

const generateName = () => {
  if (!isPoke.checked && !isYugi.checked) {
    console.error('Need to check off if pokemon or yugioh')
    return
  }

  console.log("yeeet", listName)
  // if (listName) filename.innerText = listName.replace(/\.[^/.]+$/, "")

  var regenName = ''

  // change listing name
  if (isPoke.checked) {
    regenName = `${listName} Pokemon TCG`
  }
  if (isYugi.checked) {
    regenName = `${listName} Yugioh TCG`
  }

  // generate image
  imgBox.innerHTML = ''
  const img = document.createElement('img')
  img.setAttribute('src', filePath)
  img.classList.add('card-img')
  imgBox.appendChild(img)

  document.getElementById('research-link-box').innerHTML = ''

  // generate research link
  const btnLink = document.createElement('a')
  btnLink.innerText = 'EBay search sold listings of card'

  btnLink.setAttribute('href', `https://www.ebay.ca/sch/i.html?_from=R40&_nkw=${listName}&_sacat=0&rt=nc&LH_Sold=1&LH_Complete=1`)
  btnLink.setAttribute('target', '_blank')

  document.getElementById('research-link-box').appendChild(btnLink)

  // https://www.ebay.ca/sch/i.html?_from=R40&_nkw=+Ekans+46%2F62&_sacat=0&rt=nc&LH_Sold=1&LH_Complete=1

  filename.innerText = regenName

  // fill text area with desc
  desc.innerText = `
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Dosis:wght@300;600&display=swap" rel="stylesheet">


  <div style="display:flex; justify-content: center; align-items: center; background-color: rgba(0,0,0,0.175); padding: 10px 15px;">
    <div style="font-size: 16pt; font-weight:600; font-family: 'Dosis', sans-serif; width: 80%; overflow-wrap: break-word;">${regenName}</div>

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


document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (const f of event.dataTransfer.files) {
        var file = f.name.replace(/\.[^/.]+$/, "").replace(/\+/, "/")
        filename.innerText = file
        listName = file
        filePath = f.path

        console.log('check f', f)

        generateName()
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

genBtn.addEventListener('click', generateName)
