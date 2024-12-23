---
title: "Chopped Onions"
date: 2024-12-24T02:00:25+05:30
draft: False
---
Since the dawn of this site, it has gone through multiple major changes. Every time I got bored of the design, I just re-themed it. Using Tailwind CSS allowed for a smooth transition and gave me complete control over the site's styles. But if you've read my previous blogs, you'd know it was a nightmare to make Tailwind CSS work with Hugo.

At the start of every re-theming session, I’d have to relearn how everything worked four months earlier, fix it, and then watch it completely fail the build process four months later. This cycle went on for a long time.

Now, the real tragedy? There was actually a fix for it. Hugo added support for Tailwind at the end of 2023. But the announcement was so weak, it barely gained any publicity. I only found out about it an entire year later.

So yeah—this site finally and officially supports Tailwind CSS. And I have to say, the build process is far more streamlined now, and things make much more sense.

On another note, I also managed to get Tor working with Docker on Render, complete with a custom hostname (to avoid the issue of randomly changing hostnames). So, I now have an onion server that’s pretty fast compared to most darknet services. Vist it [here](http://mercurybq3vwbf426l7o7t77od3unpyiy3he7b5jcywdh56kwis4maqd.onion/)

I’ve also thrown in some Nginx shenanigans to make it reasonably secure. Plus, I figured out how to host multiple sites on a single onion Docker server. That’ll probably be my focus until Christmas, and I’ll put together a tutorial for it in my next post. And yeah, idk why but this is a very short post compared to other posts.


