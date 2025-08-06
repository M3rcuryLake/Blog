
---
title: "Bbbbloat"
date: 2025-08-07T00:56:09+05:30
draft: false
---

[link to the binary](https://https://play.picoctf.org/practice/challenge/255)

This one's similar to picoCTF’s `packer`, except it comes unpacked. Straightforward overall — standard binary reverse engineering flow gets the job done.

`readelf -a bbbbloat` didn’t show anything unusual, just a large number of functions. `strings` also returned nothing revealing.

Loading the binary into Ghidra showed an overwhelming number of functions. Digging into `FUN_00101307`, we see it takes input, stores it in `local_48`, and compares it to the hex value `0x86187`. Submitting the ASCII equivalent in the challenge prompt gives us the flag: **`picoCTF{cu7_...}`**

Interestingly, I couldn't find the flag in Ghidra itself, it was not hardcoded anywhere — `FUN_00101307` only verifies the input. If correct, it passes the value `0x4c75257240343a41` to another function, `FUN_00101259`, which acts like a keygen and generates the actual flag using a shifting based encoding algorithm. So I dug in, and the kegen algorithm looked impressive. After cleaning up the code, the keygen logic looks like this:

```c
char *encode_string(undefined8 unused_param, char *input)
{
    char current_char;
    char *encoded_str;
    size_t length;
    ulong i;
    
    encoded_str = strdup(input);               
    length = strlen(encoded_str);          

    for (i = 0; i < length; i++) {
        if ((' ' < encoded_str[i]) && (encoded_str[i] != '\x7f')) {
            current_char = encoded_str[i] + 0x2F;  // shift
            if ((unsigned char)current_char < 0x7F) {
                encoded_str[i] = current_char;
            } else {
                encoded_str[i] = current_char - 0x5E;
            }
        }
    }

    return encoded_str;
}
```
