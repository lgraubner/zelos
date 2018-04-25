# Zelos

> ☄️ A batteries included static site generator for Node.js

## Table of contents

- [Install](#install)
- [Usage](#usage)
- [Configuration](#configuration)
- [Motivation](#motivation)
- [License](#license)

## Install

Either install as global package or dependency of your project.

```bash
npm install -g zelos
# or
npm install -D zelos
```

## Usage

### build

#### --drafts

Pages with `draft: true` will be not built by default. To build drafts add this option.

```bash
zelos build --drafts
```

### serve

Starts a local webserver serving the content from the public directory.

```bash
zelos serve
```

### new

## Configuration

```json
{
  "assetDir": "assets",
  "contentDir": "content",
  "defaultLayout": "default",
  "defaultPageType": "page",
  "drafts": false,
  "language": "en",
  "layoutDir": "layouts",
  "minify": true,
  "publicDir": "public",
  "rss": true,
  "rssFilename": "feed.xml",
  "rssRegex": "\.md$",
  "serviceWorker": true,
  "sitemap": true,
  "staticDir": "static"
}
```

## Motivation

There are a lot of awesome generators out there such as [Gatsby](https://gatsbyjs.org), [Hugo](http://gohugo.io), [Hexo](https://hexo.io) and many more. You might ask why another static site generator.

..
This package aims for a zero config experience to quickly create static websites. In contrast to the bundler ecosystem (Webpack, Parcel, et al.) most static site generators written for Node.js are heading to a plugin based architecture. This makes them very flexible but require some decent amount of time to configure in the first place.

## License

[MIT](https://github.com/lgraubner/zelos/blob/master/LICENSE) © [Lars Graubner](https://larsgraubner.com)
