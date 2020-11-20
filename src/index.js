let addToy = false;
const toyUrl = "http://localhost:3000/toys"

const toyCollection = document.getElementById("toy-collection")

let toy


document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".add-toy-form")
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

 fetchAllToys()


form.addEventListener("submit", event => {
  event.preventDefault()
  
  const newName = event.target.name.value
  const newImg = event.target.image.value

  const object = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": newName,
      "image": newImg,
      "likes": 0
    })
  }

  postToy(object)
  
})
 
});

function postToy(object) {
  fetch(toyUrl, object)
  .then (resp => resp.json())
  .then(json => {
    toyCollection.innerHTML = ""
    fetchAllToys()
  })
  
}

function fetchAllToys() {
 fetch(toyUrl)
  .then( resp => resp.json() )
  .then( json => {
    appendAllToys(json)
  } )
}


function appendAllToys(json) {
  for (const ele of json) {
    toyCollection.appendChild(createToyCard(ele))
  }  
}

function createToyCard(toy) {
  const div = document.createElement("div")
  div.className = "card"
  div.dataset.id = toy.id
  const header = document.createElement("h2")
  header.textContent = toy.name
  const img = document.createElement("img")
  img.className = ("toy-avatar")
  img.src = toy.image
  const p = document.createElement("p")
  p.textContent = `${toy.likes} likes`
  p.dataset.likes = toy.likes
  const button = document.createElement("button")
  button.className = "like-btn"
  button.textContent = "Like <3"


  button.addEventListener("click", event => {
    let p = event.target.parentNode.querySelector("p")
    let id = event.target.parentNode.dataset.id
    
    let generatedObj = generateLikeObj(p.dataset.likes)
    console.log(event.target.parentNode.dataset.id)

    patchLikes(generatedObj, id, p)


  })







  div.appendChild(header)
  div.appendChild(img)
  div.appendChild(p)
  div.appendChild(button)
  
  return div
}

function patchLikes(obj, id, likes) {
  fetch(toyUrl + `/${id}`, obj)
  .then(resp => resp.json())
  .then(json => {
    likes.textContent = `${parseInt(likes.dataset.likes)+1} likes`
  })
}

function generateLikeObj(numLikes) {
  
  obj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "likes": parseInt(numLikes)+1
    })
  }
  return obj

}