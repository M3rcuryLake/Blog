---
title: "Crackme100"
date: 2025-08-07T01:13:06+05:30
draft: false
---

[link to the binary](https://play.picoctf.org/practice/challenge/409)

Started off with the usual recon — `readelf` revealed the presence of a `main` function. Dumped it into Ghidra and ran into a weird-looking keygen algorithm.

After cleaning things up, the code looked like this:

```c
#include <stdio.h>
#include <string.h>

int main(void)

{
  int addened;
  int adder;
  char input[51];
  char output[51];
  int random2;
  int random1;
  char fix;
  int secret3;
  int secret2;
  int secret1;
  
  strncpy(output,"mpknnphjngbhgzydttvkahppevhkmpwgdzxsykkokriepfnrdm",51);
  printf("Enter the secret password: ");
  scanf("%s", &input[51]);
  int len = strlen(output);
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < len; j++) {
      adder = (j % 0xff >> 1 & 0x55) + (j % 0xff & 0x55);
      adder = (adder >> 2 & 0x33U) + (adder & 0x33);
      int key = (adder >> 4) + (adder & 0xf);
      addened = (input[j] - 97) + key; //(convert alphabets to a index based position like 'a' -> 0, and adds the key )
      input[j] = addened + (addened / 26) * -26; //Basically iVar2 % 26, even for negative values
      input[j] = input[j] + 'a';	//Converts the 0–25 range back to alphabets
    }
  }

  printf("%s\n", input);
  int chk = memcmp(input,output,(long)(int)len);
  if (chk == 0) {
    printf("SUCCESS! Here is your flag: %s\n","picoCTF{sample_flag}");
  }
  else {
    puts("FAILED!");
  }
  return 0;
}
```

At first, I was completely lost — couldn’t find any static flag, just a 51-character long hash stored in `output`, and some obscure shifting logic applied on user input.

Finally I began to draw some logic after an hour of thinking, the binary takes an input, salts it with its own algorithm, then compares it with the hardcoded 51 charecter long hash. I noticed the **key generation** was  based on the iterator. So the "key" remains constant (and predictable, as the only value modifying arugment is the iterater variable). So if i negate the key from the addened, I would get another charecter. if I did this three times, I would get the final charecter which should be the password.

If I could subtract the key used at each position from the scrambled character, I could get back the original password — and since this mutation loop runs 3 times, I just had to reverse it 3 times.

So I wrote a Python script to reverse the entire transformation:

```py
def get_shift_amount(iter):  //the "key"
    adder = ((iter >> 1) & 0x55) + (iter & 0x55)
    adder = ((adder >> 2) & 0x33) + (adder & 0x33)
    key = (adder >> 4) + (adder & 0xF)
    return key

def solver(letter, x):  //negating key operation
    key = get_shift_amount(x)
    dec = chr((((ord(letter) - 97) - key + 26) % 26) + 97)   #(97 = ordinal of 'a')
    return dec

def decode_password(text):  //the loop runner
    letters = list(text)
    for _ in range(3):
        for i in range(len(letters)):
            letters[i] = solver(letters[i], i)
    return ''.join(letters)

scrambled = "mpknnphjngbhgzydttvkahppevhkmpwgdzxsykkokriepfnrdm"
print(decode_password(scrambled))
```

Wellll....completing this challenge did take up more than 5 hours, but im happy I managed to solve this shit.

