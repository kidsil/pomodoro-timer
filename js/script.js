/* Author: Egil Hansen */
(function ($) {

    var timerElm = $('#timer'),
        stateElm = $('#state .value'),
        pomoCountElm = $('#pomodoro-count .value'),
        state = {},
        countdown,
        updateState,
        setTarget,
        toogleTimer;

    state = {
        time: 0,
        target: 0,
        type: '',
        pomocount: 0,
        timeoutId: undefined
    };

    setTarget = function () {
        state.target = $('#' + state.type).val() * 60;
    };

    // (re)start the counter and update the display
    countdown = function () {
        var mins, secs;
        // restart timer and update time
        state.timeoutId = window.setTimeout(countdown, 1000);
        state.time += 1;

        mins = Math.floor(state.time / 60);
        secs = state.time % 60;

        // update rest of UI if needed
        if (state.time > state.target) {
            state.time = 0;
            updateState();
        } else {
            // prettify for output
            mins = mins < 10 ? "0" + mins : mins;
            secs = secs < 10 ? "0" + secs : secs;
            timerElm.text(mins + ":" + secs);
        }
    };

    // update the interface
    updateState = function () {
        // what kind of timer shoud we use now?
        if (state.type === 'work') {
            if (state.pomocount < 4) {
                // increment pomodoro counter
                state.type = 'break';
                stateElm.text("Break");
                $('h1, #state, #timer, #pomodoro-count')
                    .toggleClass('break')
                    .effect("pulsate", { times: 4 }, 500);
            } else {
                state.pomocount = 0;
                state.type = 'rest';
                stateElm.text("Rest");
                $('h1, #state, #timer, #pomodoro-count')
                    .toggleClass('rest')
                    .effect("pulsate", { times: 4 }, 500);
            }
        } else {
            state.pomocount += 1;
            pomoCountElm.text(state.pomocount);
            state.type = 'work';
            stateElm.text("Working");
            $('h1, #state, #timer, #pomodoro-count').removeClass();
        }

        // update target time
        setTarget();
    };

    toogleTimer = function () {
        // only on first start
        if (state.type === '') { updateState(); }

        // test if counting down, if so, pause, otherwise start
        if (typeof state.timeoutId == "number") {
            window.clearTimeout(state.timeoutId);
            state.timeoutId = undefined;
        } else {
            countdown();
        }
    };

    $(document).ready(function () {
        setTarget();

        $('fieldset input').on('change', function (e) {          
            setTarget();
        }).on('click', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
        });

        $('body').on('keypress', function (e) {
            var code = e.keyCode || e.which;
            // only continue if enter key is pressed
            if (code === 13) {
                toogleTimer();
            }
        });

        $('#container').on('click', function (e) {
            toogleTimer();
        });
    });

})(jQuery);
