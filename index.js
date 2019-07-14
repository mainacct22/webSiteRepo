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
let platform;
let sandbag;
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
let invPlatform;
let invTrack;
let lblDist;
let lblDmg;
let dist;
let dmg;
let xDif;
let yDif;
let myPointer;

function preload() {
    
    this.load.image("cloud_1", "assets/clouds_1_600.png");
    this.load.image("cloud_2", "assets/clouds_2_600.png");
    this.load.image("cloud_3", "assets/clouds_3_600.png");
    this.load.image("cloud_4", "assets/clouds_4_600.png");
    this.load.image("rock_1",  "assets/rocks_1_600.png");
    this.load.image("rock_2",  "assets/rocks_2_600.png");
    this.load.image("sky",     "assets/sky_600.png");
	
	this.load.image("track",   "assets/simpleTrack.png");
	this.load.image("sandbag", "assets/sandbag1.png");
    this.load.image("platform", "assets/platform_a.png");
	this.load.image("invPlatform", "assets/invPlatform.png")

}

function create() {
	
	this.matter.world.setBounds(0,0, 800 * 12, 600);
	
  
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
	
	
	//Add the track to the scene
	let x;
	for(x = 255; x < (gameWidth * 12) - 43; x += 43) {
		
		this.add.image(x, 550, "track");
	}
	
	//place the inv platform on the track
	invTrack = this.matter.add.image(255, 558, "invPlatform");
	invTrack.displayWidth = gameWidth * 16;
	invTrack.displayHeight = 10;
	invTrack.setStatic(true);
	invTrack.setFriction(0.003);
	
	//Add platform and inv Platform 
	platform = this.add.image(115, 500, "platform");
	invPlatform = this.matter.add.image(110,490, "invPlatform");
	invPlatform.displayWidth = 200;
	invPlatform.displayHeight = 10;
	invPlatform.setStatic(true);
	invPlatform.setFriction(0.009);
	

	//Add sandbag and use matter.js
    sandbag = this.matter.add.image(120, 250, "sandbag");
	sandbag.setFriction(0.05);
	sandbag.setFrictionAir(0.0005);
	
	//Set interactive so the matter object is clickable
	sandbag.setInteractive();
	
	
	dmg = 0;
	
	//Matter.js orients x & y coords in the center of the object, so pointer.x > sandbag.x
	//means that the pointer touched the right side of the object
	sandbag.on('pointerup', function (pointer) {
		
		if(pointer.x > sandbag.x)
		{
			//right side
			if (pointer.getDuration() < 600)
			{
			
			  if ( dmg < 100)
			  {
			    dmg += 5;
				sandbag.setVelocity(-.05 * dmg , -.08 * dmg);
			  }
			  else
			  {
				dmg += 8;
				sandbag.setVelocity(-.15 * dmg , -.24 * dmg);
			  }
			}
			else
			{
				dmg += 30;
				sandbag.setVelocity(-.5 * dmg, -.4 * dmg);
				//console.log("longpress");
				//console.log("Down " + pointer.downTime);
				//console.log("Up " + pointer.upTime);
				//console.log("Duration " + pointer.getDuration());
			}
		}
		else
		{
			if (pointer.getDuration() < 600)
			{
			  if (dmg < 100)
			  {
				  dmg += 5;
				  sandbag.setVelocity(.05 * dmg, -.08 * dmg);
			  }
			  else
			  {
				  dmg += 8;
				  sandbag.setVelocity(.15 * dmg, -.24 * dmg);
			  }
		    }
			else
			{
				dmg += 30;
				sandbag.setVelocity(.5 * dmg, -.4 * dmg);
			}
			
		}	
		
	});
	

	//sandbag.setAngularVelocity(5,-5);
	//sandbag.applyForce(-5, -5);
	//sandbag.setVelocityX(-5);
	//sandbag.setVelocityY(-5);
			
  camera = this.cameras.main;
  camera.setBounds(0, 0, 800 * 12, 600);
  camera.startFollow(sandbag);

  //cursors = this.input.keyboard.createCursorKeys();
  //const controlConfig = {
  //    camera: this.cameras.main,
  //    left: cursors.left,
  //    right: cursors.right,
  //    up: cursors.up,
  //    down: cursors.down,
  //    speed: 0.5
  //  };
    
  //this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

  // Help text that has a "fixed" position on the screen
  lblDmg = this.add
      .text(100, 16, 'Damage = ' + dmg, {
      font: "18px monospace",
      fill: "#000000",
      padding: { x: 20, y: 10 },
      backgroundColor: "#ffffff"
    })
    .setScrollFactor(0)
    .setDepth(30);
	
  lblDist = this.add
      .text(300, 16, 'Distance = 0 ft', {
      font: "18px monospace",
      fill: "#000000",
      padding: { x: 20, y: 10 },
      backgroundColor: "#ffffff"
    })
    .setScrollFactor(0)
    .setDepth(30);

  // Debug graphics
}

function update(time, delta) {
    
    cloud_1.tilePositionX = camera.scrollX * .2;
    cloud_2.tilePositionX = camera.scrollX * .45;
    rock_1.tilePositionX = camera.scrollX * .6;
    cloud_3.tilePositionX = camera.scrollX * .75;
    rock_2.tilePositionX = camera.scrollX * .8;
    cloud_4.tilePositionX = camera.scrollX * .9;
    
    sky.tilePositionX = camera.scrollX;
	
	
	if (sandbag.x > 300)
	{
		xDif = 120 - sandbag.x;
		yDif = 0 - 0;
		dist = Math.sqrt(xDif * xDif + yDif * yDif);
		dist = dist/16;
		dist = +dist.toFixed(2);
		//dist = Phaser.Math.distance(120,0,sandbag.x,0)
		lblDist.text = 'Distance = ' + dist + ' ft'; 
	}
	
	lblDmg.text = 'Damage = ' + dmg;
	
		
	
    
    //this.controls.update(delta);

}