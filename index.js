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
    default: "arcade",
	arcade: {
		debug: false
	}
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
let scaleX = gameWidth / 800;
let scaleY = gameHeight / 600;
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
let seconds;
let clicked = false;
let gameScene;

let invLeft;
let invRight;
let setBounds = true;

let whiteSmoke;
let hitImage;

let btnRestart;
let particles;
let smokeEmitter;
let hitEmitter;
let startHitEmitter = true;
let startSmokeEmitter = true;
let customAngle;

//Gestures
let tap;
let swipe;
let press;

function preload() {
	
	/*
	this.load.scenePlugin({
        key: 'rexuiplugin',
        url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
        sceneKey: 'rexUI'
    });
	*/
	/*
	this.load.scenePlugin({
        key: 'rexgesturesplugin',
        url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexgesturesplugin.min.js',
        sceneKey: 'rexGestures'
    });
	*/
	
    
	//First, we have to load images so the game is aware of them

	this.load.image("tiles", "assets/tiles_packed.png");
	this.load.tilemapTiledJSON("map", "assets/SmashZBagMap2.json");
}

function create() {
	
	//Set the bounds of the scene
	//this.matter.world.setBounds(0,0, gameWidth * 36, gameHeight);
	
	const map = this.make.tilemap({ key: "map"});
	const tileset = map.addTilesetImage("tiles_packed", "tiles");
	// layer index, tileset, x, y
	const worldLayer = map.createStaticLayer("Ground", tileset, 0, 0);
	const aboveLayer = map.createStaticLayer("Above", tileset, 0, 0);

	//hitImage = scene.add.image(0,0, "hitImage");
	//hitImage.visible = false;

	
	
	
	
	//Left
	/*
	invLeft = this.matter.add.rectangle(platform.x - platform.width/2 - 40, gameHeight/2, 80, gameHeight, {isStatic: true});
	//Right
	invRight = this.matter.add.rectangle(platform.x + platform.width/2 + 40, gameHeight/2, 80, gameHeight, {isStatic: true});
	
	invLeft.frictionStatic = 0;
	invLeft.restitution = .5;
	
	invRight.frictionStatic = 0;
	invRight.restitution = .5;
	*/

	

	//Add sandbag and use matter.js
	/*
    sandbag = this.matter.add.image(170, 250, "sandbag");
	sandbag.restitution = 0.3;
	sandbag.setFriction(0.08);
	sandbag.setFrictionAir(0.0005);
	sandbag.body.label = 'sandbag';
	sandbag.setMass(100);
	*/
	
	//sandbag.debugShowVelocity = true;
	
	//Set interactive so the matter object is clickable
	//sandbag.setInteractive();
	
	
	/*
	hitImage = this.add.particles('hitImage');
	hitEmitter = hitImage.createEmitter({
		lifespan: 125,
		scale: { start: 0.5, end: 0.75},
		alpha: { start: 1, end: 1},
		//speed: { min: 2, max: 5},
		angle: { min: 0, max: 360},
		//quantity: 1,
		//rotate: { onEmit: function () { return customAngle;}},
		rotate: { start: 0, end: 360 },
		on: false
	});
	*/

	
    /*
	*/
	gameScene = this.scene;
	
	/*
	
	tap = this.rexGestures.add.tap(sandbag, {
		enable: true,
		time: 100,
		tapInterval: 100,
		threshold: 9,
		tapOffset: 10
	});
	
	
	press = this.rexGestures.add.press(this.scene, {
		enable: true,
		time: 400,
		threshold: 9
	});
	
    
	tap.on('tap', function(tap){
		console.log("you tapped bro");
		console.log(tap);
		
		hitEmitter.emitParticleAt(tap.lastPointer.downX * window.devicePixelRatio,tap.lastPointer.downY * window.devicePixelRatio);
		console.log('tap.x = ' + tap.x);
		console.log('tap.y = ' + tap.y);
		
		
		if(tap.x > sandbag.x)
		{
			//right side
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
	});
	
	
	press.on('pressend', function(press) {
		console.log("press ended");
		
		if(press.x > sandbag.x)
		{
			//right side
			dmg += 30;
			sandbag.setVelocity(-.5 * dmg, -.25 * dmg);
		}
		else
		{
			dmg += 30;
			sandbag.setVelocity(.5 * dmg, -.25 * dmg);
		}
		
	});
	
	*/
	
	dmg = 0;
	
	//Matter.js orients x & y coords in the center of the object, so pointer.x > sandbag.x
	//means that the pointer touched the right side of the object
	/*
	sandbag.on('pointerup', function (pointer) {
		if (clicked = false)
		{
			clicked = true;
		}
	
		
		console.log("sandbag.x = " + sandbag.x);
		customAngle = Math.random() * 360;
		hitEmitter.emitParticleAt(pointer.x,pointer.y);
		
		
		if(pointer.x > sandbag.x)
		{
			//right side
			if (pointer.getDuration() < 600)
			{
			
			  if ( dmg < 100)
			  {
			    dmg += 5;
                sandbag.applyForce({x: -.01 * dmg, y: -.05 * dmg}, {x: pointer.x, y: pointer.y});
				//sandbag.setVelocity(-.05 * dmg , -.08 * dmg);
			  }
			  else
			  {
				dmg += 8;
                  sandbag.applyForce({x: -.1 * dmg, y: -.15 * dmg}, {x: pointer.x, y: pointer.y});
				//sandbag.setVelocity(-.15 * dmg , -.24 * dmg);
			  }
			}
			else
			{
				dmg += 30;
                sandbag.applyForce({x: -.1 * dmg, y: -.1 * dmg}, {x: pointer.x, y: pointer.y});
				//sandbag.setVelocity(-.5 * dmg, -.25 * dmg);
			}
		}
		else
		{
			if (pointer.getDuration() < 600)
			{
			  if (dmg < 100)
			  {
				  dmg += 5;
                  sandbag.applyForce({x: .01 * dmg, y: -.05 * dmg}, {x: pointer.x, y: pointer.y});
				  //sandbag.setVelocity(.05 * dmg, -.08 * dmg);
			  }
			  else
			  {
				  dmg += 8;
                  sandbag.applyForce({x: .1 * dmg, y: -.15 * dmg}, {x: pointer.x, y: pointer.y});
				  //sandbag.setVelocity(.15 * dmg, -.24 * dmg);
			  }
		    }
			else
			{
				dmg += 30;
                sandbag.applyForce({x: .1 * dmg, y: -.1 * dmg}, {x: pointer.x, y: pointer.y});
				//sandbag.setVelocity(.5 * dmg, -.25 * dmg);
			}
			
		}	
		
		
	});
	*/
	
	  
  
  /*
  whiteSmoke = this.add.particles('whiteSmoke');
  smokeEmitter = whiteSmoke.createEmitter({
	  lifespan: 200,
	  speed: { min: 20, max: 50},
	  scale: { start: 0.15, end: 0.25},
	  alpha: { start: 0.25, end: 0},
	  angle: { min: 0, max: 360} ,
	  blendMode: 'ADD'
  });
  smokeEmitter.setRadial(true);
  */
  
  //Collision Detection
  //collisionactive
  /*
  this.matter.world.on('collisionstart', function (event,bodyA,bodyB)
  {
	  
	  if (bodyA.label === 'floor' && bodyB.label === 'sandbag')
	  {
		  //if(Math.floor(sandbag.body.velocity.x) < 8)
		  //{
			if (startSmokeEmitter)
			{
				customAngle = Math.random() * 360;
				smokeEmitter.startFollow(sandbag, -(sandbag.width/2.5), sandbag.height/4.25, false);
				smokeEmitter.start();
				startSmokeEmitter = false;
			}
		  //}	
	  }	  
  });
  
  this.matter.world.on('collisionend', function (event,bodyA,bodyB)
  {

	  if (bodyA.label === 'floor' && bodyB.label === 'sandbag')
	  {
		  if (!startSmokeEmitter)
		  {
			  smokeEmitter.stop();
			  startSmokeEmitter = true;
		  }  		
	  }  
  });
  */

  //camera = this.cameras.main;
  //camera.setBounds(0, 0, gameWidth * 36, gameHeight);
  //camera.startFollow(sandbag);
  
  
  cursors = this.input.keyboard.createCursorKeys();
  const controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 5
    };
    
  this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
  
  

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
       .text(300, 100, 'Time = 10', {
	   font: "18px monospace",
       fill: "#000000",
       padding: { x: 20, y: 10 },
       backgroundColor: "#ffffff"
	   })
	   .setScrollFactor(0)
	   .setDepth(30);

	   
	btnRestart = this.add
		.text(100, 100, 'RETRY', {
		 fill: '#00008B', 
		 font: "36px monospace"})
		.setInteractive()
		.setScrollFactor(0)
		.on('pointerdown', () => restartGame() )
		.on('pointerover', () => enterButtonHoverState() )
		.on('pointerout', () => enterButtonRestState() );
		
	btnRestart.visible = false;
	btnRestart.removeInteractive();
	   
  //TIMER CODE SHOULD GO HERE AND NOT AT THE BEGINNING OF CREATE
  timedEvent = this.time.addEvent({ delay: 10000, repeat: 0});
  
  
  
	

}

