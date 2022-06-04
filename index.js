const ul=document.querySelector('ul');
const input = document.getElementById("search-box");
const queryString = window.location.search;
const parameters = new URLSearchParams(queryString);
const userId = parseInt(parameters.get('id'));
const channel = new BroadcastChannel('my_channel')

let usersList=[
    {
        id:1,
        connected_users:[2,3,4,5],
        is_group:false,
        name: 'Ted',
        date: new Date(Date.now()),
        image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg'
    },
    {
        id:2,
        connected_users:[1,3,4,5],
        is_group:false,
        name: 'Marshal',
        date: new Date("2020 3 February"),
        image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_02.jpg'
    },
    {
        id:3,
        connected_users:[1,2,4],
        is_group:true,
        name: 'Intern Group',
        date: new Date("2012 23 June"),
        image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_03.jpg'
    },
    {
        id:4,
        connected_users:[1,2,3],
        is_group:false,
        name: 'Shyla',
        date: new Date("2020 12 March"),
        image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_04.jpg'
    },
    {
        id:5,
        connected_users:[1,2],
        is_group:false,
        name: 'Regina',
        date: new Date("2021 2 March"),
        image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_05.jpg'
    },

];

let message=[
    {
       sender_id:1,
        receiver_id: 2,
        date: new Date("2020 3 February"),
        image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg'
    },
    {
        sender_id:2,
         receiver_id: 3,
         date: new Date("2018 23 June"),
         image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg'
     },
     {
        sender_id:4,
         receiver_id: 3,
         date: new Date("2017 23 June"),
         message:'Guys'
     },
     {
        sender_id:1,
         receiver_id: 3,
         date: new Date("2018 24 June"),
         message:'How have you been?'
     },
     {
        sender_id:1,
         receiver_id: 3,
         date: new Date("2018 3 June"),
         image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg'
     },
     {
        sender_id:4,
         receiver_id: 1,
         date: new Date("2021 12 March"),
         message: 'Hello'
         
        },
     {
        sender_id:1,
         receiver_id: 5,
         date: new Date("2021 2 March"),
         message: 'Hey, how are you doing?'
     },
     {
        sender_id:1,
         receiver_id: 2,
         date: new Date("2015 3 February"),
         image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg'
     },
    {
        sender_id:2,
         receiver_id: 1,
         date: new Date("2015 3 February"),
         message: 'hii'
     },
     {
        sender_id:2,
         receiver_id: 4,
         date: new Date("2015 3 February"),
         image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg'
     },
     {
         sender_id:5,
          receiver_id: 2,
          date: new Date("2016 3 February"),
          message: 'How you?'
      }
]

const messageFilter = (receiver) => {
    let latestMessage=[]
    if(receiver.is_group){
            latestMessage = message.filter((y) => {
            if(y.receiver_id == receiver.id){
                return true;
            }else{
                return false;
            }
        })
    }else{
        latestMessage= message.filter((x) => {
            if((x.sender_id == userId && x.receiver_id == receiver.id) || (x.sender_id == receiver.id && x.receiver_id == userId)){
                return true;
            }else{
                return false;
            }
        })

    }
    return latestMessage
}

const userListing = (searchValue) => {
    document.getElementById('user-list').innerHTML = ''
    let connectedUsersList = usersList.filter((x) => {
        if(userId != x.id && x.connected_users.includes(userId)){
            return true;
        }else{
            return false;
        }
    })
    
    if(typeof searchValue == 'string'){
        if(searchValue != ''){
            connectedUsersList = connectedUsersList.filter(x => x.name.toLowerCase() == searchValue.toLowerCase())
        }
    }


    for(let i=0;i<connectedUsersList.length;i++){
    //     //connecteduserlist ko last message ko date nikalne with user id
        let latestMessage= messageFilter(connectedUsersList[i])
        
        latestMessage.sort(function(a,b){
            return new Date(b.date) - new Date(a.date);
          });

          if(latestMessage.length){
          connectedUsersList[i].date=latestMessage[0].date
          }

    }
    connectedUsersList.sort(function(a,b){
        return new Date(b.date) - new Date(a.date);
      });

    //for default
    getMessage(connectedUsersList[0].id)

    connectedUsersList.forEach((user) => {
    var html = 

    `<li onClick="getMessage(${user.id})">` +
    `<img src=${user.image} alt="">`+
    '<div>'+
        '<h2>'+
        user.name+
        '</h2>'+
        '<h3>'+
        `${user.date.getDate()}/${user.date.getMonth()+1}/${user.date.getFullYear()}`+
        '</h3>'+
    '</div>'+
    '</li>'

    document.getElementById('user-list').innerHTML += html
    
})

}

