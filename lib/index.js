const q = document.querySelector.bind(document);
const qq = document.querySelectorAll.bind(document);
const connectButton = q('button#connect');
const joinButton = q('button#join-game');
const transactionHistory = q('ul#transactions');
const onlinePlayers = q('ul#online-players');

let socket;
function connect() {
  socket = io.connect('http://localhost:5000');
  socket.on('connect', () => {
    console.log('you have connected :)');
  });

  socket.on('transaction', (data) => {
    const transaction = document.createElement('li')
    switch (data.type) {
      case ('join'): {
        const newPlayer = document.createElement('li')

        transaction.innerText = `${data.sender_id} ${data.type}ed at ${data.timestamp}`;
        
        newPlayer.innerText = data.sender_id;
        onlinePlayers.append(newPlayer);

        console.log('joined');

        break;
      }
      
      case ('leave'): {
        onlinePlayers.querySelectorAll('li').forEach(el => {
          if (el.innerText === data.sender_id) { el.remove() }
        })

        console.log('left');
      }
    }
    
    transactionHistory.append(transaction);
  })

  socket.on('joined session', ({transactions, players}) => {
    players.forEach(player => {
      const online = document.createElement('li');
      online.innerText = player;

      onlinePlayers.append(online);
    })

    transactions.forEach(({ sender_id, type, timestamp}) => {
      const current = document.createElement('li');
      current.innerText = `${sender_id} ${type}ed at ${timestamp}`

      transactionHistory.append(current);
    })
  })
}

function join() {
  console.log('joining');
  socket.emit('join session', { sessionId: 'as;odthasdfkj'})
}

function leave() {
  console.log('leaving')
  socket.emit('leave session', { sessionId: 'as;odthasdfkj'})
}