---
layout: post
title:  "What is Open Graph and how do you make use of it?"
date:   2017-09-12 12:25:11 +0200
author: Sarpreet Singh
---

*Open Graph* is a protocol introduced by Facebook that allows integration between social media and a website. In order to configure it, I added some properties inside the `<meta>` tag such as *title*, *url*, *type* and *image* and embed them in the head section. Below is the example of my implementation

{% highlight text %}
<head>
    <meta property="og:title" 
    content="Web Programming" />
    
    <meta property="og:url" 
    content="link of the website" />
    
    <meta property="og:type" 
    content="website" />
    
    <meta property="og:image" 
    content="link of the image" />
</head>
{% endhighlight %}