const getMessage = (id) => {

    const headerName=document.querySelector('.header-name');
    const headerNameId=document.getElementById('chat-heading-id');

    const header= document.querySelector('.header');


    document.getElementById('chat').innerHTML = ''
    let selectedUser = ''
    header.removeChild(header.firstChild)

    selectedUser = usersList.find((z) => z.id == id)
    headerName.textContent= selectedUser.name
    headerNameId.value = selectedUser.id
    header.insertAdjacentHTML("afterbegin", `<img src="${selectedUser.image}" alt="">`);

        let displayMessage= messageFilter(selectedUser)
        
    displayMessage.sort(function(b,a){
        return new Date(b.date) - new Date(a.date);
      });

      displayMessage.forEach((msg) => {
          let sendUser = usersList.find((x) => x.id == msg.sender_id)
          let html=null;
          let msgDisplay = null;
          if(msg.image){
              msgDisplay = `<img src=${msg.image}>`
          }else{
              msgDisplay = msg.message
          }
        if(msg.sender_id == userId){
            html=
            `<li class="me">`+
            `<div class="entete">`+
            `<h3>${msg.date.getDate()}/${msg.date.getMonth()+1}/${msg.date.getFullYear()}</h3>`+
                `<span class="status blue">`+
                `</span>`+
            `</div>`+
            `<div class="triangle">`+
            `</div>`+
            `<div class="message">`+
                msgDisplay+
            `</div>`+
        `</li>`
        }else{
            html=
            `<li class="you">`+
                    `<div class="entete">`+
                        `<span class="status green">`+
                        `</span>`+
                        `<h2>${sendUser.name}</h2>`+
                        `<h3>${msg.date.getDate()}/${msg.date.getMonth()+1}/${msg.date.getFullYear()}</h3>`+
                    `</div>`+
                    `<div class="triangle"></div>`+
                    `<div class="message">`+
                        msgDisplay +
                    `</div>`+
                `</li>`
        }

        document.getElementById('chat').innerHTML += html
      })
}

const sendMessage = (receiverId,msg) => {
    

    let newMessage = {
             sender_id:userId,
             receiver_id: receiverId,
             date: new Date(Date.now()),
         }
    if(msg){
        newMessage.message = msg
    }else{
        
        if(document.getElementById('myFile')){
        newMessage.image = document.getElementById('myFile').files[0].name
    }
    }
    if(document.getElementById('text-box').value){
        document.getElementById('text-box').value = null

    }
    if(document.getElementById('myFile')){
       document.getElementById('myFile').value = null
    }

    for(let i=0;i<usersList.length;i++){
        if(usersList[i].id == receiverId || usersList[i].id == userId){
            usersList[i].date = new Date(Date.now()) 
        }
    }
    message.push(newMessage)
    userListing()
    getMessage(receiverId)


    //arko browser lai connect garna 
    channel.postMessage({'user':usersList,'message':message,'id':userId}) 
    

}

//funstion for arko browser ma listen gareko
//user ra message list send garnu paryo for specific receiving side
//user ra message get garne
channel.addEventListener('message', event => {
    usersList = event.data.user
    message=event.data.message
        if(userId != event.data.id){
            userListing()
            getMessage(event.data.id)
        }
        
})

//Initial page ma user ID enter garepachi
const urlFunc = function (value) {
    let filteredUser = usersList.map((x) => {
       
    if(!x.is_group){
        return x.id
    }else{
        return null
    }
    })
    
    if(filteredUser.includes(parseInt(value))){
        location.href = `index.html?id=${value}`;
    }
    
};
// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    userListing(input.value)
  }
});


window.addEventListener('load',userListing);
