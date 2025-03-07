(function() {

    var notesOffset = 0;

    var blackKeys = {
        1: 1,
        3: 3,
        6: 1,
        8: 2,
        10: 3
    };
    $.each(blackKeys, function(k, v) {
        blackKeys[k] = ' black black' + v;
    });

    function blackKeyClass(i) {
        return blackKeys[(i % 12) + (i < 0 ? 12 : 0)] || '';
    }

    var $keys = $('<div>', {'class': 'keys'}).appendTo('#piano');

    var buildingPiano = false;
    var isIos = navigator.userAgent.match(/(iPhone|iPad)/i);

    function buildPiano() {
        if (buildingPiano) return;
        buildingPiano = true;

        $keys.trigger('build-start.piano');
        $keys.empty().off('.play');

        function addKey(i) {
            var dataURI = isIos ? '' : Notes.getDataURI(i);
            var sounds = [
                new Audio(dataURI),
                new Audio(dataURI),
                new Audio(dataURI)
            ];
            var curSound = 0;
            var pressedTimeout;
            
            function play(evt) {
                sounds[curSound].pause();
                try {
                    sounds[curSound].currentTime = 0.001;
                } catch (x) {}
                sounds[curSound].play();
                curSound = ++curSound % sounds.length;

                var $k = $keys.find('[data-key='+i+']').addClass('pressed');
                $keys.trigger('played-note.piano', [i, $k]);

                // Отправляем событие с нажатой клавишей
                document.dispatchEvent(new CustomEvent("pianoKeyPress", { detail: { key: i } }));
                
                window.clearTimeout(pressedTimeout);
                pressedTimeout = window.setTimeout(function() {
                    $k.removeClass('pressed');
                }, 200);
            }
            
            $keys.on('note-'+i+'.play', play);
            $('<div>', {
                'class': 'key' + blackKeyClass(i),
                'data-key': i,
                mousedown: function(evt) { $keys.trigger('note-'+i+'.play'); }
            }).appendTo($keys);
        }

        for (var i = -12; i < 14; i++) {
            addKey(i + notesOffset);
        }

        buildingPiano = false;
        $keys.trigger('build-done.piano');
    }

    buildPiano();

    var keyNotes = {
        65: 0, 87: 1, 83: 2, 69: 3, 68: 4,
        70: 5, 84: 6, 71: 7, 89: 8, 72: 9,
        85: 10, 74: 11, 75: 12, 79: 13, 76: 14,
        80: 15, 186: 16, 59: 16, 222: 17, 221: 18,
        13: 19
    };
    var notesShift = -12;
    var downKeys = {};

    function isModifierKey(evt) {
        return evt.metaKey || evt.shiftKey || evt.altKey;
    }

    $(window).keydown(function(evt) {
        var keyCode = evt.keyCode;
        if (!downKeys[keyCode] && !isModifierKey(evt)) {
            downKeys[keyCode] = 1;
            var key = keyNotes[keyCode];
            if (typeof key != 'undefined') {
                var note = key + notesShift + notesOffset;
                $keys.trigger('note-' + note + '.play');

                evt.preventDefault();
            } else if (evt.keyCode == 188) {
                notesShift = -12;
            } else if (evt.keyCode == 190) {
                notesShift = 0;
            } else if (keyCode == 37 || keyCode == 39) {
                notesOffset += (keyCode == 37 ? -1 : 1) * 12;
                buildPiano();
            }
        }
    }).keyup(function(evt) {
        delete downKeys[evt.keyCode];
    });

})();