function update(time, delta) {
    
	
	/*
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
	*/
	
	lblDmg.text = 'Damage = ' + dmg;	
	seconds = timedEvent.getProgress() * 10;
	seconds = seconds.toFixed(0)
	lblTime.text = 'Time = ' + (10 - seconds);
	//timedEvent.elapsed / timedEvent.delay
	
	/*
	if (seconds >= 7)
	{
		if (setBounds)
		{
			this.matter.world.remove(invLeft);
			this.matter.world.remove(invRight);
			setBounds = false;
		}
		
	}
	*/
	
	
	if(seconds >= 10)
	{
		//Add Back In after testing
		//sandbag.removeInteractive();

		/*
		if(Math.floor(sandbag.body.velocity.x) < 1 && Math.floor(sandbag.body.velocity.y) < 1)
			//|| (Math.floor(sandbag.body.velocity.x) < -1 && Math.floor(sandbag.body.velocity.y < -1)))
		{
			//game over
			//reset initializers
			btnRestart.setInteractive();
			btnRestart.visible = true;
			smokeEmitter.stop();
			startSmokeEmitter = false;
			
		}
		*/
		
	}
	
	
	/*
	if(Math.floor(sandbag.body.velocity.x) < 4)
	{
		if(!startSmokeEmitter)
		{
			smokeEmitter.stop();
		}
	}
	*/
	 
    this.controls.update(delta);
}

function restartGame()
{
	setBounds = true;
	startSmokeEmitter = true;
	dmg = 0;
	dist = 0;
	gameScene.restart();	
}

function enterButtonHoverState()
{
	btnRestart.setStyle({ fill: '#008B8B'});
}

function enterButtonRestState() 
{
	
	btnRestart.setStyle({ fill: '#00008B' });	
}
