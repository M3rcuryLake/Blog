---
title: "Packer"
date: 2025-08-02T04:11:46+05:30
draft: false
---
[packer picoCTF link](https://play.picoctf.org/practice/challenge/421)

This wasn’t my first time doing reverse engineering challenges, but it was my first rodeo with picoCTF. Pretty easy overall — I could’ve solved it with my own analysis toolkit (`nyxelf`), but I decided to use Ghidra this time for a change of pace.

Running `readelf -S out` showed no symbol table, and the headers confirmed the binary was stripped. Given the name *packer*, I suspected it was packed. A quick `strings out` showed "UPX" and "UPX!", confirming it was compressed with UPX.

After unpacking it with `upx -d out`, `readelf` revealed a large number of imports, including `main`. Considering how simple the binary was, this felt excessive — likely due to control flow or static obfuscation.

I loaded it into Ghidra, searched for `main`, and instantly found the flag in plain hex (`7069636...`). Converting that to ASCII revealed the flag:
**`picoCTF{U9X...}`**


