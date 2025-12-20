Any files placed into this folder (other than .md files) will be thrown into the Sequencer database.
The path to the files is generated from the file name as follows:
    * Spaces ' ' are replaced with periods '.'
    * Back Slashes '\' are replaced with periods
    * Forward Slashes '/' are replaced with periods '.'
    * Excess end of name periods are removed
    * All multiple periods '..' are replaced with a single period '.'
    * Periods dictate nesting

For example:
  This_Is A Cool/File.webm becomes this_is.a.cool.File.webm

  This will generate a database entry that looks like:
  {
    this_is: {
        a: {
            cool: "assets/This_Is A Cool/File.webm"
        }
    }
  }

IMPORTANT: Resolving conflicts:
    The module will resolve conflicts by appending 01 onto the offending string -- AVOID CONFLICTS! THIS ISN'T WELL TESTED

For example:
   My_Sounds Fire.ogg           <-- First mentioned
   My_Sounds Fire Blaster.mp3
   My_Sounds.Fire.mp3

  This will generate database with
  {
    my_sounds: {
        fire: "assets/My_Sounds/Fire.ogg", <-- Conflict here, we can't have this also be { blaster: "assets/My_Sounds/Fire Blaster.mp3" }
    }
  }