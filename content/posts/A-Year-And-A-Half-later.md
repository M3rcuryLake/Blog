---
title: "A Year and a Half Later"
date: 2024-12-07T18:52:59+05:30
draft: False
---
It’s been more than a year since I wrote something. Not my fault that my life was ridiculously monotonous for a long while, but still, a great deal of stuff happened during these months: I passed high school, got into college, and I’m now studying for a degree in Electronics and Comms Engineering.

From another standpoint, a lot has happened too: planned multiple projects, never ended up doing them, coded an "automatic reels generator" called Cassette, which generated informative reels with Python. It went pretty well. All you needed to do was enter what you wanted as the topic of the video, the secondary video file (for the brainrot effect), and the style of the voice and font. As of writing this blog, I have around 25 stars on the Git repo—not amazing, but it’s still something.

Then I got interested in some low-level coding and reverse engineering stuff. I learned some basics of x64_86 assembly and C language memory allocation and tried to reverse engineer a game. I failed miserably. I may have underestimated the monstrosity of the task, but I still managed to learn something useful. I plan to continue this, but next time I’ll use binaries from picoCTF or GitHub.

Currently, I’m diving deep into electronics and low-level stuff. Recently, I coded and developed a motion detection camera for a uni project using a PIR sensor and ESP32-CAM module. Its working is simple: the PIR detects motion, the integrated camera on the ESP takes a picture, and it sends the image to the person subscribed on Telegram. I really wanted to add an object recognition system to the pictures too and had already developed it when I realized that implementing it with the ESP32 would be a huge task. Call it bad luck.

I learned a great deal from it, especially since this field was foreign to me. I’m thinking of making similar but better projects with more real-life applications that suit me.

Talking about the site itself, I went against my own principles and made a damn heavy site. The memory footprint on the landing page is around 52 megabytes idling, and around 90 megabytes in lofi-cafe, which can gradually increase to around 200 megabytes during the stay of an average visitor. The images are uncompressed and above 250 kilobytes, and the MP4 file in lofi-cafe mobile is a galactic 2.4 megabytes, along with the 200-kilobyte GIF of Lain. Yes, I know, I need to do something about it.

On the bright side, I removed the Tailwind Typography dependencies and went with something custom-made, which both looks cool and matches the style of the page. I really want to showcase it.

Finally, on an ending note, my next post is probably going to be about how I made that camera project. I think, maybe, just to practice how much C knowledge I have, I’ll also make a Linux shell as a project (or maybe not, idk).


