'''
Converts original DIM Python structures into JSON format.
A starting point.
'''
import json

'''
Transcriptions of the speech audio files.
'''
visual_descriptions = {
    'operatingRoom': "You awaken with a jolt. The last thing you remember was walking home after work. You thought you heard footsteps behind you. Before you could turn around, something hit you on the head. Hard.\n\nAs you try to get up, you realize that you can't move. You're strapped on an operating table.\n\nWhat's going on?",
    'scalpel': "It's a scalpel, perfect for cutting through things.",
    'operatingRoomAfter': "You are in an operating room. There's a large operating table with several surgical utensils nearby.",
    'operatingTable': "It's a large operating table. Straps are tied tightly around your torso.",
    'balcony': "You're on a balcony overlooking the main lobby.",
    'barn': "You're in the barn. There are cages everywhere, many which contain grotesque looking things. There's a switch on the wall and stairs leading up to the loft.",
    'barnDoor': "The large barn door is locked. But there's a card reader next to it.",
    'freezer': "You're in a large walk-in freezer. It's cold enough to see your breath. Body bags line the walls and objects are strewn across the floor.",
    'freezerBodies': "Open body bags are stacked against the far wall. You notice that some of them have organs missing.",
    'operatingRoomDoor': "The door is locked.",
    'operatingRoomKey': "It's a key to unlock the operating room.",
    'operatingRoomRecording': "October 15th, 7 PM. Trial: 52B. Subject: healthy adult male. Age: 21.\n\nI have injected 52B with the disease. I will administer serum #12 in two days. Hopefully, the mutations present in serum 11 will not be present in this, my newest formula. I will not be certain until two days from now. 52B should remain unconscious until then.\n\nI will return in due time to check on my patient.",
    'basementHallway': "You're in a long narrow hallway. It almost feels like the walls are about to close in.",
    'pianoRoom': "You're in what appears to be a sitting room. There's a piano in the corner and several paintings on the wall.",
    'journal': "It's a journal. To save your game, use it.",
    'labDoor': "The door is locked, but there's no keyhole, or even a knob.",
    'piano': "It's an old piano. Only seven of the keys seem to work.",
    'painting': "It's a suspicious looking painting. Maybe you can move it with your arms.",
    'elevator': "A small cramped elevator only has two buttons.",
    'study': "You're in a study room. The desk is cluttered with a computer and other objects. There's a safe on the floor.",
    'deskKey': "It's a small key. Wonder what it unlocks?",
    'studyRecording': "January 14th, 8 PM. My dear Eleanor's condition is steadily worsening. Even with my extensive medical training, I've never seen anything like this. She has strange hallucinations. They're becoming much more frequent.\n\nI came home yesterday to find our cat skinned and gutted like fish, marinating in garlic butter like a fish. Eleanor thought poor Tootsie was our dinner.\n\nI have isolate the strain that is causing her disease, and I am confident I will find a cure. I must do so, for Eleanor's sake.\n\nFebruary 3rd, 3 PM. I have created a possible cure for Eleanor's strange disease. I am unsure of the possible side-effects, but I will not endanger Eleanor's life any more than I have to. I need to find a test subject.\n\nFebruary 13th, 9 PM. I have found a test subject for my experiments. A man was walking outside our house last week, and I figured he would not be missed. I injected him with the disease 5 days ago. He began showing symptoms 48 hours later. I have now given him my serum. I estimate it will take 2 days to fully work. I will check back on the subject in 48 hours to check my results.\n\nFebruary 15th, 8:30 PM. The serum was a failure. The subject showed advanced progressions of the disease until heart failure. I have removed vital organs for testing and stored subject in the freezer.\n\nI have some idea of what went wrong. Serum #2 should work, but now I need another test subject.",
    'computer': "It's a computer. Maybe you should try using it.",
    'phone': "You try to pick up the phone to call 911, but there's no dialtone.",
    'safe': "It's a sturdy looking safe. Maybe you should try the combination.",
    'upperHallway': "You are in the upper hallway. Several rooms are connected.",
    'upperHallwayDoor': "It's a locked door. But there's no keyhole.",
    'bedroom': "You're in a sparse bedroom. There's a bed and a desk and that's about it.",
    'closet': "You're in a dark, musty closet.",
    'desk': "It's a wooden desk. You try to open the drawer but it's locked.",
    'bed': "It's a comfortable looking bed, but you have no time to rest now.",
    'bathroom': "You're in a cramped bathroom. Bloodstains can be seen on the porcelain.",
    'mirror': "There's something suspicious about this mirror. You feel a draft when you step close to it.",
    'bathtub': "It's just a regular bathtub. But wait. There's a star shaped hole above it, but you can't reach it on your own.",
    'shelf': "There seems to be a large, sturdy box above the shelf. Too bad you can't reach it on your own.",
    'broom': "It's a broom with a long handle.",
    'box': "It's a tall, sturdy box.",
    'starHole': "It's a hole in the shape of a star.",
    'star': "It's a star shaped gem.",
    'hammer': "It's a sturdy hammer, perfect for hitting things.",
    'bedroomRecording': "April 12th, 11 PM. Eleanor's condition is steadily worsening. She is now confined to her bedroom as I fear she will endanger herself if she could wander around the house which has become foreign territory to her. Her hallucinations are almost continuous now, and she does not recognize me sometimes.\n\nMy serums have been disasterous. My test subjects are piling up in the freezer, and analysis of their organs revealed the serum made the disease worse.\n\nI have almost finished serum #6. New test subjects are getting harder to find. I fear the disappearances are starting to be noticed by the local police. I think I will build holding cells to hold the live subjects until I can test on them.",
    'bathroomHallway': "You're in a narrow hallway. You see a door at the end.",
    'bathroomHallwayDoor': "There's a small window on the door. You peer through and see a person on the other side.",
    'cellKey': "It's a key marked \"cell.\"",
    'passCard': "It's a card you can use to open locked doors.",
    'balcony': "You're on a balcony overlooking the main lobby.",
    'westHallway': "You're in the west hallyway. The walls are scratched and the room smells of blood.",
    'lobby': "It appears to be the main lobby. Rooms are found on the east and west, stairs lead up to the balcony, and double doors lead outside.",
    'masterBedroom': "The master bedroom seems nicely adorned, except the bed which has dark red stains on it.",
    'library': "You're in a library. Bookcases line the walls, and there's a table with assorted clutter on it.",
    'kitchen': "A strong smell in the kitchen seems to be coming from the trash can. Bones lie around it but you don't want to know where they're from.",
    'mainEntrance': "A pair of double doors leads outside. There's a card reader next to the door.",
    'trappedHallwayDoor': "It's a locked door leading to the downstairs hallway.",
    'notebook': "Written in the notebook are the numbers 9-3-1. You wonder what they could mean.",
    'masterBedroomDeskKey': "It's a key marked \"desk.\"",
    'libraryRecording': '''August 19th, 2:30 PM. I'm getting so close I can feel it. Serum #10 succeeded in reversing the effects of the disease, but it also caused mutations which are ... undesirable. I need to isolate the cause of these abnormalities.

Hold on a little longer Eleanor. I'm going to save you!''',
    'masterBathroom': "The master bathroom is rather spacious. There's a mirror and a star shaped hole on one of the walls.",
    'masterBedroomDesk': "The desk is locked.",
    'masterBedroomRecordingDesc': '''September 24th, 7:30 PM. Well, serum #11 was another failure. More of the same. At least subject 51A can join the others in the basement. Ha ha ha ha ... ah.
I still have not isolated the cause of these mutations. I might need to use younger, more healty subjects. Yes! That would help. Hm. There's a local college near here. I can try looking there.

Eleanor is getting violent now. Not only does she not recognize me, she tried to stab me with her nail file last night. I've strapped her to the bed. It's for her own good.''',
    'masterBedroomBed': "There are stains on the bed that look like dried blood.",
    'masterBathroomMirror': "There's something suspicious about this mirror. You feel a draft when you step close to it.",
    'masterBathroomStarHole': "It's a hole in the shape of a star.",
    'masterElevatorDesc': "The elevator has three possible stops.",
    'sittingRoom': "It's a sitting room. The chairs are knocked over showing signs of a struggle. The door leading to the next room has a heavy lock on it.",
    'basement': "You're in the basement. The smell from the elevator is now even stronger.",
    'sittingRoomDoor': "The door is locked, but there's a card reader next to it.",
    'eleanorsRoom': "You're in a room that almost looks like a jail cell. There's a woman tied to one of the chairs.",
    'eleanor': '''"Who are you? Speak! Who are you? Did Johan send you?"

"The doctor of the house, my husband, Johan. Did he send you?"

"No? Then you must be one of the ... subjects. How did you get free?"

"Nevermind. We have to get out of here. Wait! I just remembered. Do you know if you've been injected yet?"

"Oh no. You see, my husband, he's crazy. He used to work at the chemical plant in town. He was a top scientist, but then, something happened. There was an accident. And he never told me anything but I could tell something was wrong with him. I later found out that he was fired from the plant. He became very depressed and angry, and he started showing signs of paranoia and hallucinations. I'll never forget what happened to our poor cat Tootsie. It was about then that I found out about his tests. He was kidnapping people and injecting them with some disease. I saw his journal and it looked like he was trying to create an army of supermutated monsters. I think he wants to get back at the chemical plant for firing him.

I was about to call the police when he locked me in this room. You see, his hallucinations have led him to believe that I'm the one who's crazy. It's been terrible. He leaves me here in the dark, feeding me twice a day. I used to be able to move around, but a couple weeks ago he started tying me to the bed after he leaves. I can get my hands free, but I can't try the straps. At night, I can hear strange noises from the basement bellow. I shudder every time I hear them. They're grotesque sounding.

But enough talk. We have to get you the antidote! Don't worry, I know what I'm doing. I'm the head scientist at EKMC laboratories in town. But first you have to cut me loose. Do you have a knife with you?"''',

    'mazeDoor': "The door has a large sign that says \"STAY OUT\". There's a card reader next to it.",
    'knife': "It's a sharp knife.",
    'garageDoor': "The door is locked.",
    'gun': "It's a pistol.",
    'ingredients': "It's the chemicals you need.",
    'lab': "It's a lab with chemicals and scientific instruments, many which are crushed on the floor.",
    'garage': "It looks like a normal garage, but there are no cars to be found.",
    'garageKey': "It's a key marked \"garage.\"",
    'gasoline': "It's a tank of gasoline.",
    'trappedHallwayDoorKey': "It's a key marked \"hallway.\"",
    'outside': "You've finally gotten out of the mansion. You can see a barn up the road.",
    'barnDoor': "The large barn door is locked, but there's a card reader next to it.",
    'barn': "You're in the barn. There are cages everywhere, many which contain grotesque looking things. There's a switch on the wall and stairs leading up to the loft.",
    'barnSwitch': "It's a switch that you can pull.",
    'barnLoft': "You're in the barn loft. You see Eleanor tied to a chair.",
    'safeRecording': '''June 23rd, 5:30 PM. Eleanor is now in a totally different world. She wanders in circles around the bedroom, mumbling to herself in a language I've never heard before. It pains me to see her like this. Argh! Why can't I find the right serum?!

June 30th, 11 AM. I've gotten some strange results from my serum #8. Instead of outright killing my subjects as the previous serums did, this one causes ... mutations. Grotesque mutations. I don't think I will destroy these monsters just yet. I need to run a few tests first.

July 8th, 10 PM. What have I created? My test subjects are out of control! The mutations have created some sort of aggressive uncontrollable monster. They could be useful if the cops show up though. I've locked them in the basement. God help whoever gets in their way.
'''
}

