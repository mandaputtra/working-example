let server = new Socket()
server.on('message', handleMessage)

let myId;
const voteButton = document.getElementsByTagName('button')

function handleMessage(message) {

  // if the users had previous id delete it on servers
  if (message.type === 'welcome') {
    server.send({ type: 'welcome', odlId: myId })
    myId = message.id
    document.getElementById("userid").innerText = message.id
    // display current vote
    updateVote(message.vote)
  }

  if (message.type === 'update') {
    updateVote(message.vote)
  }
}

// init after all content loaded
window.addEventListener('load', event => {
  server.init()

  // set a listener to all buttons when clicked
  for (const key in voteButton) {
    if (voteButton.hasOwnProperty(key)) {
      const button = voteButton[key];
      button.addEventListener('click', (e) => {
        // send data to the servers
        server.send({ type: 'vote', vote: button.dataset.vote })
        // disable button if you already vote
        disableButton()
      })
    }
  }
})

// this will disable button after people vote
function disableButton() {
  for (const key in voteButton) {
    if (voteButton.hasOwnProperty(key)) {
      const button = voteButton[key];
      button.disabled = true
    }
  }
}

// update current vote
function updateVote (vote) {
  document.getElementById('kobami').innerHTML = vote.kobami
  document.getElementById('jokawi').innerHTML = vote.jokawi
}