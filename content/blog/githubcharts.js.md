---
title: Github Trending Javascript - Vom 12.10 bis zum 19.10.2016
date: 2016-10-19 19:37:59
layout: blog.html
collection: blog
teaser: |+ 
    <p>Auf <a href="https://github.com/">github</a> gibt es unter <a href="https://github.com/trending/">GitHub Trending</a> quasi <em>die</em> OpenSource-Charts.</p>

    <p>Aufgeteilt nach Sprache wird gelistet, welche Projekte auf Github wieviele Sterne bekommen haben. Und nicht insgesamt, sondern wieviele Sterne heute, wieviele in der letzen Woche und wieviele im letzen Monat.</p> 

    <p>Diese Daten hab ich mal abgeholt, weggeschrieben und dann in ein <a href="https://d3js.org/">D3 Chart</a> gepackt. Da sieht man gut, wie sich die Trends entwickeln.</p> 

tags:
---

<script src="https://d3js.org/d3.v4.js"></script>

{% gitchart javascript 2016-10-19 weekly %}
