title: hexo-staging
date: 2016-02-03 20:57:21
teaser: |+
    bar **bold** foo
    
    bar **bold** foo
tags:
---

Das reine Rumprobieren mit Hexo und der Doku hat mich schon relativ weit gebracht .

Grundsätzlich hat Hexo zwei verschiedene Modi:
        
* [hexo generate](https://hexo.io/docs/generating.html) läuft alle Routen durch, rendert die dazugehörigen Seiten und speichert sie als statische Files auf die Platte. Die generierten Dateien laden bei mir Produktivsystem und werden von einem Nginx ausgeliefert.
* [hexo server](https://hexo.io/docs/server.html) startet einen Server und rendert dynamisch die angefragte Seite. Den Server nutze ich lokal zum Entwickeln.

Die zwei Sachen getrennt zu haben ist schon praktisch, aber mir fehlte noch ein Staging mit dem ich zwischen **Development** und **Production** unterscheiden kann.
Daher hab ich mein erstes Hexo Plugin geschrieben, dass Hexo im einfaches Staging unterstützt. 

## Installation

Zur Installation einfach nur per **npm** installieren.
  
```bash
cd /root/of/your/hexo/project

npm install hexo-staging
```

## Staging in der _config.yml

In der Config fügt mal einen neues **Stagings** ein; darin pro Staging die Einstellungen, die für das Staging geändert werden sollen.
Der Staging Name ist überigens egal; ich benutze aus Gewohnheit **production** und **development**.  

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

