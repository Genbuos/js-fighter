const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7;

const background = new Sprite({position:{
  x: 0,
  y: 0
},
  imageSrc: './Assets/background.png'
})

const shop = new Sprite({position:{
  x: 325,
  y: 220
},
  imageSrc: './Assets/shop.png',
  scale: 2.75,
  framesMax: 6
})



const player = new Fighter({
  position: {
    x: 0,
    y: 0, // Adjusted y coordinate to start closer to the bottom
  },
  velocity: {
    x: 0,
    y: 10,
  },

  imageSrc: './Assets/arleigh/Idle.png',
  framesMax: 8,
  scale: 3.25,
  offset: {
    x: 120,
    y: 165
  },
  sprites : {
    idle: {
      imageSrc: './Assets/arleigh/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './Assets/arleigh/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './Assets/arleigh/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './Assets/arleigh/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './Assets/arleigh/Attack1.png',
      framesMax: 5
    },
    attack2: {
      imageSrc: './Assets/arleigh/Attack2.png',
      framesMax: 5
    },

  }
});

const enemy = new Fighter({
  position: {
    x: 600,
    y:0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: +50,
    y: 0,
  },
  color: "blue",


  imageSrc: './Assets/merlin/Idle.png',
  framesMax: 6,
  scale: 2,
  offset: {
    x: 120,
    y: 133
  },
  sprites : {
    idle: {
      imageSrc: './Assets/merlin/Idle.png',
      framesMax: 6
    },
    run: {
      imageSrc: './Assets/merlin/Run.png',
      framesMax: 8
    },
    //TODO
    jump: {
      imageSrc: './Assets/arleigh/Jump.png',
      framesMax: 2
    },
    //TODO
    fall: {
      imageSrc: './Assets/arleigh/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './Assets/merlin/Attack1.png',
      framesMax: 8
    },
    //TODO
    attack2: {
      imageSrc: './Assets/arleigh/Attack2.png',
      framesMax: 5
    },

  }
});

console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};


decreaseTimer()


function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";

  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update()
  shop.update()

  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement algo

  if (keys.a.pressed && player.lastkey === "a") {
    player.velocity.x = -5;
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastkey === "d") {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  // player 1jumping
  if(player.velocity.y < 0){
   player.switchSprite('jump')
  } else if(player.velocity.y > 0){
    player.switchSprite('fall')
  }


  //enemy movement algo
  if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
    enemy.velocity.x = -10;
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 10;
    enemy.switchSprite('run')

  }else {
    enemy.switchSprite('idle')
  }

  //collision detection algo

  //grab the right side of the attack box and check
  //the attack box is passed the enemy position.
  if (
    collision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20
    document.querySelector("#enemyHealth").style.width = enemy.health + '%';
  }

  if (
    collision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20
    document.querySelector("#playerHealth").style.width = player.health + '%';
  }

  //end game for health
  if(enemy.health<=0 || player.health <=0){
    decideWinner({player, enemy, timerId});
  }


}

animate();

//Moving characters
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastkey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastkey = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;

      case "q":
        player.attack2();
        break;

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastkey = "ArrowRight";

      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastkey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.isAttacking = true;
      enemy.attack()
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowDown"  :
      enemy.isAttacking = false;
      break;
  }
});
