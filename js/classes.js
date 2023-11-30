class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }
  attack(animation) {
    if (this.isAttacking) return;

    this.isAttacking = true;
    this.attackAnimation = animation; // Set the specific attack animation
    this.framesCurrent = 0;

    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  draw() {
    const frameWidth = this.image.width / this.framesMax;
    const scaledFrameWidth = frameWidth * this.scale;

    c.drawImage(
      this.image,
      this.framesCurrent * frameWidth,
      0,
      frameWidth,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      scaledFrameWidth,
      this.image.height * this.scale
    );
  }

  adjustFrames(direction) {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      this.framesCurrent += direction;

      if (this.framesCurrent < 0) {
        this.framesCurrent = this.framesMax - 1;
      } else if (this.framesCurrent >= this.framesMax) {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();

    if (this.isAttacking) {
      this.switchSprite('attack1');
      this.adjustFrames(this.attackAnimation.direction); // Adjust frames for attack animation
    } else {
      // Regular animation logic
      if (this === enemy) {
        this.adjustFrames(-1); // Reverse animation for enemy
      } else {
        this.adjustFrames(1); // Regular animation for other sprites
      }
    }
    // ... (rest of your update logic)
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "cyan",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    animationDuration = 100,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.animationDuration = animationDuration;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastkey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    console.log(this.sprites);
  }



  update() {
    this.draw();

    if (this === enemy) {
      this.adjustFrames(-1); // Reverse animation for enemy
    } else {
      this.adjustFrames(1); // Regular animation for other sprites
    }
    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // gravity algo
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      this.position.y = 426;
    } else this.velocity.y += gravity;
  }

  async attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    await this.waitForAnimation(); // Wait for the attack animation to finish
    this.isAttacking = false;
  }

  async waitForAnimation() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }
  attack2() {
    this.switchSprite("attack2");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  switchSprite(sprite) {
    if (
      (this.image === this.sprites.attack1.image &&
        this.framesCurrent < this.sprites.attack1.framesMax - 1) ||
      (this.image === this.sprites.attack2.image &&
        this.framesCurrent < this.sprites.attack2.framesMax - 1)
    )
      return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }

        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }

        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }

        break;

      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }

        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }

        break;

      case "attack2":
        if (this.image !== this.sprites.attack2.image) {
          this.image = this.sprites.attack2.image;
          this.framesMax = this.sprites.attack2.framesMax;
          this.framesCurrent = 0;
        }

        break;
    }
  }
}
