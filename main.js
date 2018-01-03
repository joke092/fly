// tworzy naszego state ktory bedzie zawierał gre
var State = {
    preload: function() {
        game.load.image('bird', 'assets/icons8-JavaScript-50.png');
        game.load.image('pipe', 'assets/icons8-Source-Code.png');
        game.load.audio('jump', 'assets/jump.wav');
        game.load.image("background", "assets/bg.png");
    },

    create: function() {
        //dodaje tło
        game.add.tileSprite(0, 0, 1000, 600, 'background');

        // set system physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // show icon on the screen x=100 and y=245
        this.bird = game.add.sprite(100, 145, 'bird');

        // add physics for icon js
        // need for displacement gravity
        game.physics.arcade.enable(this.bird);

        // add gravity for bird
        this.bird.body.gravity.y = 900;

        // call function jump when you press space button
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.pipes = game.add.group();

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",
            { font: "30px Arial", fill: "#ffffff" });
        this.bird.anchor.setTo(-0.2, 0.5);

        this.jumpSound = game.add.audio('jump');
    },

    update: function() {
        // jesli ptak jest po za ekranem zbyt wysoko lub zbyt nisko.
        // wywołaj funkcje 'restartGame'.
        if (this.bird.y < 0 || this.bird.y > 490)
            this.restartGame();
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
        if (this.bird.angle < 20)
            this.bird.angle += 1;


    },
    // Make the bird jump
    jump: function() {
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -300;
        // Create an animation on the bird
        var animation = game.add.tween(this.bird);

        // Change the angle of the bird to -20° in 100 milliseconds
        animation.to({angle: -20}, 100);

        // And start the animation
        animation.start();

        if (this.bird.alive == false)
            return;

        this.jumpSound.play();

    },
    addOnePipe: function(x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Automatically kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function() {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 6) + 1;

        // add seven obstacles
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 10);
        this.score += 1;
        this.labelScore.text = this.score;

    },
    hitPipe: function() {
        // jesli ptak uderzy w rure nie rób nic.
        // meaning that bird fall down the screan
        if (this.bird.alive == false)
            return null;

        // set value life bird on true
        this.bird.alive = false;

        // stop create new pipes
        game.time.events.remove(this.timer);

        // go through by all pipes
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },
    // restart game
    restartGame: function() {
        // urochon' state, ktory restartuje gre
        game.state.start('main');
    }
};

// create game about size 1000 na 490 pikseli
var game = new Phaser.Game(1000, 490);

// add state and call main
game.state.add('main', State);

// on state that start game
game.state.start('main');