'''
Actions to take and events to report upon "use".
'''
use_events = {
    'save': {
        'exec': [
            {
                'action': "publish",
                'args': ['controller.request', 'dim/controllers/meta/save']
            }
        ]
    },
    'scalpelToOperatingTable': {
        "exec": [
            {
                "action": "append",
                "args": ["scene.operatingRoom.items", "operatingRoomRecording"]
            },
            {
                "action": "append",
                "args": ["scene.operatingRoom.items", "operatingRoomDoor"]
            },
            {
                "action": "append",
                "args": ["scene.operatingRoom.adjoins", "freezer"]
            },
            {
                "action": "remove",
                "args": ["player.items", "scalpel"],
            },
            {
                "action": "remove",
                "args": ["scene.operatingRoom.items", "operatingTable"],
            }
        ],
        "report": [
            {
                "description": "You cut the straps on the operating table. You are now free.",
                "narration": "sound://speech/cutStraps"
            }
        ]
    },

    'operatingRoomKeyToOperatingRoomDoor': {
        "exec": [
            {
                "action": "remove",
                "args": ["player.items", "operatingRoomKey"]
            },
            {
                "action": "remove",
                "args": ["scene.operatingRoom.items", "operatingRoomDoor"]
            },
            {
                "action": "append",
                "args": ["scene.operatingRoom.adjoins", "basementHallway"]
            }
        ],
        "report": [
            {
                "description": "You unlock the door. You can now move to the hallway.",
                "narration": "sound://speech/unlockOperatingRoom"
            }
        ]
    },

    'playerToPainting': {
        "report": [
            {
                "description": "You move the painting and a tune plays.\n\nDo-Mi-So",
                "narration": "sound://speech/movePainting"
            },
            {
                "narration": "sound://sound/pianoC"
            },
            {
                "narration": "sound://sound/pianoE"
            },
            {
                "narration": "sound://sound/pianoG"
            }
        ]
    },

    'playerToPiano': {
        'exec': [
            {
                'action': 'publish',
                'args': ['controller.request', 'dim/controllers/puzzles/memoryPattern', 'piano']
            }
        ]
    },

    'broomToShelf': {
        'exec': [
            {
                'action': 'append',
                'args': ['scene.bathroom.items', 'box']
            }
        ],
        'report': [
            {
                'description': "You knock the box on the floor.",
                'narration': 'sound://speech/broomToShelf'
            }
        ]
    },

    'playerToComputer': {
        'exec': [
            {
                'action': 'publish',
                'args': ['controller.request', 'dim/controllers/puzzles/memoryPattern', 'computer']
            }
        ]
    },

    'playerToBox': {
        'exec': [
            {
                'action': 'remove',
                'args': ['scene.bathroom.items', 'box']
            },
            {
                'action': 'append',
                'args': ['scene.bathroom.items', 'starHole']
            }
        ],
        'report': [
            {
                'description': "You move the box to the bathtub. You can now reach the star shaped hole.",
                'narration': 'sound://speech/playerToBox'
            }
        ]
    },

    'starToStarHole': {
        'exec': [
            {
                'action': 'append',
                'args': ['scene.bathroom.adjoins', 'bathroomHallway']
            }
        ],
        'report': [
            {
                    'description': "You put the star into the star shaped hole. Suddenly, the mirror starts to move, revealing a long dark hallway.",
                    'narration': 'sound://speech/starToStarHole'
            }
        ]
    },

    'deskKeyToDesk': {
        'exec': [
            {
                'action': 'append',
                'args': ['scene.bedroom.items', 'bedroomRecording']
            },
            {
                'action': 'append',
                'args': ['scene.bedroom.items', 'star']
            },
            {
                'action': 'remove',
                'args': ['player.items', 'deskKey']
            }
        ],
        'report': [
            {
                'description': "The desk opens, revealing a recording.",
                'narration': 'sound://speech/deskKeyToDesk'
            }
        ]
    },

    'hammerToMirror': {
        'exec': [
            {
                'action': 'publish',
                'args': ['controller.request', 'dim/controllers/meta/lose']
            }
        ],
        'report': [
            {
                'description': "The mirror breaks with a large crash, revealing a hallway behind it.\n\n\"Hey! What was that noise?!\"\n\nOh no. The doctor hear you. He comes into the room.\n\n\"I've got you now, 52B!\"\n\nYou try to defend yourself with the hammer but you miss. He injects you with a tranquilizer and you go to sleep again ...",
                'narration': 'sound://speech/hammerToMirror'
            }
        ]
    },

    'playerToBathroomHallwayDoor': {
        'report': [
            {
                'description': '''You knock on the hallway door. The person inside jumps in surprise.

"Hey! Let me go, I swear, the cops are going to find me and then you're in big trouble."

"Oh! You're not him. I'm sorry. I thought ... Hey, where did you come from? Help me get out of here!"

"You don't have a key? How did you get out? You were on an operating table?"

"Oh no ... I just thought the man was crazy but he's really doing it. He told me he was going to do experiments on me like I was some rodent. Do you know what's going on?"

"You have to help me. Find the key. Please!"

"Hey, by the way, I overheard him, as he was mumbling something crazy to himself, say three numbers: 2-1-6. He said them over and over again, like he was trying to remember them or something. They might help you."''',
                'narration': 'sound://speech/friend010_cell'
            }
        ]
    },

    'playerToSafe': {
        'exec': [
            {
                'action': 'publish',
                'args': ['controller.request', 'dim/controllers/puzzles/memoryPattern', 'safe']
            }
        ]
    },

    'cellKeyToBathroomHallwayDoor': {
        'exec': [
            {
                'action': 'remove',
                'args': ['scene.bathroomHallway.items', 'bathroomHallwayDoor']
            },
            {
                'action': 'remove',
                'args': ['player.items', 'cellKey']
            },
            {
                'action': 'move.player',
                'args': ['scene.upperHallway']
            }
        ],
        'report': [
            {
                'description': '''You ask the stranger about the locked hallway door. The two of you move to the hallway and he inspects it.

"Hey! I've seen a door like this before. You need a special key. But there's a place on the door that if you hit it with something hard it will open. Do you have a hammer or something?"''',
                'narration': 'sound://speech/cellKeyToBathroomHallwayDoor'
            },
            {
                'narration': 'sound://speech/cellKeyToBathroomHallwayDoor2'
            }
        ]
    },

    'hammerToUpperHallwayDoor': {
        'exec': [
            {
                'action': 'remove',
                'args': ['scene.upperHallway.items', 'upperHallwayDoor']
            },
            {
                'action': 'append',
                'args': ['scene.upperHallway.adjoins', 'balcony']
            },
            {
                'action': 'remove',
                'args': ['player.items', 'hammer']
            }
        ],
        'report': [
            {
                'description': '''You hit the door hard and it opens. You can now move to the balcony.

"Alright, let's get out of here!"

"What? You have to find some serum?"

"Oh, ok then. Let's split up. I'll go search for a way out of here and you go find your serum. I'll meet you back here on this balcony as soon as I find something. Good luck."''',
                'narration': 'sound://speech/hammerToUpperHallwayDoor'
            },
            {
                'narration': 'sound://speech/hammerToUpperHallwayDoor2'
            }
        ]
    },

    'masterBedroomDeskKeyToMasterBedroomDesk': {
        'exec': [
            {
                'action': 'remove',
                'args': ['scene.masterBedroom.items', 'masterBedroomDesk']
            },
            {
                'action': 'append',
                'args': ['scene.masterBedroom.items', 'masterBedroomRecording']
            },
            {
                'action': 'remove',
                'args': ['player.items', 'masterBedroomDeskKey']
            }
        ],
        'report': [
            {
                'description': "You open the desk and find another key, and a recording.",
                'narration': 'sound://speech/masterBedroomDeskKeyToMasterBedroomDesk'
            }
        ]
    },

    'starToMasterBathroomStarHole': {
        'exec': [
            {
                'action': 'remove',
                'args': ['scene.masterBathroom.items', 'masterBathroomStarHole']
            },
            {
                'action': 'remove',
                'args': ['scene.masterBathroom.items', 'masterBathroomMirror']
            },
            {
                'action': 'append',
                'args': ['scene.masterBathroom.adjoins', 'masterElevator']
            }
        ],
        'report': [
            {
                'description': "The mirror moves, revealing an elevator.",
                'narration': 'sound://speech/starToMasterBathroomStarHole'
            }
        ]
    },

    'passCardToMainEntrance': {
        'exec': [
            {
                'action': 'publish',
                'args': ['controller.request', 'dim/controllers/meta/lose']
            }
        ],
        'report': [
            {
                'description': "You use the pass card and the main entrance opens. Unfortunately, as soon as you open it, you find a pack of growling dogs waiting outside. They look pretty hungry, and apparently they find you pretty tasty.",
                'narration': 'sound://speech/passCardToMainEntrance'
            }
        ]
    },

    'passCardToSittingRoomDoor': {
        'exec': [
            {
                'action': 'publish',
                'args': ['controller.request', 'dim/controllers/puzzles/memoryPattern', 'sittingRoomDoorLock1']
            }
        ]
    },

    'knifeToEleanor': {
        'exec': [
            {
                'action': 'remove',
                'args': ['scene.eleanorsRoom.items', 'eleanor']
            },
            {
                'action': 'append',
                'args': ['scene.eleanorsRoom.items', 'gun']
            },
            {
                'action': 'append',
                'args': ['scene.lab.items', 'eleanor']
            },
            {
                'action': 'set',
                'args': ['items.eleanor.visual.description', '''"Oh thank god you made it! Did you get the ingredients I need?"''']
            },
            {
                'action': 'set',
                'args': ['items.eleanor.aural.description', 'sound://speech/eleanorDesc2']
            }
        ],
        "report": [
            {
                'description': '''"Thank you. Now I can't be seen by Johan, so I must go straight to the lab. You need to pick up the chemical ingredients for the antidote. Unforunately, they're located in the basement somewhere. You should be safe from Johan's mutations because the cages are electronically locked. But just to be safe, take this gun."''',
                'narration': 'sound://speech/knifeToEleanor'
            }
        ]
    },

    'ingredientsToEleanor': {
        'exec': [
            {
                'action': 'append',
                'args': ['player.items', 'garageKey']
            },
            {
                'action': 'remove',
                'args': ['player.items', 'ingredients']
            },
            {
                'action': 'set',
                'args': ['items.eleanor.visual.description', '''"I'm not finished with your antidote yet. There should be a key in the garage that opens a door in the lobby. Use that to get out and I'll come find you."''']
            },
            {
                'action': 'set',
                'args': ['items.eleanor.aural.description', 'sound://speech/eleanorDesc3']
            }
        ],
        'report': [
            {
                'description': '''"Excellent. Did you get a chance to meet my husband's minions? I trust my gun came in handy then. Keep it for now. You may need it again."

"While I was waiting for you, I discovered my husband's notes. And it's just as I had feared! He's planning to use his monsters to attack the chemical facility. He fails to realize, however, that they won't stop there. As soon as they're out, he'll lose control over them! They'll wreak havoc upon the entire town!"

"And the ones in the basement are just the tip of the iceberg. There are more. Many more. We have a small barn just down the road. I'm sure he keeps them there. We must find a way to destroy it."

"But, I'm getting ahead of myself. Let me create an antidote for you. It'll take a few minutes. In the meantime, go out to the garage, outside the kitchen, and get the tank of gasoline that is on the storage closet. Yes, that will do the trick nicely. Here is the key to the closet. Hurry back!"''',
                'narration': 'sound://speech/ingredientsToEleanor'
            },
            {
                'narration': 'sound://speech/ingredientsToEleanor2'
            }
        ]
    },
    'garageKeyToGarageDoor': {
        'report': [
            {
                'description': "You try using the key on the door, but the lock seems rusted shut. Maybe you can just shoot the lock out.",
                'narration': 'sound://speech/garageKeyToGarageDoor'
            }
        ]
    },

    'gunToGarageDoor': {
        'exec': [
            {
                'action': 'remove',
                'args': ['player.items', 'garageKey']
            },
            {
                'action': 'remove',
                'args': ['scene.kitchen', 'garageDoor']
            },
            {
                'action': 'append',
                'args': ['scene.kitchen.adjoins', 'garage']
            }
        ],
        'report': [
            {
                'description': "You shoot the lock on the door and it shatters. You can now move to the garage.",
                'narration': 'sound://speech/gunToGarageDoor'
            }
        ]
    },

    'passCardToBarnDoor': {
        'exec': [
            {
                'action': 'append',
                'args': ['scene.outside.adjoins', 'barn']
            }
        ],
        'report': [
            {
                'description': "You have unlocked the barn door. You can now move into the barn.",
                'narration': 'sound://speech/passCardToBarnDoor'
            }
        ]
    },

    'playerToBarnSwitch': {
        'report': [
            {
                'description': "You hit the switch and all of the cages open. You've freed all of the monsters and they show their thanks by eating you alive.",
                'narration': 'sound://speech/playerToBarnSwitch'
            }
        ]
    },

    'knifeToEleanor2': {
        'report': [
            {
                'description': '''"Oh thank god you made it! I was so worried. This place is terrible! We must destroy it. I don't know where Johan went so we must hurry. Did you bring the gasoline?"''',
                'narration': 'sound://speech/knifeToEleanor2'
            },
            {
                'narration': 'sound://speech/eleanor050_barn'
            }
        ]
    }
}

