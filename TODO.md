v1 - Just Make it Work
======================

Support Web Audio API enabled browswers on the desktop (Safari, Chrome).

Game World
----------

* eleanor door puzzle controller (passCardToSittingRoomDoor)
    * spatialize audio or use panned sounds
    * second puzzle set after first
* trapped hallway controller (trappedHallwayDoorKeyToTrappedHallwayDoor)
    * implement timer controller with dpad support
* final shot controller (gasolineToEleanor2)
* maze controller (passCardToMazeDoor)
* move.player action with optional scene change report
* set eleanor4 desc and location upon trapped hallway door key to door

Audio
-----

* fix clipping when sound + speech play at the same time
    * http://www.html5rocks.com/en/tutorials/webaudio/games/#toc-clip-prevent
* delay between sounds on channel option
* cross fade on channel, enable for music on scene change
* make music loop seamlessly
* new background music tracks
    * http://www.newgrounds.com/audio/listen/292004
    * http://www.newgrounds.com/audio/listen/260037
    * http://www.newgrounds.com/audio/listen/316485

Visual
------

* support backdrops
* support defaults
* handle menu text overflow
* progress bar during initialization at load time
* favicon

vXXX - iOS Support
==================

* ios startup touch
* fix ios scroll on description area
* make doubletap work with gestures without zooming
* resolution work (retina vs not, phone, mini, pad)
* home screen icon, splash images

vXXX - Gameplay Improvements
============================

* clean up "use": single vs interactive, ordered "scalpel" on "table" not
* confirm save slot overwrite
* make adjoining rooms examinable
* randomize puzzles
* contract out artwork creation
* move input bindings to world.json
* how to play menu option? or prompt on idle? (changes based on platform)
* audio control options (e.g., volume)

vXXX - DIM Engine Separation
============================

* clean up attributes used for name, description, narration, sound
** think about event system for this too so we can map name/description to narration as appropriate to the controller?
** what about audio channel defaults? in world.json?
** maybe a "view" map from scene properties to visual fields / aural channels?
* upgrade path for saved games
** related solve precache media after load (json may contain different uris)
* implement tts for chrome app engine
* implement tts for voiceover live region
* implement tts using emscripten espeak

vXXX - Engine One-Day-Maybe
===========================

* enable synchronization between visual and sound events (see Spaceship! use of deferreds)
* spatial positioning support for audio

Maybe?
======

* force stop on world event? (all world event have event object, can't stop based on that. do we ever have a case where world event should not queue?)
* rebuild master elevator speech properly?
* dim.appcache?

<pre>
CACHE MANIFEST
# version 3
CACHE:
data/speech/descentIntoMadness.mp3
data/speech/elevator.mp3

NETWORK:
*
</pre>

Reverse Engineering
===================

Notes about the original Python version.

Main game loop
--------------

<pre>
say "you are in the <room name>""
say "<room description>""
say "<choose option>"
select "examine":
    if no items:
        say "no items in this room"
        back to main loop
    say "<items list>"
    say "what to examine"
    select "<item>":
        say "<item description>"
        if takeable:
            say "would you like to take this item?"
            select "yes":
                say "you have taken the <item name>"
                update state
        say "would you like to examine other items"
        select "yes":
            back to item selection
    back to main loop
select "move":
    if no connections:
        say "can't move anywhere"
        back to main loop
    say "where do you want to move?"
    select "<room>":
        say "you are now in the <room name>"
        say "room description"
        update state
    back to main loop
select "use":
    say "what item will you use?"
    select "<item in inventory>"
    say "what will you use this item on?"
    select "<item in room>"
    if interaction exists:
        go to interaction loop
    else:
        say "you can't use those items together"
    back to main loop
</pre>

Actions
-------

* use item
* examine (take as subaction)
* move
* new game
* load game
* save game
* options
* quit

Interactions
------------

* scalpel - operating table
* player - painting
* player - piano
* operating room key - operating room door
* broom - shelf
* player - box
* star - star hole
* desk key - desk
* hammer - mirror
* player - bathroom hallway door
* player - safe
* cell key - bathroom hallway door
* hammer - upper hallway door
* pass card - main entrance
* master bedroom desk key - master bedroom desk
* star - master bathroom star hole
* pass card - sitting room door
* knife - Eleanor
* pass card - maze door
* player - computer
* ingredients - Eleanor
* garage key - garage door
* gun - garage door
* trapped hallway door key - trapped hallway door
* pass card - barn door
* player - barn switch
* knife - Eleanor
* gasoline - Eleanor

Minigames
---------

* trapped hallway reaction
* piano note sequence puzzle
* safe number sequence puzzle
* sitting room door spatial sound puzzle
* maze spatial sound puzzle
* computer number sequence puzzle

Death
-----

* doc hears hammer on mirror
* dogs eat outside main door
* piano fail
* trapped hallway
* barn shot by doctor
* barn killed by monsters
* monster in maze