---
title: Once again - Diesmal mit Hexo.io
date: 2015-11-28 23:30:42
layout: blog.html
collection: blog
teaser: |+
    <div class="img third right"><img src="https://img.samisdat.org/resize/width/245/https://pbs.twimg.com/profile_images/476729162707644418/mQZOTo9f.png" class="img-responsive" alt="Hexo Logo"></div>
    
    Nachdem ich jahrelang weder Lust noch Zeit hatte, um hier was zu schrieben, habe ich zumindest wieder Lust bekommen.
    
    Da ich **unter *der Haube* auf jeden Fall von PHP zu NodeJS wechseln wollte,  habe ich mich erstmal für [Hexo](https://hexo.io) als Blog Engine entschieden,
    
    Das macht nach den ersten Wochen rumspielen einen recht soliden Eindruck und vor allem kann ich mich an allen möglichen Stellen in Hexo reinhängen und Verhalten anpassen oder erweitern. 
tags:
---

<div class="img third right"><img src="https://img.samisdat.org/resize/width/245/https://pbs.twimg.com/profile_images/476729162707644418/mQZOTo9f.png" class="img-responsive" alt="Hexo Logo"></div>

Nachdem ich jahrelang weder Lust noch Zeit hatte, um hier was zu schrieben, habe ich zumindest wieder Lust bekommen.

Die vorherige Inkarnation von samisdat.org wurde von Textpattern angetrieben.
Da ich mich in letzter Zeit intensiv mit NodeJS beschäftigt habe, war klar, dass ich von PHP weg wollte.

## Ghost

Viel erwartet hatte ich da von Ghost und ich hab das Projekt auch mit gebacked, aber so richtig überzeugend ist das nicht aus den Startlöchern gekommen:

* Viel Ressourcen scheinen durch die [Ghost Plattform](https://ghost.org/pricing/) mit gehosteten Blogs gebunden zu sein
* Das Dashboard war eines der Features, dass auf Kickstarter prominent hervorgehoben wurde und das mir richtig gut gefallen hat. Aber das ist mitterweile komplett aus dem Projekt [gekickt worden](https://blog.ghost.org/year-2/#thedashboard)
* Plugins werden offensichtlich mit [sehr niedriger Prio](https://github.com/TryGhost/Ghost-App) vorangebracht und funktionieren im wesentlichen noch nicht

Ich hab einige Abende in Ghost versenkt, bevor ich es beiseite gelegt habe und mich nach was anderem umgesehen habe. 

So richtig dick gesäht sind NodeJs Blog-Engines noch nicht, aber bei der Suche bin ich auf Hexo.io gestoßen.

## Hexo

[Hexo](https://hexo.io) nimmt Markdown Posts und Templates von der Platte, parst beides zusammen und generiert daraus einfach statische HTML Seiten, die ich dann von einem Nginx ausliefern lassen. 
Hexo könnte sich sogar selber um das Deployen der Seiten kümmern. 

Und zum lokalen Entwickeln bringt hexo noch eine Server-Komponete mit, die das Markdown & Templates live zusammenbringt.

Das macht nach den ersten Wochen rumspielen einen recht soliden Eindruck und vor allem kann ich mich an allen möglichen Stellen in Hexo reinhängen und Verhalten anpassen oder erweitern. 

## Layout

Da ich sowieso weiß, dass ich nicht mit dem Layout oder dem Code dieser Seite zufrieden sein werde, habe ich beschlossen ~~zu versuchen~~, dass zu akzeptieren oder zumindest zu tolerieren.

Diesmal ist der Plan, lieber heute eine Seite heute als morgen eine bessere.
Daher hab ich auf meiner Platte geguckt, was da so rum liegt und das [Conway-Script](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) aus dem Header war schon ziemlich weit; darum hab ich dann noch ein bißchen Bootstrap gerotzt und das ist jetzt erstmal die 0.1.0.