'''
Basics of the world including the player, initial scene,
defaults, controller data, and generic event handling.
'''
world = [
    # player
    {
        "type": "player",
        "id": "player",
        "items": [],
        "scene": "boot"
    },
    # initial scene for load / new game
    {
        "type": "scene",
        "id": "boot",
        "items": [],
        "adjoins": [],
        "controller": "dim/controllers/meta/boot",
        "visual": {
            "name": "Descent Into Madness"
        },
        "aural": {
            "name": "sound://speech/descentIntoMadness"
        }
    },
    # defaults
    {
        "type": "default",
        "id": "default",
        "controller": "dim/controllers/explore/explore",
        "scene": "operatingRoom",
        "channels": {
            "ambience": {
                # loop a sound forever
                "loop": True,
                # stop() does nothing, but any new queued sound immediately swaps
                # out the current one unless it has the same URI as the current
                # one in which case it coalsces and the current one continues
                "swapstop": True,
                # gain of the output
                "gain": 0.15,
                # cross fade when swapstopping
                "crossfade": True
            },
            "sound": {
                # make sound slightly quieter than speech
                "gain": 0.8
            }
            # TODO: other aural and visual report channel props go here
        },
        # maps object properties to report channels and chunks
        "propertyReport": [
            {
                "visual.name": "title",
                "visual.description": "description",
                "visual.backdrop": "backdrop",
                "aural.name": "narration",
                "aural.sound": "sound",
                "aural.backdrop": "ambience"
            },
            {
                "aural.description": "narration"
            }
        ]
    },
    # controller assets for load / new game
    {
        "type": "ctrl",
        "id": "boot",
        "prompt": [
            {
                "narration": "sound://speech/menu",
                "ambience": "sound://music/music1"
            }
        ],
        "options": [
            {
                "id": "load",
                "visual": {
                    "name": "Load Game"
                },
                "aural": {
                    "name": "sound://speech/loadGame"
                }
            },
            {
                "id": "new",
                "visual": {
                    "name": "New Game"
                },
                "aural": {
                    "name": "sound://speech/newGame"
                },
            }
        ]
    },
    # load game assets
    {

        "type": "ctrl",
        "id": "load",
        "prompt": [
            {
                "description": "Select a save slot to load.",
                "narration":  "sound://speech/selectLoad"
            }
        ]
    },
    # save game assets
    {
        "type": "ctrl",
        "id": "save",
        "prompt": [
            {
                "description": "Save your game",
                "narration": "sound://speech/saveSlot"
            }
        ],
        "success": [
            {
                "description": "Your game was successfully saved.",
                "narration": "sound://speech/saveSuccessful"
            }
        ]
    },
    # slots shared between load and save game
    {
        "type": "ctrl",
        "id": "slots",
        "options": [
            {
                "id": "slot1",
                "visual": {
                    "name": "Slot 1"
                },
                "aural": {
                    "name": "sound://speech/slot1"
                }
            },
            {
                "id": "slot2",
                "visual": {
                    "name": "Slot 2"
                },
                "aural": {
                    "name": "sound://speech/slot2"
                }
            },
            {
                "id": "slot3",
                "visual": {
                    "name": "Slot 3"
                },
                "aural": {
                    "name": "sound://speech/slot3"
                }
            },
            {
                "id": "slot4",
                "visual": {
                    "name": "Slot 4"
                },
                "aural": {
                    "name": "sound://speech/slot4"
                }
            },
            {
                "id": "slot5",
                "visual": {
                    "name": "Slot 5"
                },
                "aural": {
                    "name": "sound://speech/slot5"
                }
            }
        ]
    },

    # dead end controller for losing a game
    {
        "type": "ctrl",
        "id": "lose",
        "report": [
            {
                "title": "Game Over",
                "narration": "sound://speech/gameOver"
            }
        ]
    },

    # playerToPiano
    {
        "type": "ctrl",
        "id": 'piano',
        "correct": ['c', 'e', 'g'],
        "maxAttempts": 3,
        "canAbort": True,
        "prompt": [
            {
                "description": "Press a key.",
                "narration": "sound://speech/pianoPressKey1"
            },
            {
                "description": "Press a second key.",
                "narration": "sound://speech/pianoPressKey2"
            },
            {
                "description": "Press a third key.",
                "narration": "sound://speech/pianoPressKey3"
            }
        ],
        "options": [
            {
                "id": "c",
                "visual": {
                    "name": "Do"
                },
                "aural": {
                    "name": "sound://speech/pianoChooseC",
                    "sound": "sound://sound/pianoC"
                }
            },
            {
                "id": "d",
                "visual": {
                    "name": "Re"
                },
                "aural": {
                    "name": "sound://speech/pianoChooseD",
                    "sound": "sound://sound/pianoD"
                }
            },
            {
                "id": "e",
                "visual": {
                    "name": "Mi"
                },
                "aural": {
                    "name": "sound://speech/pianoChooseE",
                    "sound": "sound://sound/pianoE"
                }
            },
            {
                "id": "f",
                "visual": {
                    "name": "Fa"
                },
                "aural": {
                    "name": "sound://speech/pianoChooseF",
                    "sound": "sound://sound/pianoF"
                }
            },
            {
                "id": "g",
                "visual": {
                    "name": "So"
                },
                "aural": {
                    "name": "sound://speech/pianoChooseG",
                    "sound": "sound://sound/pianoG"
                }
            },
            {
                "id": "a",
                "visual": {
                    "name": "La"
                },
                "aural": {
                    "name": "sound://speech/pianoChooseA",
                    "sound": "sound://sound/pianoA"
                }
            },
            {
                "id": "b",
                "visual": {
                    "name": "Ti"
                },
                "aural": {
                    "name": "sound://speech/pianoChooseB",
                    "sound": "sound://sound/pianoB"
                }
            }
        ]
    },
    {
        "type": "event",
        "on": ["solve", "piano"],
        "exec": [
            {
                "action": "append",
                "args": ["scene.basementHallway.adjoins", "elevator"]
            },
            {
                'action': 'remove',
                'args': ['item.piano.properties', 'useable']
            }
        ],
        "report": [
            {
                "description": "You hear a loud rumble from the hallway that sounds like a wall moving.",
                "narration": "sound://sound/chime"
            },
            {
                "narration": "sound://speech/pianoSolve"
            }
        ]
    },
    {
        "type": "event",
        "on": ["fail", "piano"],
        "exec": [
            {
                "action": "publish",
                "args": ["controller.request", "dim/controllers/meta/lose"]
            }
        ],
        "report": [
            {
                "description": "You have failed too many times. A trapdoor opens underneath you, revealing a pit of spikes. You fall to your death.",
                "narration": "sound://sound/buzzer"
            },
            {
                "narration": "sound://speech/pianoFail"
            }
        ]
    },
    {
        "type": "event",
        "on": ["retry", "piano"],
        "report": [
            {
                "description": "Try again.",
                "narration": "sound://sound/buzzer"
            },
            {
                "narration": "sound://speech/tryAgain"
            }
        ]
    },

    # playerToSafe data used by memoryPattern controller
    {
        "type": "ctrl",
        "id": 'safe',
        "correct": ['2', '1', '6'],
        "maxAttempts": 1,
        "prompt": [
            {
                "description": "Choose a number.",
                "narration": "sound://speech/safeChoose1"
            },
            {
                "description": "Choose a second number.",
                "narration": "sound://speech/safeChoose2"
            },
            {
                "description": "Choose a third number.",
                "narration": "sound://speech/safeChoose3"
            }
        ],
        "options": [
            {
                "id": "1",
                "visual": {
                    "name": "1"
                },
                "aural": {
                    "name": "sound://speech/1"
                }
            },
            {
                "id": "2",
                "visual": {
                    "name": "2"
                },
                "aural": {
                    "name": "sound://speech/2"
                }
            },
            {
                "id": "3",
                "visual": {
                    "name": "3"
                },
                "aural": {
                    "name": "sound://speech/3"
                }
            },
            {
                "id": "4",
                "visual": {
                    "name": "4"
                },
                "aural": {
                    "name": "sound://speech/4"
                }
            },
            {
                "id": "5",
                "visual": {
                    "name": "5"
                },
                "aural": {
                    "name": "sound://speech/5"
                }
            },
            {
                "id": "6",
                "visual": {
                    "name": "6"
                },
                "aural": {
                    "name": "sound://speech/6"
                }
            },
            {
                "id": "7",
                "visual": {
                    "name": "7"
                },
                "aural": {
                    "name": "sound://speech/7"
                }
            },
            {
                "id": "8",
                "visual": {
                    "name": "8"
                },
                "aural": {
                    "name": "sound://speech/8"
                }
            },
            {
                "id": "9",
                "visual": {
                    "name": "9"
                },
                "aural": {
                    "name": "sound://speech/9"
                }
            },
            {
                "id": "0",
                "visual": {
                    "name": "0"
                },
                "aural": {
                    "name": "sound://speech/0"
                }
            }
        ]
    },
    {
        "type": "event",
        "on": ["solve", "safe"],
        "exec": [
            {
                "action": "append",
                "args": ["scene.study.items", "safeRecording"]
            },
            {
                "action": "append",
                "args": ["scene.study.items", "cellKey"]
            },
            {
                "action": "append",
                "args": ["scene.study.items", "passCard"]
            },
            {
                'action': 'remove',
                'args': ['item.safe.properties', 'useable']
            }
        ],
        "report": [
            {
                "description": '''The safe opens. Inside you find a recording, a key, and a passcard.

Strange. The phone suddenly rings. You pick it up.

"Hello, 52B. I see you managed to escape the operating table. How fortunate for you. Or should I say, unfortunate."

"You see, 52B, you've been injected with B-1 disease, an aggressively deabilitating disease causing schizophrenia and eventually death. You my friend will begin showing symptoms in, oh, about twelve hours."

"I have developed a final serum. You WILL be me test subject or you will die. It's that simple."

"I will be along to collect you shortly. In the meantime, I wouldn't recommend going down to the basement. You never know when the power that controls the locks on the cages might go out. Muhahaha ha ha ha!""''',
                "narration": "sound://sound/chime"
            },
            {"narration": "sound://speech/safeOpen1"},
            {"narration": "sound://sound/phoneRing"},
            {"narration": "sound://speech/safeOpen2"},
            {"narration": "sound://speech/safeOpen3"}
        ]
    },
    {
        "type": "event",
        "on": ["fail", "safe"],
        "report": [
            {"narration": "sound://sound/buzzer"}
        ]
    },

    # playerToComputer data used by memoryPattern controller
    {
        "type": "ctrl",
        "id": 'computer',
        "correct": ['9', '3', '1'],
        "maxAttempts": 1,
        "prompt": [
            {
                "description": "Choose a number.",
                "narration": "sound://speech/safeChoose1"
            },
            {
                "description": "Choose a second number.",
                "narration": "sound://speech/safeChoose2"
            },
            {
                "description": "Choose a third number.",
                "narration": "sound://speech/safeChoose3"
            }
        ],
        "options": [
            {
                "id": "1",
                "visual": {
                    "name": "1"
                },
                "aural": {
                    "name": "sound://speech/1"
                }
            },
            {
                "id": "2",
                "visual": {
                    "name": "2"
                },
                "aural": {
                    "name": "sound://speech/2"
                }
            },
            {
                "id": "3",
                "visual": {
                    "name": "3"
                },
                "aural": {
                    "name": "sound://speech/3"
                }
            },
            {
                "id": "4",
                "visual": {
                    "name": "4"
                },
                "aural": {
                    "name": "sound://speech/4"
                }
            },
            {
                "id": "5",
                "visual": {
                    "name": "5"
                },
                "aural": {
                    "name": "sound://speech/5"
                }
            },
            {
                "id": "6",
                "visual": {
                    "name": "6"
                },
                "aural": {
                    "name": "sound://speech/6"
                }
            },
            {
                "id": "7",
                "visual": {
                    "name": "7"
                },
                "aural": {
                    "name": "sound://speech/7"
                }
            },
            {
                "id": "8",
                "visual": {
                    "name": "8"
                },
                "aural": {
                    "name": "sound://speech/8"
                }
            },
            {
                "id": "9",
                "visual": {
                    "name": "9"
                },
                "aural": {
                    "name": "sound://speech/9"
                }
            },
            {
                "id": "0",
                "visual": {
                    "name": "0"
                },
                "aural": {
                    "name": "sound://speech/0"
                }
            }
        ]
    },
    {
        "type": "event",
        "on": ["solve", "computer"],
        "exec": [
            {
                "action": "append",
                "args": ["scene.basementHallway.adjoins", "lab"]
            },
            {
                "action": "append",
                "args": ["scene.study.adjoins", "elevator"]
            },
            {
                'action': 'remove',
                'args': ['scene.basementHallway.items', 'labDoor']
            }
        ],
        "report": [
            {
                "description": '"Passcode accepted. Elevator activated."',
                "sound": "sound://sound/chime",
                "narration": "sound://speech/computerAccept"
            }
        ]
    },
    {
        "type": "event",
        "on": ["fail", "computer"],
        "report": [
            {"narration": "sound://sound/buzzer"}
        ]
    },

    # passCardToSittingRoomDoor data used by memoryPattern controller
    {
        "type": "ctrl",
        "id": 'sittingRoomDoorLock1',
        "correct": ['left', 'right', 'left', 'left'],
        "canAbort": True,
        "maxAttempts": 1,
        "prompt": [
            [
                {
                    "description": "There are two speakers in front of you: one on the left and one on the right. Below each speaker is a button. When you insert the passkey, sounds start playing from the speakers.",
                    "narration": "sound://speech/passCardToSittingRoomDoor1"
                },
                {"narration": "sound://sound/toneLeft"},
                {"narration": "sound://sound/toneRight"},
                {"narration": "sound://sound/toneLeft"},
                {"narration": "sound://sound/toneLeft"},
                {"narration": "sound://speech/passCardToSittingRoomDoor2"}
            ],
            {
                "description": "Press a button.",
                "narration": "sound://speech/passCardToSittingRoomDoor2"
            }
        ],
        "options": [
            {
                "id": "left",
                "visual": {
                    "name": "Left button"
                },
                "aural": {
                    "name": "sound://speech/leftButton"
                }
            },
            {
                "id": "right",
                "visual": {
                    "name": "Right button"
                },
                "aural": {
                    "name": "sound://speech/rightButton"
                }
            }
        ]
    },
    {
        "type": "event",
        "on": ["solve", "sittingRoomDoorLock1"],
        "exec": [
            {
                'action': 'publish',
                'args': ['controller.request', 'dim/controllers/puzzles/memoryPattern', 'sittingRoomDoorLock2']
            }
        ]
    },
    {
        "type": "event",
        "on": ["fail", "sittingRoomDoorLock1"],
        "exec": [
            {
                "action": "publish",
                "args": ["controller.request", "dim/controllers/meta/lose"]
            }
        ],
        "report": [
            {
                "description": "Apparently you've inputted the wrong sequence of button presses. A trapdoor opens underneath you revealing a pit of spikes. You fall to your death.",
                "narration": "sound://sound/buzzer"
            },
            {
                "narration": "sound://speech/passCardToSittingRoomDoor3"
            }
        ]
    },
    {
        "type": "ctrl",
        "id": 'sittingRoomDoorLock2',
        "correct": ['right', 'right', 'right', 'left', 'right', 'left'],
        "canAbort": True,
        "maxAttempts": 1,
        "prompt": [
            [
                {
                    "description": "The sounds continue.",
                    "narration": "sound://sound/toneRight"
                },
                {"narration": "sound://sound/toneRight"},
                {"narration": "sound://sound/toneRight"},
                {"narration": "sound://sound/toneRight"},
                {"narration": "sound://sound/toneLeft"},
                {"narration": "sound://sound/toneRight"},
                {"narration": "sound://sound/toneLeft"},
                {"narration": "sound://speech/passCardToSittingRoomDoor2"}
            ],
            {
                "description": "Press a button.",
                "narration": "sound://speech/passCardToSittingRoomDoor2"
            }
        ],
        "options": [
            {
                "id": "left",
                "visual": {
                    "name": "Left button"
                },
                "aural": {
                    "name": "sound://speech/leftButton"
                }
            },
            {
                "id": "right",
                "visual": {
                    "name": "Right button"
                },
                "aural": {
                    "name": "sound://speech/rightButton"
                }
            }
        ]
    },
    {
        "type": "event",
        "on": ["solve", "sittingRoomDoorLock2"],
        "exec": [
            {
                "action": "append",
                "args": ["scene.sittingRoom.adjoins", "eleanorsRoom"]
            },
            {
                'action': 'remove',
                'args': ['scene.sittingRoom.items', 'sittingRoomDoor']
            }
        ],
        "report": [
            {
                "description": "The door slides open. You can now move into the dark room ahead.",
                "narration": "sound://sound/chime"
            },
            {
                "narration": "sound://speech/passCardToSittingRoomDoor4"
            }
        ]
    },
    # TODO: would be nice not to have to repeat this
    {
        "type": "event",
        "on": ["fail", "sittingRoomDoorLock2"],
        "exec": [
            {
                "action": "publish",
                "args": ["controller.request", "dim/controllers/meta/lose"]
            }
        ],
        "report": [
            {
                "description": "Apparently you've inputted the wrong sequence of button presses. A trapdoor opens underneath you revealing a pit of spikes. You fall to your death.",
                "narration": "sound://sound/buzzer"
            },
            {
                "narration": "sound://speech/passCardToSittingRoomDoor3"
            }
        ]
    },

    # exploration controller
    {
        "type": "ctrl",
        "id": "explore",
        "prompt": [
            {
                "narration": "sound://speech/menu"
            }
        ],
        "options": [
            {
                "id": "dim/controllers/explore/examine",
                "visual": {
                    "name": "Examine"
                },
                "aural": {
                    "name": "sound://speech/examine"
                }
            },
            {
                "id": "dim/controllers/explore/move",
                "visual": {
                    "name": "Move"
                },
                "aural": {
                    "name": "sound://speech/move"
                }
            },
            {
                "id": "dim/controllers/explore/use",
                "visual": {
                    "name": "Use"
                },
                "aural": {
                    "name": "sound://speech/useItem"
                }
            },
            {
                "id": "dim/controllers/explore/take",
                "visual": {
                    "name": "Take"
                },
                "aural": {
                    "name": "sound://speech/takeItem"
                }
            }
        ],
    },

    # examine controller
    {
        "type": "ctrl",
        "id": "examine",
        "prompt": [
            {
                "description": "What would you like to examine?",
                "narration": "sound://speech/whatToExamine"
            }
        ],
        "impossible": [
            {
                "description": "There's nothing here.",
                "narration": "sound://speech/nothingHere"
            }
        ]
    },

    # player movement controller
    {
        "type": "ctrl",
        "id": "move",
        "prompt": [
            {
                "description": "Where do you want to move?",
                "narration": "sound://speech/whereToMove"
            }
        ],
        "impossible": [
            {
                "description": "You can't move anywhere.",
                "narration": "sound://speech/cantMoveAnywhere"
            }
        ]
    },

    # take controller
    {
        "type": "ctrl",
        "id": "take",
        "prompt": [
            {
                "description": "What item will you take?",
                "narration": "sound://speech/whatToTake"
            }
        ],
        "impossible": [
            {
                "description": "You can't take anything here.",
                "narration": "sound://speech/cantTakeAnything"
            }
        ]
    },

    # item use controller
    {
        "type": "ctrl",
        "id": "use",
        "prompt": [
            {
                "description": "What item will you use?",
                "narration": "sound://speech/whatItemWillYouUse"
            }
        ],
        "promptInteract": [
            {
                "description": "Use this on what?",
                "narration": "sound://speech/useThisOnWhat"
            }
        ],
        "nothingUseable": [
            {
                "description": "You have nothing to use.",
                "narration": "sound://speech/nothingToUse"
            }
        ],
        "noInteraction": [
            {
                "description": "Nothing happened.",
                "narration": "sound://speech/nothingHappened"
            }
        ],
        "noAction": [
            {
                "description": "Nothing happened.",
                "narration": "sound://speech/nothingHappened"
            }
        ]
    },

    # reaction to examine event
    {
        "type": "event",
        "on": ["examine", "*"],
        "report": [
            {
                "description": "{{args.1.visual.description}}",
                "narration": "{{{args.1.aural.description}}}"
            }
        ]
    },

    # reaction to player move event
    {
        "type": "event",
        "on": ["move", "*"],
        "exec": [
            {
                "action": "set",
                "args": ["player.scene", "{{args.1.id}}"]
            }
        ],
        "report": [
            {
                "title": "{{args.1.visual.name}}",
                "description": "{{args.1.visual.description}}",
                "backdrop": "{{args.1.visual.backdrop}}",
                "narration": "{{{args.1.aural.name}}}",
                "backdrop": "{{{args.1.aural.backdrop}}}"
            },
            {
                "narration": "{{{args.1.aural.description}}}"
            }
        ]
    },

    # reaction to take event
    {
        "type": "event",
        "on": ["take", "*"],
        "exec": [
            {
                "action": "move.item",
                "args": ["{{args.1.type}}.{{args.1.id}}", "player"]
            }
        ],
        "report": [
            {
                "description": "You have taken the {{args.1.visual.name}}.",
                "narration": "sound://speech/youHaveTakenThe",
            },
            {"narration": "{{{args.1.aural.name}}}"}
        ]
    },

    # reaction to taking the scalpel
    {
        "type": "event",
        "on": ["take", "scalpel"],
        "exec": [
            {
                "action": "append",
                "args": ["item.scalpel.properties", "useable"]
            },
            {
                "action": "append",
                "args": ["item.operatingTable.properties", "useable"]
            }
        ]
    },

    # reaction to moving into the operating room the first time
    # replaces the game intro text so next examine reports the basic
    # room description instead
    {
        "type": "event",
        "on": ["move", "operatingRoom"],
        "exec": [
            {
                "action": "set",
                "args": ["scene.operatingRoom.visual.description", visual_descriptions['operatingRoomAfter']]
            },
            {
                "action": "set",
                "args": ["scene.operatingRoom.aural.description", 'sound://speech/operatingRoomDesc']
            }
        ],
        "priority": -1
    }
]


