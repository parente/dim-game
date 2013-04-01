v1 - Just Make it Work
======================

Support Web Audio API enabled browsers on the desktop (Safari, Chrome).

Visual
------

* breadcrumb design for menu
    * or worst case clear out the menu text after a while

Deployment
----------

* website
* app version deployment scheme

vXXX - Gameplay Improvements
============================

* replace "the sounds continue" on sitting room door puzzle second pass with cobbled speech
* prevent key press from skipping audio when about to lose to avoid missing what happened
* more background ambiences / music
    * http://www.newgrounds.com/audio/listen/292004
    * http://www.newgrounds.com/audio/listen/260037
    * http://www.newgrounds.com/audio/listen/316485
* support visual backdrops
* delay between sounds on channel option
* cross fade on channel, enable for music on scene change
* move eleanor's first description to event and split
* press any key to go to main menu after game over
* audio icon for number of things that appear in room after event (desk, safe)
* sound on mirror moving
* sound on unlocking operating room door
* replace "choose a menu option" speech with a simple sound indicating explore menu active
* rumble sound for piano puzzle solve
* confirm save slot overwrite
* randomize puzzles
* contract out artwork creation
* how to play menu option? or prompt on idle? (changes based on platform)
* audio control options (e.g., volume)

vXXX - iOS Support
==================

* ios startup touch
* fix ios scroll on description area
* make doubletap work with gestures without zooming
* resolution work (retina vs not, phone, mini, pad)
* home screen icon, splash images
* decode speed?

vXXX - DIM Boilerplate
============================

* upgrade path for saved games
    * related solve precache media after load (json may contain different uris)
    * related to build version and compatibility
* move input bindings to world.json
* simple commands in console for walkthrough testing
* implement tts using emscripten espeak
    * maybe this fork? https://github.com/osi/speak.js/
* implement tts for voiceover live region
    * impl WAI-ARIA idea from dev example
* implement tts for chrome app engine

vXXX - Engine One-Day-Maybe
===========================

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

Old Dev Notes
=============

Global Pump Redesign
--------------------

pump.js subscribes to all report and object selection events.

1. If the pump receives an event containing object information, it maps that information into
a report using the property to report map.
2. If the event was directly triggered by user input, the pump aborts any pending report and
flushes the queue.
3. The pump queues the event.
4. If there is a pending report, the pump does nothing.
5. If there is no pending report, the pump immediately fetches the next event from the FIFO queue.
    a. The pump sends the event to the aural and visual views.
    b. The views immediately return deferreds.
    c. The pump listens for resolution of or error on all deferreds.
    d. When the views resolve all deferreds associated with an event, the pump processes the next
    item in the queue.

Report
~~~~~~

Defined as the API.

title -> visual top area
description -> visual main area
backdrop -> visual background
narration -> aural primary channel
sound -> aural secondary channel
ambience -> aural looping channel

Property to Report
~~~~~~~~~~~~~~~~~~

Done via default.objectReport.

visual.name -> mapped to visual top area or menu bar label depending on type (title)
visual.description -> mapped to visual main area (description)
visual.backdrop -> mapped to visual background (backdrop)
aural.name -> mapped to primary channel (narration)
aural.description -> mapped to aural primary channel (narration)
aural.sound -> mapped to aural secondary channel (sound)
aural.backdrop -> mapped to aural looping channel (ambience)

Topics
------

controller.request(id)
    Sent by anything at any time to request the activation of a controller
    Received by main.js to activate the controller

controller.complete(ctrl)
    Sent by the active controller when it wants to relinquish control over user input
    Received by main.js to cleanup the controller and activate the next one

input.left(input, event)
input.right(input, event)
input.up(input, event)
input.down(input, event)
input.tap(input, event)
    Sent by input.js on a keyboard or hand gesture
    Received by a controller to process the input

controller.report(ctrl, report)
    Sent by a controller to respond to a user action
    Received by pump.js to queue a report

world.report(world, report)
    Sent by the world to report on a world event
    Received by pump.js to queue a report

user.select(ctrl, obj)
    Sent by a controller when a user selects an object but does not activate it
    Received by pump.js to map the object properties to a report and to queue it

user.activate(ctrl, obj)
    Sent by a controller when a user activates an object
    Received by pump.js to map the object properties to a report and to queue it

Reverse Engineering
-------------------

Notes about the original Python version.

Main game loop
~~~~~~~~~~~~~~

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
~~~~~~~

* use item
* examine (take as subaction)
* move
* new game
* load game
* save game
* options
* quit

Interactions
~~~~~~~~~~~~

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
~~~~~~~~~

* trapped hallway reaction
* piano note sequence puzzle
* safe number sequence puzzle
* sitting room door spatial sound puzzle
* maze spatial sound puzzle
* computer number sequence puzzle

Death
~~~~~

* doc hears hammer on mirror
* dogs eat outside main door
* piano fail
* trapped hallway
* barn shot by doctor
* barn killed by monsters
* monster in maze