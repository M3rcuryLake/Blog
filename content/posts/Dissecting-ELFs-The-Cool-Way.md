---
title: "Dissecting ELFs the Cool Way"
date: 2025-02-20T01:35:04+05:30
draft: true
---

With the new year came a desperate need for a new side project. So, to overcome boredom, I wrote a fairly simple yet cool disassembler in fairly simple python. Initially, I had planned to make a basic antivirus project—something I had in mind back in twelfth grade. It was supposed to be a simple sandbox environment, passing dynamic analysis results to a free LLM API like Groq or Gemini—not a full-fledged executable analysis toolkit.

But as ideas started flowing, the weekend side project stretched into a fifteen-day project, mostly because I was only committing to it late at night. In short, it’s a tool for analyzing malicious Linux ELF binaries, offering both static and dynamic analysis. The idea for dynamic analysis using QEMU emulation is shamelessly stolen from LiSa, an awesome dynamic analysis toolkit. However, instead of using `SystemTap` like LiSa does, I went with `strace` to capture output—mainly because I had no clue how to add foreign packages and compile a Buildroot image.

Later, I added decompilation functionality, allowing it to decompile binary data into assembly and C-like pseudocode using `Capstone` and `angr`. The highlight of the codebase is the hardcoded variable retrieval algorithm. It analyzes the most significant byte to infer whether a value is signed or unsigned. What I learned (from ChatGPT) is that if the most significant byte is `0x80`, it’s most likely signed. Using this assumption, I pulled it off—and it worked, sometimes. I later realized that if the integer was too large, its most significant bit would still be `1`, making the function useless.

About a week later, I extended the packer detection script, and now it can detect PyInstaller-packed files. (Which is kind of useless, given that it only takes a minute to figure that out manually. But it does save a minuite as the UI screams it at your face instantly.)

I deliberately avoided using classes and objects to keep the code simple—also because I’m not really acquainted with them.

BUT, the code is far from being what anyone would call “good.” Sure, the variable names are decent, and the documentation is fine, but the UI is horrible. `strace` output is sometimes illegible, even though I’ve dereferenced its annoying abbreviations. The decompilation methods using `Capstone` and `angr` are  just boilerplate code, straight from their docs, with zero modifications. The number of direct readelf shell invocations via subprocess is disgusting. And there’s no network analysis support yet.

But it works. As of wriiting this, I have over a hundred stars in this project's github repo, 86 of which i gained in the first week, and 62 stars in the hackernews post and Its has been covered by two or three github repo aggregators (notably Real Python in twitter). and came in the 98th position in hackernews in showcase category in January (does this matter idk, first-timer here).

I had plans to add network analysis and anti-anti-debugging techniques (like setting ptrace to `'\0'` or inserting `NOPs` to mess with timing checks), but honestly, I doubt these will ever see the light of day. Right now, I’m focusing on some DSA stuff in C—it’s part of my coursework, and I find it pretty interesting.

As for writing a Linux shell in pure C, Nope. Not happening anytime soon. And I have no clue what to do next.


