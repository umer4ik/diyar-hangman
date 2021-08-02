import * as Phaser from 'phaser'
import './index.scss'

// const noop = (arg: Phaser.Game) => {};
function preload() {
  this.load.image('sky', 'assets/sky.png')
  this.load.image('ground', 'assets/platform.png')
  this.load.image('star', 'assets/star.png')
  this.load.image('bomb', 'assets/bomb.png')
  this.load.spritesheet('dude',
    'assets/dude.png',
    { frameWidth: 32, frameHeight: 48 })
}

let platforms: Phaser.Physics.Arcade.StaticGroup
let stars: Phaser.Physics.Arcade.Group
let player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
let cursors: Phaser.Types.Input.Keyboard.CursorKeys
let bombs: Phaser.Physics.Arcade.Group
let score = 0
let scoreText: Phaser.GameObjects.Text
let gameOver: Boolean

function collectStar(
  p: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  star: Phaser.Types.Physics.Arcade.SpriteWithStaticBody,
) {
  // console.log(star)
  star.disableBody(true, true)
  score += 10
  scoreText.setText(`Score: ${score}`)
  if (stars.countActive(true) === 0) {
    stars.children.iterate((child: any) => {
      child.enableBody(true, child.x, 0, true, true)
    })

    const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

    const bomb = bombs.create(x, 16, 'bomb')
    bomb.setBounce(1)
    bomb.setCollideWorldBounds(true)
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
  }
}

function hitBomb(
  p: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
) {
  this.physics.pause()

  p.setTint(0xff0000)

  p.anims.play('turn')

  gameOver = true
}

function create() {
  const self: Phaser.Scene = this
  self.add.image(400, 300, 'sky')
  platforms = self.physics.add.staticGroup()
  platforms.create(400, 568, 'ground').setScale(2).refreshBody()

  platforms.create(600, 400, 'ground')
  platforms.create(50, 250, 'ground')
  platforms.create(750, 220, 'ground')

  player = self.physics.add.sprite(100, 450, 'dude')
  player.setBounce(0.2)
  player.setCollideWorldBounds(true)
  self.anims.create({
    key: 'left',
    frames: self.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  })
  self.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20,
  })

  self.anims.create({
    key: 'right',
    frames: self.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  })
  self.physics.add.collider(player, platforms)
  cursors = self.input.keyboard.createCursorKeys()

  stars = self.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  })
  stars.children.iterate((child: any) => {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
  })
  self.physics.add.collider(stars, platforms)
  self.physics.add.overlap(player, stars, collectStar, null, this)
  scoreText = self.add.text(16, 16, 'score: 0', { fontSize: '32px', color: '#fff' })

  bombs = self.physics.add.group()
  self.physics.add.collider(bombs, platforms)
  self.physics.add.collider(player, bombs, hitBomb, null, self)
}

function update() {
  if (gameOver) {
    return
  }
  if (cursors.left.isDown) {
    player.setVelocityX(-160)
    player.anims.play('left', true)
  } else if (cursors.right.isDown) {
    player.setVelocityX(160)
    player.anims.play('right', true)
  } else {
    player.setVelocityX(0)
    player.anims.play('turn')
  }
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330)
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
}
/* eslint-disable @typescript-eslint/no-unused-vars */
const game = new Phaser.Game(config)
/* eslint-enable @typescript-eslint/no-unused-vars */
