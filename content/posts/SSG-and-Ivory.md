---
title: "SSG and Ivory"
date: 2023-03-19T00:55:26+05:30
draft: false
---

Well...As the Title suggests...I have completed the static site generator which I was talking about in my previous post. Its up in my github account or follow this [link](https://github.com/m3rcurylake/ivory) to get there...The motive behind this was pretty simple, I wanted a SSG which was customisable so that I can set it up with Tailwind css, not over-complicated but had all the things it was supposed to. For example, Hugo has some millions of parameters, shortcodes, partials and other things which baffled the heck out of me...it took me nearly a week to understand how the hell to create a simple page with it, let alone setup tailwind css...*with postcss*.

So here it is...a simple SSG, made with python, which is capable enough to fulfill my needs of a simple blog running on tailwind css, which I can use anywhere...It can build its own sitemaps, has thirteen defined template parameters, so that you dont have to do "programming" (unlike jinja2 or mako) while you are on your html...And I am also thinking of putting up a documentation for it somewhere, cuz understanding a 300 line code is a pretty hard job.

And finally, I plan it to use it on my onion site...with some local fonts to decrease the loading time...its gonna be simple and plain...But the problem will be transfering the markdown post files from my PC to my VPS on mogenius. Using scripts and a github repo will make it...or  something like a script to host a mirror from my PC with ngrok and a script on VPS to get the files...and build it simultaniously...not too big of a problem for me...just a half an hour work.

On a final note...things are getting busy out here...Im barely getting time to try out new tech (havent touched chatgpt since last month, learnt about Midjourney5 yesterday...that how bad it is), let alone learn SQL or PHP...so I decided to work on my work first and then work on the encryption algorithm later...And also, I will be releasing my personal malware cryptor (yes...i used to be interested in PenTesting and hacking earlier...*wont reveal much about it here*) in my github account as a PoC after a little edit...its been on my inventory since long...(I developed it last year November)...I will talk about it in a different post
