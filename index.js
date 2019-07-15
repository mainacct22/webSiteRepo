const config = {
  type: Phaser.AUTO,
  scale: {
	  parent: 'game-container',
	  mode: Phaser.DOM.FIT,
	  autoCenter: Phaser.DOM.CENTER_BOTH,
	  width: 800,
	  height: 600
  },
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

//width: window.innerWidth * window.devicePixelRatio,
//height: window.innerHeight * window.devicePixelRatio,
//parent: "game-container",

const game = new Phaser.Game(config);
const gameWidth = window.innerWidth * window.devicePixelRatio;
const gameHeight = window.innerHeight * window.devicePixelRatio;
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
let trackLength;
let timedEvent;
let lblTime;

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
	this.load.image("invPlatform", "assets/invPlatform.png");

}

function create() {
	
	
	this.matter.world.setBounds(0,0, gameWidth * 18, gameHeight);
	
  
    sky = this.add.tileSprite(0, 0, gameWidth, gameHeight, "sky");
    sky.setOrigin(0,0);
    sky.setScrollFactor(0);
    
    // create a tiled sprite with the size of our game screen
    cloud_1 = this.add.tileSprite(0, 0, gameWidth, gameHeight, "cloud_1");
    // Set its pivot to the top left corner
    cloud_1.setOrigin(0, 0);
    // fix it so it won't move when the camera moves.
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
	for(x = 255; x < (gameWidth * 18) - 43; x += 43) {
		
		this.add.image(x, gameHeight - 20, "track");
		trackLength = x;
	}
	
	//place the inv platform on the track
	invTrack = this.matter.add.image(255, gameHeight - 12, "invPlatform");
	invTrack.displayWidth = trackLength;
	invTrack.displayHeight = 10;
	invTrack.setStatic(true);
	invTrack.setFriction(0.05);
	
	
	//Add platform and inv Platform 
	platform = this.add.image(115, gameHeight - 50, "platform");
	invPlatform = this.matter.add.image(110, gameHeight - 60, "invPlatform");
	invPlatform.displayWidth = 200;
	invPlatform.displayHeight = 10;
	invPlatform.setStatic(true);
	invPlatform.setFriction(0.04);
	

	//Add sandbag and use matter.js
    sandbag = this.matter.add.image(120, 250, "sandbag");
	sandbag.restitution = 0.3;
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
				sandbag.setVelocity(-.5 * dmg, -.25 * dmg);
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
				sandbag.setVelocity(.5 * dmg, -.25 * dmg);
			}
			
		}	
		
	});
	

	//sandbag.setAngularVelocity(5,-5);
	//sandbag.applyForce(-5, -5);
	//sandbag.setVelocityX(-5);
	//sandbag.setVelocityY(-5);
			
  camera = this.cameras.main;
  camera.setBounds(0, 0, gameWidth * 18, gameHeight);
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
	

  lblTime = this.add
       .text(200, 100, 'Time = 10', {
	   font: "18px monospace",
       fill: "#000000",
       padding: { x: 20, y: 10 },
       backgroundColor: "#ffffff"
	   })
	   .setScrollFactor(0)
	   .setDepth(30);
  //TIMER CODE SHOULD GO HERE AND NOT AT THE BEGINNING OF CREATE

    timedEvent = this.time.addEvent({ delay: 10000, repeat: 0});
	

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
		sandbag.removeInteractive();
		xDif = 120 - sandbag.x;
		yDif = 0 - 0;
		dist = Math.sqrt(xDif * xDif + yDif * yDif);
		dist = dist/16;
		dist = +dist.toFixed(2);
		//dist = Phaser.Math.distance(120,0,sandbag.x,0)
		lblDist.text = 'Distance = ' + dist + ' ft'; 
	}
	
	lblDmg.text = 'Damage = ' + dmg;
	
	lblTime.text = 'Time = ' + timedEvent.getProgress;
	
		
	
    
    //this.controls.update(delta);

}

/*
function resizeApp ()
{
	// Width-height-ratio of game resolution
    // Replace 360 with your game width, and replace 640 with your game height
	let game_ratio		= 800 / 600;
	
	// Make div full height of browser and keep the ratio of game resolution
	let div			= document.getElementById('phaser-app');
	div.style.width		= (window.innerHeight * game_ratio) + 'px';
	div.style.height	= window.innerHeight + 'px';
	
	// Check if device DPI messes up the width-height-ratio
	let canvas			= document.getElementsByTagName('canvas')[0];
	
	let dpi_w	= parseInt(div.style.width) / canvas.width;
	let dpi_h	= parseInt(div.style.height) / canvas.height;		
	
	let height	= window.innerHeight * (dpi_w / dpi_h);
	let width	= height * game_ratio;
	
	// Scale canvas	
	canvas.style.width	= width + 'px';
	canvas.style.height	= height + 'px';
}


      #game-container {
        min-width: 100vw;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
*/
