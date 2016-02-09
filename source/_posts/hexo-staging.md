title: hexo-staging
date: 2016-02-03 20:57:21
teaser: |+
    bar **bold** foo
    
    bar **bold** foo
tags:
---

Foo
Das Rumprobieren mit Hexo hat schon Laune gemacht und ich bin mit Bordmitteln schon relativ weit gekommen.

Grundsätzlich hat Hexo zwei verschiedene Modi:
        
* [hexo generate](https://hexo.io/docs/generating.html) läuft alle Routen durch, rendert die dazugehörigen Seiten und speichert sie als HTML-Files auf die Platte. Die generierten Dateien laden bei mir Produktivsystem in einem Nginx.
* [hexo server](https://hexo.io/docs/server.html) startet einen Server und rendert dynamisch die angefragte Seite. Den Server nutze ich lokal zum Entwickeln.

Die zwei Sachen getrennt zu haben ist schon praktisch, aber mir fehlte noch ein Staging mit dem ich zwischen **Development** und **Production** unterscheiden kann.
Daher hab ich mein erstes Hexo Plugin geschireben.

```bash
hexo generate
```



```bash
hexo server
```

dd


Ein Feature, dass das lokale Entwicklen einfach macht, ist der eingebaute Server.
Während Hexo im produktiv Modus *nur* statische Seiten rausrendert, 
stöpselt der Server das Layout und den Inhalt live zusammen und übernimmt die Auslieferung.

## conditional tag

```ejs
<% if (true === is_staging("development")){ %>
    <%- css('style.css') %>
<% } else { %>        
    <%- css('style.min.css') %>
<% } %>
```