def id_to_name(text):
    arr = []
    for i, c in enumerate(text):
        if i == 0:
            arr.append(c.upper())
        elif c.isupper():
            arr.append(' ')
            arr.append(c)
        else:
            arr.append(c)
    return ''.join(arr)


class Room:
    def construct(self, id, name, description, adjoins, contents):
        global world
        d = {
            'type': 'scene',
            'id': id,
            'adjoins': adjoins,
            'items': contents,
            'visual': {
                'name': id_to_name(id),
                'description': visual_descriptions.get(id)
            },
            'aural': {
                'name': 'sound://speech/%s' % (name.split('.')[0]),
                'description': 'sound://speech/%s' % (description.split('.')[0])
            }
        }
        self.__dict__.update(d)
        world.append(d)

    def __str__(self):
        return self.id


class Item:
    def construct(self, id, name, description, takeable):
        global world
        props = []
        if takeable:
            props.append('takeable')
            # all items are useable in original dim
            #props.append('useable')
        d = {
            'type': 'item',
            'id': id,
            'properties': props,
            'aural': {
                'name': 'sound://speech/%s' % (name.split('.')[0]),
                'description': 'sound://speech/%s' % (description.split('.')[0])
            },
            'visual': {
                'name': id_to_name(id),
                'description': visual_descriptions.get(id)
            }
        }
        self.__dict__.update(d)
        world.append(d)

    def __str__(self):
        return self.id


