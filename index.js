const config = {
  type: Phaser.AUTO,
  scale: {
	  parent: 'game-container',
	  mode: Phaser.DOM.FIT,
	  autoCenter: Phaser.DOM.CENTER_BOTH,
	  width: 1280,
	  height: 720
  },
  pixelArt: true,
  physics: {
    default: "arcade",
	arcade: {
        gravity: { y: 1000},
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
let scaleX = gameWidth / 1280;
let scaleY = gameHeight / 720;
let cursors;
let player;
let platform;
let heavyBag;
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
let worldPoint;
let angle;

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
    console.log("preload");

	this.load.image("tiles", "assets/tiles_packed.png");
	this.load.tilemapCSV("mapAbove", "assets/SmashZBagMap2_Above.csv");
    this.load.tilemapCSV("mapGround", "assets/SmashZBagMap2_Ground.csv");
    //this.load.tilemapTiledJSON("map", "assets/SmashZBagMap2.json");
    
    this.load.image("heavyBag", "assets/sandbag1.png");
    this.load.image("invPlatform", "assets/invPlatform.png");
}

function create() {
	
    gameScene = this.scene;
    
    this.cameras.main.setBackgroundColor('#ff8c1a')
    
    //this.world.setBounds(0,0, gameWidth * 36, gameHeight);
    //Phaser.Physics.Arcade.World.setBounds(0,0, gameWidth * 36, gameHeight);
    //gameScene.input.enabled = true;
	//Set the bounds of the scene
	//this.game.world.setBounds(0,0, gameWidth * 36, gameHeight);
    console.log(this.game.world);
	
    
	const mapGround = this.make.tilemap({ key: "mapGround", tileWidth: 16, tileHeight: 16});
    
    
    
    //const map = this.add.tilemap("map");
    
    
	//const tileset = map.addTilesetImage("tiles_packed", "tiles");
    const tilesetGround = mapGround.addTilesetImage("tiles");
	// layer index, tileset, x, y
	const groundLayer = mapGround.createStaticLayer(0, tilesetGround, 0, gameHeight/4);
    
	//const aboveLayer = map.createStaticLayer("Above", tileset, 0, 0);
    //const groundLayer = map.createStaticLayer("Ground", tileset, 0, 0);
    
    //groundLayer.setCollisionByProperty({ collides: true});
    //5307,5334
    //groundLayer.setCollisionBetween(5300,5334);
    //10263,10610
    //groundLayer.setCollisionBetween(10263,10610);

    //var force = (radius - distance) / mass;

    
    heavyBag = this.physics.add.sprite(50,100, "heavyBag");
    heavyBag.setDisplaySize(62,122);
    heavyBag.setCollideWorldBounds(false);
    heavyBag.friction = 0.8;
    heavyBag.setGravity(0,0);
    heavyBag.mass = 10;
    heavyBag.allowDrag = true;
    heavyBag.allowRotation = true;
    heavyBag.setBounce(0.3, 0.2);
    heavyBag.setInteractive();
    
    const mapAbove = this.make.tilemap({ key: "mapAbove", tileWidth: 16, tileHeight: 16});
    const aboveLayer = mapAbove.createStaticLayer(0, tilesetGround, 16 * 12, gameHeight/4);
    
    
    camera = this.cameras.main;
    camera.setBounds(0, 0, gameWidth * 36, gameHeight);
    camera.startFollow(heavyBag);
    
	//hitImage = scene.add.image(0,0, "hitImage");
	//hitImage.visible = false;
       
    invPlatform = this.physics.add.sprite(0, gameHeight/4 + (15 * 16),"invPlatform");
    invPlatform.displayWidth = 16 * 28;
    invPlatform.displayHeight = 16;
    invPlatform.setCollideWorldBounds(true);
    invPlatform.debugBodyColor = 2;
    invPlatform.body.debugShowBody = true;
    invPlatform.body.allowGravity = false;
    invPlatform.body.immovable = true;
    //invPlatform.body.friction = 0.1
    
    invLeft = this.physics.add.sprite(0, invPlatform.body.position.y,"invPlatform");
    invLeft.displayWidth = 16;
    invLeft.displayHeight = gameHeight/2;
    invLeft.debugBodyColor = 2;
    invLeft.body.debugShowBody = true;
    invLeft.body.allowGravity = false;
    invLeft.body.immovable = true;
    
    invRight = this.physics.add.sprite(invPlatform.displayWidth + 16, invPlatform.body.position.y,"invPlatform");
    invRight.displayWidth = 16;
    invRight.displayHeight = gameHeight/2;
    invRight.debugBodyColor = 2;
    invRight.body.debugShowBody = true;
    invRight.body.allowGravity = false;
    invRight.body.immovable = true;
    
    
    invTrack = this.physics.add.sprite(gameWidth * 5, gameHeight/4 + (28 * 16), "invPlatform");
    invTrack.displayWidth = gameWidth * 5;
    invTrack.displayHeight = 16;
    invTrack.debugBodyColor = 2;
    invTrack.body.debugShowBody = true;
    invTrack.body.allowGravity = false;
    invTrack.body.immovable = true;
    //invTrack.allowDrag = true;
    
    
	/*
	invLeft.frictionStatic = 0;
	invLeft.restitution = .5;
	
	invRight.frictionStatic = 0;
	invRight.restitution = .5;
	*/
    
    
    //this.physics.add.collider(heavyBag, groundLayer);
    this.physics.add.collider(heavyBag, invLeft);
    this.physics.add.collider(heavyBag, invRight);
    this.physics.add.collider(heavyBag, invPlatform);
    this.physics.add.collider(heavyBag, invTrack);
    	

	//Add heavyBag and use matter.js
	/*
    heavyBag = this.matter.add.image(170, 250, "heavyBag");
	heavyBag.restitution = 0.3;
	heavyBag.setFriction(0.08);
	heavyBag.setFrictionAir(0.0005);
	heavyBag.body.label = 'heavyBag';
	heavyBag.setMass(100);
	*/
	
	
	
	
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
	
	/*
	
	tap = this.rexGestures.add.tap(heavyBag, {
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
		
		
		if(tap.x > heavyBag.x)
		{
			//right side
			if ( dmg < 100)
			{
			    dmg += 5;
				heavyBag.setVelocity(-.05 * dmg , -.08 * dmg);
			}
			else
			{
				dmg += 8;
				heavyBag.setVelocity(-.15 * dmg , -.24 * dmg);
			}
		}
		else
		{
			if (dmg < 100)
			{
				dmg += 5;
				heavyBag.setVelocity(.05 * dmg, -.08 * dmg);
			}
			else
			{
				dmg += 8;
				heavyBag.setVelocity(.15 * dmg, -.24 * dmg);
			}
		}
	});
	
	
	press.on('pressend', function(press) {
		console.log("press ended");
		
		if(press.x > heavyBag.x)
		{
			//right side
			dmg += 30;
			heavyBag.setVelocity(-.5 * dmg, -.25 * dmg);
		}
		else
		{
			dmg += 30;
			heavyBag.setVelocity(.5 * dmg, -.25 * dmg);
		}
		
	});
	
	*/
	
	dmg = 0;
	
	//Matter.js orients x & y coords in the center of the object, so pointer.x > heavyBag.x
	//means that the pointer touched the right side of the object
	
    
	heavyBag.on('pointerup', function (pointer) {
		
		console.log("heavyBag.x = " + heavyBag.x);
        console.log("pointer.x = " + pointer.x);
		//customAngle = Math.random() * 360;
		//hitEmitter.emitParticleAt(pointer.x,pointer.y);
 
        angle = Phaser.Math.Angle.Between(-heavyBag.x, -heavyBag.y, -pointer.x,-pointer.y)
        //var force = (radius - distance) / mass;
        
         
        if (pointer.getDuration() < 600)
        {
            if (dmg < 100)
            {
                dmg += 5;
                heavyBag.body.velocity.x += Math.cos(angle) * (dmg * 10);
                heavyBag.body.velocity.y += Math.sin(angle) * (dmg * 20);
               //heavyBag.applyForce({x: .01 * dmg, y: -.05 * dmg}, {x: pointer.x, y: pointer.y});
	           //heavyBag.setVelocity(.05 * dmg, -.08 * dmg);
            }
            else
            {
	           dmg += 8;
               heavyBag.body.velocity.x += Math.cos(angle) * (dmg * 15);
               heavyBag.body.velocity.y += Math.sin(angle) * (dmg * 25);
               //heavyBag.applyForce({x: .1 * dmg, y: -.15 * dmg}, {x: pointer.x, y: pointer.y});
	           //heavyBag.setVelocity(.15 * dmg, -.24 * dmg);
            }
        }
        else
        {
	         dmg += 30;
             heavyBag.body.velocity.x += Math.cos(angle) * (dmg * 100);
             heavyBag.body.velocity.y += Math.sin(angle) * (dmg * 15);
             //heavyBag.applyForce({x: .1 * dmg, y: -.1 * dmg}, {x: pointer.x, y: pointer.y});
	          //heavyBag.setVelocity(.5 * dmg, -.25 * dmg);
        }
        
		
	});
	
	
	  
  
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
	  
	  if (bodyA.label === 'floor' && bodyB.label === 'heavyBag')
	  {
		  //if(Math.floor(heavyBag.body.velocity.x) < 8)
		  //{
			if (startSmokeEmitter)
			{
				customAngle = Math.random() * 360;
				smokeEmitter.startFollow(heavyBag, -(heavyBag.width/2.5), heavyBag.height/4.25, false);
				smokeEmitter.start();
				startSmokeEmitter = false;
			}
		  //}	
	  }	  
  });
  
  this.matter.world.on('collisionend', function (event,bodyA,bodyB)
  {
	  if (bodyA.label === 'floor' && bodyB.label === 'heavyBag')
	  {
		  if (!startSmokeEmitter)
		  {
			  smokeEmitter.stop();
			  startSmokeEmitter = true;
		  }  		
	  }  
  });
  */
  
  
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
	if (heavyBag.x > 300)
	{
		heavyBag.removeInteractive();
		xDif = 120 - heavyBag.x;
		yDif = 0 - 0;
		dist = Math.sqrt(xDif * xDif + yDif * yDif);
		dist = dist/16;
		dist = +dist.toFixed(2);
		//dist = Phaser.Math.distance(120,0,heavyBag.x,0)
		lblDist.text = 'Distance = ' + dist + ' ft'; 
	}
	*/
	
	lblDmg.text = 'Damage = ' + dmg;	
	seconds = timedEvent.getProgress() * 10;
	seconds = seconds.toFixed(0)
	lblTime.text = 'Time = ' + (10 - seconds);
    
    
	//timedEvent.elapsed / timedEvent.delay
	
	
	if (seconds >= 7)
	{
		if (setBounds)
		{
            invLeft.destroy();
            invRight.destroy();
			setBounds = false;
		}
		
	}
	
	
	
	if(seconds >= 10)
	{
		//Add Back In after testing
		//heavyBag.removeInteractive();

		/*
		if(Math.floor(heavyBag.body.velocity.x) < 1 && Math.floor(heavyBag.body.velocity.y) < 1)
			//|| (Math.floor(heavyBag.body.velocity.x) < -1 && Math.floor(heavyBag.body.velocity.y < -1)))
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
	if(Math.floor(heavyBag.body.velocity.x) < 4)
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
	//setBounds = true;
	//startSmokeEmitter = true;
	//dmg = 0;
	//dist = 0;
	//gameScene.restart();	
}

function enterButtonHoverState()
{
	btnRestart.setStyle({ fill: '#008B8B'});
}

function enterButtonRestState() 
{
	
	btnRestart.setStyle({ fill: '#00008B' });	
}