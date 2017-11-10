---
layout: post
title:  "What is Robots.txt file and how to configure it?"
date:   2017-09-12 11:26:36 +0200
author: Sarpreet Singh
---

*Robots.txt* is a text file which is used by the website owners in order provide instructions to the web robots about their website. For configuring the *robots.txt* we need to specify the end point in order to **Disallow** it as well as the **User-agent** so that it cannot visit the specfic endpoint and place the file in the root folder. Below is the copy of *robots.txt* file of my website, where * applies to all robots and only *contact page* is disallowed.

{% highlight text %}
User-agent: *
Disallow: /contact.html
{% endhighlight %}