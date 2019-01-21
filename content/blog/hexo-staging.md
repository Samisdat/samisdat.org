---
title: hexo-staging
date: 2016-02-03 20:57:21
layout: blog.html
collection: blog
teaser: |+
    Mit Bordmitteln hat Hexo kein Staging; daher hab ich mein erstes Hexo Plugin geschrieben. 
    
    Damit können einzelne Einstellungen in der _config.yml pro Staging geswitch werden.
    Außerdem gibt es ein Conditional Tag mit dem in den Templates Code nur in einem definierten Staging genutzt werden kann.  
tags:
---

Mit Rum- und Ausprobieren und ein Doku-Lesen bin ich mit mich Hexo schon relativ weit gekommen.

Grundsätzlich hat Hexo zwei verschiedene Modi:
        
* [hexo generate](https://hexo.io/docs/generating.html) läuft alle Routen durch, rendert die dazugehörigen Seiten und speichert sie als statische Files auf die Platte. Die generierten Dateien laden bei mir im Live-System und werden da von einem Nginx ausgeliefert.
* [hexo server](https://hexo.io/docs/server.html) startet einen Server und rendert dynamisch die angefragte Seite. Der Server ist etwas träge, hat aber einen Watcher und ich nutze das lokal zum Entwickeln.

Die zwei Prozesse getrennt zu haben, ist schon praktisch, aber mir fehlte noch ein Staging mit dem ich zwischen **Development** und **Production** unterscheiden und switchen kann.
Daher hab ich mein erstes Hexo Plugin geschrieben, dass Hexo um einen einfachen Staging-Mechanismus erweitert. 

## Installation

Einfach nur per **npm** installieren:
  
```bash
cd /root/of/your/hexo/project

npm install hexo-staging
```

## Staging in der _config.yml

In der Config fügt mal einen neues **Stagings** ein; darin pro Staging die Einstellungen, die für das Staging geändert werden sollen.
Die Staging Namen sind überigens egal; ich benutze **production** und **development**.  

```yaml
title: "Samisdat"
url: "http://example.com"

stagings:
  development:
    title: "Samisdat Dev"
    url: "http://example.local"
```

Ob die Einstellungen korrekt sind, läßt sich leicht testen:

```bash
hexo config url
#http://example.com
```

Per Parameter läßt sich das jeweilige Staging aktivieren und dann sollten auch die Einstellungen ensprechen überschrieben sein.

```bash
hexo config url --staging development
#http://example.local
```

Folgende Hexo Befehle akzeptieren ein Staging per Parameter

```bash
hexo config
hexo deploy
hexo generate
hexo server
```

## Conditional Tag

Außer den stagebaren Einstellungen bringt das Plugin noch ein neues Conditional Tag für die Templates mit:

```ejs
<% if (true === is_staging("development")){ %>
    <%- css('style.css') %>
<% } else { %>        
    <%- css('style.min.css') %>
<% } %>
```