def interactions(triggers, vars):
    for item, targets in triggers.iteritems():
        for target, method in targets:
            d = {
                'type': 'event',
                'comment': method
            }
            if(item == 'player'):
                d['on'] = ['use', target]
            else:
                d['on'] = ['use', item, target]
            vars[target].properties.append('useable')
            d.update(use_events.get(method, {}))
            world.append(d)


def default(obj):
    return str(obj)


def main():
    #initialize the rooms and items
    player = Item()
    journal = Item()
    operatingRoom = Room()
    freezer = Room()
    basementHallway = Room()
    pianoRoom = Room()
    elevator = Room()
    study = Room()
    upperHallway = Room()
    bedroom = Room()
    bathroom = Room()
    closet = Room()
    bathroomHallway = Room()
    balcony = Room()
    westHallway = Room()
    lobby = Room()
    library = Room()
    masterBedroom = Room()
    masterBathroom = Room()
    masterElevator = Room()
    eleanorsRoom = Room()
    sittingRoom = Room()
    basement = Room()
    kitchen = Room()
    lab = Room()
    garage = Room()
    trappedHallway = Room()
    outside = Room()
    barn = Room()
    barnLoft = Room()

    operatingTable = Item()
    scalpel = Item()
    operatingRoomRecording = Item()
    operatingRoomDoor = Item()
    operatingRoomKey = Item()
    freezerBodies = Item()
    piano = Item()
    painting = Item()
    deskKey = Item()
    studyRecording = Item()
    computer = Item()
    phone = Item()
    safe = Item()
    desk = Item()
    bedroomRecording = Item()
    bed = Item()
    mirror = Item()
    bathtub = Item()
    shelf = Item()
    box = Item()
    broom = Item()
    hammer = Item()
    star = Item()
    starHole = Item()
    bathroomHallwayDoor = Item()
    safeRecording = Item()
    cellKey = Item()
    passCard = Item()
    upperHallwayDoor = Item()
    notebook = Item()
    mainEntrance = Item()
    masterBedroomDeskKey = Item()
    masterBedroomDesk = Item()
    masterBedroomBed = Item()
    libraryRecording = Item()
    masterBedroomRecording = Item()
    masterBathroomStarHole = Item()
    masterBathroomMirror = Item()
    sittingRoomDoor = Item()
    knife = Item()
    trappedHallwayDoorKey = Item()
    eleanor = Item()
    gun = Item()
    labDoor = Item()
    ingredients = Item()
    mazeDoor = Item()
    garageDoor = Item()
    garageKey = Item()
    gasoline = Item()
    trappedHallwayDoor = Item()
    barnDoor = Item()
    barnSwitch = Item()
    eleanor2 = Item()


    #construct the rooms and items
    operatingRoom.construct("operatingRoom", "operatingRoom.mp3", "intro.mp3", [], [operatingTable, scalpel])   #freezer, operatingRoomDoor accessible after scalpelToOperatingTable, locked door to basementHallway
    freezer.construct("freezer", "freezer.mp3", "freezerDesc.mp3", [operatingRoom], [freezerBodies, operatingRoomKey])
    basementHallway.construct("basementHallway", "basementHallway.mp3", "basementHallwayDesc.mp3", [operatingRoom, pianoRoom], [journal, labDoor]) #hidden door to elevator
    pianoRoom.construct("pianoRoom", "pianoRoom.mp3", "pianoRoomDesc.mp3", [basementHallway], [painting, piano])
    elevator.construct("elevator", "elevator.mp3", "elevatorDesc.mp3", [basementHallway, study], [])
    study.construct("study", "study.mp3", "studyDesc.mp3", [upperHallway], [deskKey, studyRecording, computer, phone, safe])
    upperHallway.construct("upperHallway", "upperHallway.mp3", "upperHallwayDesc.mp3", [study, bedroom, closet], [upperHallwayDoor, journal])
    bedroom.construct("bedroom", "bedroom.mp3", "bedroomDesc.mp3", [upperHallway, bathroom], [desk, bed])
    bathroom.construct("bathroom", "bathroom.mp3", "bathroomDesc.mp3", [bedroom], [journal, mirror, bathtub, shelf])
    closet.construct("closet", "closet.mp3", "closetDesc.mp3", [upperHallway], [broom, hammer])
    bathroomHallway.construct("bathroomHallway", "bathroomHallway.mp3", "bathroomHallwayDesc.mp3", [bathroom], [bathroomHallwayDoor])
    balcony.construct("balcony", "balcony.mp3", "balconyDesc.mp3", [upperHallway, westHallway, lobby], [])
    westHallway.construct("westHallway", "westHallway.mp3", "westHallwayDesc.mp3", [balcony, masterBedroom, library], [journal])
    lobby.construct("lobby", "lobby.mp3", "lobbyDesc.mp3", [balcony, kitchen], [journal, mainEntrance, trappedHallwayDoor])
    library.construct("library", "library.mp3", "libraryDesc.mp3", [westHallway], [notebook, masterBedroomDeskKey, libraryRecording])
    masterBedroom.construct("masterBedroom", "masterBedroom.mp3", "masterBedroomDesc.mp3", [westHallway, masterBathroom], [masterBedroomDesk, masterBedroomBed])
    masterBathroom.construct("masterBathroom", "masterBathroom.mp3", "masterBathroomDesc.mp3", [masterBedroom], [masterBathroomMirror, masterBathroomStarHole])
    masterElevator.construct("masterElevator", "masterElevator.mp3", "masterElevatorDesc.mp3", [masterBathroom, sittingRoom, basement], [])
    eleanorsRoom.construct("eleanorsRoom", "eleanorsRoom.mp3", "eleanorsRoomDesc.mp3", [sittingRoom], [eleanor])
    sittingRoom.construct("sittingRoom", "sittingRoom.mp3", "sittingRoomDesc.mp3", [masterElevator], [journal, sittingRoomDoor])
    basement.construct("basement", "basement.mp3", "basementDesc.mp3", [masterElevator], [journal, mazeDoor])
    kitchen.construct("kitchen", "kitchen.mp3", "kitchenDesc.mp3", [lobby], [knife, garageDoor])
    lab.construct("lab", "lab.mp3", "labDesc.mp3", [basementHallway], [])
    garage.construct("garage", "garage.mp3", "garageDesc.mp3", [kitchen], [journal, gasoline, trappedHallwayDoorKey])
    trappedHallway.construct("trappedHallway", "trappedHallway.mp3", "trappedHallwayDesc.mp3", [lobby, outside], []) #Desc, traps have been deactivated
    outside.construct("outside", "outside.mp3", "outsideDesc.mp3", [trappedHallway], [journal, barnDoor])
    barn.construct("barn", "barn.mp3", "barnDesc.mp3", [outside, barnLoft], [barnSwitch])
    barnLoft.construct("barnLoft", "barnLoft.mp3", "barnLoftDesc.mp3", [barn], [eleanor2])

    # player.construct("player", "self.mp3", "selfDesc.mp3", 0)
    journal.construct("journal", "journal.mp3", "journalDesc.mp3", 0)
    operatingTable.construct("operatingTable", "operatingTable.mp3", "operatingTableDesc.mp3", 0)
    scalpel.construct("scalpel", "scalpel.mp3", "scalpelDesc.mp3", 1)
    operatingRoomRecording.construct("operatingRoomRecording", "recording.mp3", "operatingRoomRecordingDesc.mp3", 0)
    operatingRoomDoor.construct("operatingRoomDoor", "operatingRoomDoor.mp3", "operatingRoomDoorDesc.mp3", 0)
    operatingRoomKey.construct("operatingRoomKey", "operatingRoomKey.mp3", "operatingRoomKeyDesc.mp3", 1)
    freezerBodies.construct("freezerBodies", "freezerBodies.mp3", "freezerBodiesDesc.mp3", 0)
    piano.construct("piano", "piano.mp3", "pianoDesc.mp3", 0)
    painting.construct("painting", "painting.mp3", "paintingDesc.mp3", 0)
    deskKey.construct("deskKey", "deskKey.mp3", "deskKeyDesc.mp3", 1)
    studyRecording.construct("studyRecording", "recording.mp3", "studyRecordingDesc.mp3", 0)
    computer.construct("computer", "computer.mp3", "computerDesc.mp3", 0)
    phone.construct("phone", "phone.mp3", "phoneDesc.mp3", 0)
    safe.construct("safe", "safe.mp3", "safeDesc.mp3", 0)
    desk.construct("desk", "desk.mp3", "deskDesc.mp3", 0)
    bedroomRecording.construct("bedroomRecording", "recording.mp3", "bedroomRecordingDesc.mp3", 0)
    bed.construct("bed", "bed.mp3", "bedDesc.mp3", 0)
    mirror.construct("mirror", "mirror.mp3", "mirrorDesc.mp3", 0)
    bathtub.construct("bathtub", "bathtub.mp3", "bathtubDesc.mp3", 0)
    shelf.construct("shelf", "shelf.mp3", "shelfDesc.mp3", 0)
    box.construct("box", "box.mp3", "boxDesc.mp3", 0)
    broom.construct("broom", "broom.mp3", "broomDesc.mp3", 1)
    hammer.construct("hammer", "hammer.mp3", "hammerDesc.mp3", 1)
    star.construct("star", "star.mp3", "starDesc.mp3", 1)
    starHole.construct("starHole", "starHole.mp3", "starHoleDesc.mp3", 0)
    bathroomHallwayDoor.construct("bathroomHallwayDoor", "bathroomHallwayDoor.mp3", "bathroomHallwayDoorDesc.mp3", 0)
    safeRecording.construct("safeRecording", "safeRecording.mp3", "safeRecordingDesc.mp3", 0)
    cellKey.construct("cellKey", "cellKey.mp3", "cellKeyDesc.mp3", 1)
    passCard.construct("passCard", "passCard.mp3", "passCardDesc.mp3", 1)
    upperHallwayDoor.construct("upperHallwayDoor", "upperHallwayDoor.mp3", "upperHallwayDoorDesc.mp3", 0)
    notebook.construct("notebook", "notebook.mp3", "notebookDesc.mp3", 0)
    mainEntrance.construct("mainEntrance", "mainEntrance.mp3", "mainEntranceDesc.mp3", 0)
    masterBedroomDeskKey.construct("masterBedroomDeskKey", "masterBedroomDeskKey.mp3", "masterBedroomDeskKeyDesc.mp3", 1)
    masterBedroomBed.construct("masterBedroomBed", "bed.mp3", "masterBedroomBedDesc.mp3", 0)
    masterBedroomDesk.construct("masterBedroomDesk", "desk.mp3", "masterBedroomDeskDesc.mp3", 0)
    libraryRecording.construct("libraryRecording", "recording.mp3", "libraryRecordingDesc.mp3", 0)
    masterBedroomRecording.construct("masterBedroomRecording", "recording.mp3", "masterBedroomRecordingDesc.mp3", 0)
    masterBathroomStarHole.construct("masterBathroomStarHole", "starHole.mp3", "starHoleDesc.mp3", 0)
    masterBathroomMirror.construct("masterBathroomMirror", "mirror.mp3", "mirrorDesc.mp3", 0)
    knife.construct("knife", "knife.mp3", "knifeDesc.mp3", 1)
    trappedHallwayDoorKey.construct("trappedHallwayDoorKey", "trappedHallwayDoorKey.mp3", "trappedHallwayDoorKeyDesc.mp3", 1)
    sittingRoomDoor.construct("sittingRoomDoor", "sittingRoomDoor.mp3", "sittingRoomDoorDesc.mp3", 0)
    eleanor.construct("eleanor", "eleanor.mp3", "eleanorDesc.mp3", 0)
    gun.construct("gun", "gun.mp3", "gunDesc.mp3", 1)
    labDoor.construct("labDoor", "labDoor.mp3", "labDoorDesc.mp3", 0)
    ingredients.construct("ingredients", "ingredients.mp3", "ingredientsDesc.mp3", 1)
    mazeDoor.construct("mazeDoor", "mazeDoor.mp3", "mazeDoorDesc.mp3", 0)
    garageDoor.construct("garageDoor", "garageDoor.mp3", "garageDoorDesc.mp3", 0)
    garageKey.construct("garageKey", "garageKey.mp3", "garageKeyDesc.mp3", 1)
    gasoline.construct("gasoline", "gasoline.mp3", "gasolineDesc.mp3", 1)
    trappedHallwayDoor.construct("trappedHallwayDoor", "trappedHallwayDoor.mp3", "trappedHallwayDoorDesc.mp3", 0)
    barnDoor.construct("barnDoor", "barnDoor.mp3", "barnDoorDesc.mp3", 0)
    barnSwitch.construct("barnSwitch", "barnSwitch.mp3", "barnSwitchDesc.mp3", 0)
    eleanor2.construct("eleanor2", "eleanor.mp3", "eleanorDesc4.mp3", 0)

    itemUses = {"player":[["journal", 'save'], ["painting", 'playerToPainting'], ["piano", 'playerToPiano'], ["box", 'playerToBox'], ["bathroomHallwayDoor", 'playerToBathroomHallwayDoor'], ["computer", 'playerToComputer'], ["safe", 'playerToSafe'], ["barnSwitch", 'playerToBarnSwitch']],
                    "scalpel":[["operatingTable", 'scalpelToOperatingTable']],
                    "operatingRoomKey":[["operatingRoomDoor", 'operatingRoomKeyToOperatingRoomDoor']],
                    "broom":[["shelf", 'broomToShelf']],
                    "star":[["starHole", 'starToStarHole'], ["masterBathroomStarHole", 'starToMasterBathroomStarHole']],
                    "deskKey":[["desk", 'deskKeyToDesk']],
                    "hammer":[["mirror", 'hammerToMirror'], ["upperHallwayDoor", 'hammerToUpperHallwayDoor']],
                    "cellKey":[["bathroomHallwayDoor", 'cellKeyToBathroomHallwayDoor']],
                    "passCard":[["mainEntrance", 'passCardToMainEntrance'], ["sittingRoomDoor", 'passCardToSittingRoomDoor'], ["mazeDoor", 'passCardToMazeDoor], ["barnDoor", passCardToBarnDoor']],
                    "masterBedroomDeskKey":[["masterBedroomDesk", 'masterBedroomDeskKeyToMasterBedroomDesk']],
                    "knife":[["eleanor", 'knifeToEleanor'], ["eleanor2", 'knifeToEleanor2']],
                    "ingredients":[["eleanor", 'ingredientsToEleanor']],
                    "garageKey":[["garageDoor", 'garageKeyToGarageDoor']],
                    "gun":[["garageDoor", 'gunToGarageDoor']],
                    "trappedHallwayDoorKey":[["trappedHallwayDoor", 'trappedHallwayDoorKeyToTrappedHallwayDoor']],
                    "gasoline":[["eleanor2", 'gasolineToEleanor2']]}

    interactions(itemUses, vars())

if __name__ == '__main__':
    main()
    with file('../webapp/data/world.json', 'w') as f:
        json.dump(world, f, default=default, indent=4)
