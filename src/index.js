// <div class="image-container">
//    <img src="https://scontent-lga3-1.cdninstagram.com/vp/bd9b15079ec27c52c076e9c7792bdc04/5B992309/t51.2885-15/s640x640/sh0.08/e35/c180.0.719.719/31449135_2115995735352355_6317812590797914112_n.jpg">
//    <p>
//        <img data-action="like-image" data-image-id="1" class="like-button" src="./images/like.png"><br>
//        <span id="likes-count-for-image-1">41</span>
//    </p>
// </div>

const imageContainers = document.getElementById('container')
class App {
  static createElement (element, attribute = '', parent = '', inner = '') {
    if (typeof (element) === 'undefined') {
      return false
    }
    let e = document.createElement(element)
    if (!Array.isArray(attribute)) {
      attribute = [attribute]
    }
    if ((typeof (attribute) === 'object') && (attribute !== '')) {
      for (let attr of attribute) {
        for (let key in attr) {
          e.setAttribute(key, attr[key])
        }
      }
    }
    if (!Array.isArray(inner)) {
      inner = [inner]
    }
    for (var i = 0; i < inner.length; i++) {
      if (inner[i].tagName) {
        e.appendChild(inner[i])
      } else {
        e.appendChild(document.createTextNode(inner[i]))
      }
    }
    if (parent) {
      parent.appendChild(e)
    }
    return e
  }
}
fetch ('http://localhost:3000/api/v1/images').then(function(response) {
    return response.json();
  }).then(function(masterImageList) {
    for (image of masterImageList) {
      const imageDiv = Image.renderImages(image)
      imageContainers.appendChild(imageDiv)
    }
  })

const submitImgAction = document.getElementById('post-image-form')
submitImgAction.addEventListener('submit', postImgURL)

function postImgURL (event) {
  debugger
  const url = event.currentTarget
  fetch('http://localhost:3000/api/v1/images', {
    method: 'post',
    body: {url: `${url}`}
  })
}

class Image {
  static renderImages () {
    const imgDiv = App.createElement('div', {class: 'image-container'}, imageContainers)
    const imgURL = App.createElement('img', {src: `${image.url}`}, imgDiv)
    const para = App.createElement('p', '', imgDiv)
    const imgData = App.createElement('img', [{class: 'like-button'}, {src: './images/like.png'}], para)
    imgData.dataset.action = 'like-image'
    imgData.dataset.imageId = `${image.id}`
    imgData.innerHTML += '<br>'
    imgData.addEventListener('click', e => Image.likeImageAction(e))
    const imgLikes = App.createElement('span', {id: `likes-count-for-image-${image.id}`}, para, `${image.likes_count}`)

    return imgDiv
  } 

  static likeImageAction (event) {
    const imgId = event.currentTarget.dataset.imageId
    fetch('http://localhost:3000/api/v1/likes', {
      method: 'post',
      body: {image_id: `${imgId}`}
    }).then(function(response) {
      return response.json()
    }).then(function(imageObj) {
      debugger
      document.getElementById(`likes-count-for-image-${imageObj.id}`).innerText = `${imageObj.likes_count}`
    })
  }