
//----------------------------------------------------------------------

var app = {
    timestampStart: null,
    fps: 30,       
    
    start: function() {         
        app.timestampStart = new Date().getTime();
        $('#controls').show();
        $('#fps-toggle').click(function(e){
            e.preventDefault();
            app.fpsToggle();
        });
        $('#stretching-toggle').click(function(e){
            e.preventDefault();
            app.stretchingToggle();
        });        
        app.fpsCounter.Init();
        app.draw();        
    },
    // update document.body.className only when necessary        
    lastBodyClassId: null, 
    draw: function() {        
        requestAnimationFrame(app.draw);
        
        var ts = new Date().getTime();
        var past_ms = ts - app.timestampStart;
        var frame_every_ms = 1000 / (app.fps + 0.5); // 0.5 margin
        
        var frame = Math.floor(past_ms / frame_every_ms) % app.fps;
        
        // unique body class identificator (as integer)
        // chaning document.body.className when there is no need to do that cause frame drop
        var newBodyClassId = app.fps * 100 + frame + (app.stretchingEnabled ? 60000 : 0);
        
        if(newBodyClassId !== app.lastBodyClassId) {
            document.body.className = 'fps' + app.fps + ' f' + frame + (app.stretchingEnabled ? " stretch" : "");
                        
            app.lastBodyClassId = newBodyClassId;                             
            
            var currentTime = (app.fpsCounter.currentLoop = new Date) - app.fpsCounter.lastLoop;
            app.fpsCounter.time += (currentTime - app.fpsCounter.time) / app.fpsCounter.filter;
            app.fpsCounter.lastLoop = app.fpsCounter.currentLoop; 
        }
    },
    fpsToggle: function() {
        switch(app.fps) {
            case 30:                    
                app.fps = 60;
                $('#fps-toggle').html('Switch to 30 Fps');
                break;
            case 60:
                app.fps = 30;
                $('#fps-toggle').html('Switch to 60 Fps');
                break;                                    
        }            
        app.fpsCounter.reset();        
    },
    stretchingEnabled: true,
    stretchingToggle: function() {
        app.stretchingEnabled = !app.stretchingEnabled;        
        $('#stretching-toggle').html('Turn stretching ' +
            (app.stretchingEnabled ? 'off' : 'on')
        );        
    }
}

//----------------------------------------------------------------------

app.preloader = {
    animInterval: false,
    start: function() {
        app.preloader.animInterval = window.setInterval(function(){
            var $char = $('#preloader-anim');
            var char = $char.text();
            switch(char) {
                case "|": char = "/"; break;
                case "/": char = "-"; break;
                case "-": char = "\\"; break;
                case "\\": char = "|"; break;
            }
            $char.html(char);
        }, 50);                
    },
    stop: function() {
        if(app.preloader.animInterval) {
            window.clearInterval(app.preloader.animInterval);
            app.preloader.animInterval = false;
        }
        var $start = $('<button/>');
        $start.text('Start!');
        
        $('#preloader-inner').html($start);
        $start.click(function(e){
            e.preventDefault();
            app.start();
            app.preloader.remove();              
        });
    },
    remove: function() {
        $('#preloader').remove();
        $('#preloader-images').remove();
    }
}

//----------------------------------------------------------------------

// Frame counter idea by Phrogz
// http://stackoverflow.com/a/5111475

app.fpsCounter = {
    filter: 5,
    time: 0,
    lastLoop: new Date(),
    currentLoop: null,
    $rate: null,
    rate_obj: null,
    $warning: null,
    warningVisible: false,
    showWarning: function() {
        app.fpsCounter.$warning.show();            
        app.fpsCounter.warningVisible = true;
    },
    hideWarning: function() {
        app.fpsCounter.$warning.hide();            
        app.fpsCounter.warningVisible = false;
    },
    reset: function() {            
        app.fpsCounter.$rate.text('-');
        app.fpsCounter.rate_obj.className = '';
        app.fpsCounter.time = 0;
        app.fpsCounter.lastLoop = new Date();
        app.fpsCounter.currentLoop = null;
    },
    Init: function() {
        app.fpsCounter.$warning = $('#fps-warning');            
        app.fpsCounter.$rate = $('#frame-rate');
        app.fpsCounter.rate_obj = app.fpsCounter.$rate.get(0);
        app.fpsCounter.$rate.show();
        window.setInterval(function(){
            app.fpsCounter.update();                
        }, 500);
    },
    update: function(){
        var fps = (1000 / app.fpsCounter.time);
        if(fps > app.fps) {
            fps = app.fps;
        }
                
        app.fpsCounter.$rate.html(fps.toFixed(1));

        var minDiff, maxDiff;

        switch(app.fps) {
            case 30:
                minDiff = 3;
                maxDiff = 5;
                break;
            case 60:
                minDiff = 5;
                maxDiff = 10;
                break;                    
        }

        if((fps + minDiff) >= app.fps) {
            app.fpsCounter.rate_obj.className = 'green';
            if(app.fpsCounter.warningVisible) {
                app.fpsCounter.hideWarning();
            }
        }else if((fps + maxDiff) >= app.fps) {
            app.fpsCounter.rate_obj.className = 'orange';
            if(app.fpsCounter.warningVisible) {
                app.fpsCounter.hideWarning();
            }
        }else{
            app.fpsCounter.rate_obj.className = 'red';
            if(!app.fpsCounter.warningVisible) {
                app.fpsCounter.showWarning();
            }
        }
    }
}

//----------------------------------------------------------------------

$(document).ready(function(){
    app.preloader.start();    
});

$(window).load(function(){
    app.preloader.stop();    
});

//----------------------------------------------------------------------

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
