---
title: "Thoughts?..."
date: 2022-10-23T19:50:24+05:30
draft: False
---
Hiyaa, its my first time blogging and I am pretty lost for words, and content....both...So lets just talk abt the new Onion server which i hosted...previously, it was hosted on Heroku and yesterday night it was migrated to Render, who are gracious enough to keep a free plan without a credit card, but there are some downsides too.

Hosting a Onion server on heroku or render or any PaaS service is like fighting with a double eged sword....No, yea they do a good service....but that does'nt explain why the Web Service has a continuously changing hostname....like, wake up render, I dont want a Fast flux....My extensive research abt this silly topic nearly wasted 3 days of my precious time.

Every renowned hosting service provide a generous plan....like Oracle...man they are crazy...they provide 2 AMD based Compute VMs with 1 GB memory each......Arm-based Ampere A1 cores and 24 GB of memory usable as 1 VM or up to 4 VMs with 3,000 OCPU hours and 18,000 GB hours per month....AND, 2 Block Volumes Storage, 200 GB total.

Now.....arent they crazy???.....but guess what??? they require credit card to verify "if you are a bot or not". For a student like me....it is enough to give deep heartburns...And to talk about this website......Mannnn....I lost count of endless days of just "debugging"....man that shit is painful.

This website is hosted in Cloudflare Pages, on a hugo-github backend mixture. No databases, no hardcoded javascript, just a minimal goodness of Tailwind CSS. And I plan to add a search to the website if possible...and yeah, the whole freaking website is made by me and me alone.
