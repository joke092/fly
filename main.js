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

        // ustawia fizyke systemu
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // wyswietla ikonke js w pozycji x=100 and y=245
        this.bird = game.add.sprite(100, 145, 'bird');

        // dodaje fizyke ikonki js
        // potrzebne dla: przemieszczania sie, grawitacji, kolizji, etc.
        game.physics.arcade.enable(this.bird);

        // dodaje grawitacje do ptaka tworzac upadek
        this.bird.body.gravity.y = 900;

        // wywołanie fukcji jump po nacisniecu spacji
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

        // dodaje 7 przeszkód
        // zjednym duzym hole w pozycji hole i hole +1
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 10);
        this.score += 1;
        this.labelScore.text = this.score;

    },
    hitPipe: function() {
        // jesli ptak uderzy w rure nie rób nic.
        // oznacza to że ptak już spada z ekranu
        if (this.bird.alive == false)
            return null;

        // ustawia wartosc przezycia ptaka na false
        this.bird.alive = false;

        // zapobiega pojawienu sie nowych rur
        game.time.events.remove(this.timer);

        // Przejdź przez wszystkie rury i zatrzymaj ich ruch
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },
    // restartuje gre
    restartGame: function() {
        // urochon' state, ktory restartuje gre
        game.state.start('main');
    }
};

// Zainicjuj Phaser i utwórz grę o wymiarach 1000 na 490 pikseli
var game = new Phaser.Game(1000, 490);

// dodaj State i wywołaj main
game.state.add('main', State);

// Uruchom state, aby rozpocząć grę
game.state.start('main');