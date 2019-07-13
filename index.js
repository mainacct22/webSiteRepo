const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "matter",
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);
const gameWidth = 800;
const gameHeight = 600;
let cursors;
let player;
let showDebug = false;
let cloud_1;
let cloud_2;
let cloud_3;
let cloud_4;
let rock_1;
let rock_2;
let sky;
let camera;
let track;

function preload() {
    
    this.load.image("cloud_1", "assets/clouds_1_600.png");
    this.load.image("cloud_2", "assets/clouds_2_600.png");
    this.load.image("cloud_3", "assets/clouds_3_600.png");
    this.load.image("cloud_4", "assets/clouds_4_600.png");
    this.load.image("rock_1",  "assets/rocks_1_600.png");
    this.load.image("rock_2",  "assets/rocks_2_600.png");
    this.load.image("sky",     "assets/sky_600.png");
	
	this.load.image("track",   "assets/simpleTrack.png");
    

}

function create() {
  
    sky = this.add.tileSprite(0, 0, gameWidth, gameHeight, "sky");
    sky.setOrigin(0,0);
    sky.setScrollFactor(0);
    
  // create an tiled sprite with the size of our game screen
    cloud_1 = this.add.tileSprite(0, 0, gameWidth, gameHeight, "cloud_1");
    // Set its pivot to the top left corner
    cloud_1.setOrigin(0, 0);
    // fixe it so it won't move when the camera moves.
    // Instead we are moving its texture on the update
    cloud_1.setScrollFactor(0);
    
    cloud_2 = this.add.tileSprite(0, 0, gameWidth, gameHeight, "cloud_2");
    cloud_2.setOrigin(0,0);
    cloud_2.setScrollFactor(0);
    
    rock_1 = this.add.tileSprite(0, 0, gameWidth, gameHeight, "rock_1");
    rock_1.setOrigin(0,0);
    rock_1.setScrollFactor(0);
    
    cloud_3 = this.add.tileSprite(0, 0, gameWidth, gameHeight, "cloud_3");
    cloud_2.setOrigin(0,0);
    cloud_2.setScrollFactor(0);
    
    rock_2 = this.add.tileSprite(0, 0, gameWidth, gameHeight, "rock_2");
    rock_2.setOrigin(0,0);
    rock_2.setScrollFactor(0);
    
    cloud_4 = this.add.tileSprite(0, 0, gameWidth, gameHeight, "cloud_4");
    cloud_4.setOrigin(0,0);
    cloud_4.setScrollFactor(0);
	
	
	
	let x;
	for(x = 433; x < (gameWidth * 12) - 43; x += 43) {
		
		this.add.image(x, 550, "track");
	}
	
  // Create a sprite with physics enabled via the physics system. The image used for the sprite has
  // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
  //player = this.matter.



  camera = this.cameras.main;
  //camera.startFollow(player);
  camera.setBounds(0, 0, 800 * 12, 600);

  cursors = this.input.keyboard.createCursorKeys();
  const controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5
    };
    
  this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

  // Help text that has a "fixed" position on the screen
  //this.add
  //    .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
//      font: "18px monospace",
//      fill: "#000000",
//      padding: { x: 20, y: 10 },
//      backgroundColor: "#ffffff"
//    })
//    .setScrollFactor(0)
//    .setDepth(30);

  // Debug graphics
}

function update(time, delta) {
    
    cloud_1.tilePositionX = camera.scrollX * .2;
    cloud_2.tilePositionX = camera.scrollX * .45;
    rock_1.tilePositionX = camera.scrollX * .6;
    cloud_3.tilePositionX = camera.scrollX * .75;
    rock_2.tilePositionX = camera.scrollX * .9;
    cloud_4.tilePositionX = camera.scrollX * .85;
    
    sky.tilePositionX = camera.scrollX;
    
    this.controls.update(delta);

}