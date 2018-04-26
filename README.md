# Zelos

> ☄️ A batteries included static site generator for Node.js

__Table of contents__

- [Install](#install)
- [CLI](#cli)
- [Usage](#usage)
  - [Configuration](#configuration)
  - [Variables](#variables)
  - [Pages](#pages)
  - [Layouts](#layouts)
  - [Asset pipeline](#asset-pipeline)
  - [Static data](#static-data)
- [Motivation](#motivation)
- [License](#license)

## Install

Either install as global package or dependency of your project.

```bash
npm install -g zelos
# or
npm install -D zelos
```

## CLI

### build

Starts the build process creating production ready files in the `public` folder.

```bash
zelos build [options]
```

#### --drafts

Pages with `draft: true` will not be built by default. To build drafts add this option.

### serve

Starts a local webserver serving the content from the public directory. Don't use this for production!

```bash
zelos serve
```

### new

Bootstraps a new project in the given path or current directory if no path is specified. Creates necessary folders, config and default layouts.

```bash
zelos new [path] [options]
```

#### --url

As it's advised to set an [siteUrl](#defaults) you can directly set the siteUrl during initialization. The value gets written to the `config.json`.

## Usage

### Configuration

There are three places Zelos is looking for configuration options. First of all Zelos extracts information from the `package.json` file if present. The following fields are mapped to Zelos config options:

```
homepage => siteUrl
author => (parsed) author
description => description
name => siteName
```

Additionally the whole zelos config can be placed in the `package.json` using `zelosConfig` as field name.

Finally Zelos is looking for a `config.json` file to extract configuration options from. The priority is as follows (low to high):

```
package.json > zelosConfig > config.json > CLI
```

There are some options such as `drafts` which can be set via CLI. Those have the highest priority and overwrite corresponding options listed in any of the places above.

#### Defaults

By default you don't have to set any options except `siteUrl`. The `siteUrl` is needed to generate a valid sitemap and RSS feed as well as permalinks.

All options have sensible defaults to generate a solid static website but can be adjusted as needed.

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

### Variables

### Pages

### Layouts

Every site requires an `_base.html` layout. This file should contain the base html structure (head, body etc.) and is used for every page. This layout can be adjusted as needed. All [site and page variables](#variables) are available.

Additionally you can create your own layouts. To reference a layout add `layout: NAME` to the frontmatter of each page which should use your layout. By default every page uses the `default.html` layout. This can be changed in the configuration. To explicitly not use a layout add `layout: null` the the corresponding pages frontmatter. The `_base.html` will always be applied.

Every layout should contain the `{{{content}}}` handlebars expression. This will be replaced with the page content (or layout in case of `_base.html`).


### Asset pipeline

Zelos has a simple builtin asset pipeline. Any files in `assets/css/` and `assets/js/` will be processed automatically.

### Static data

All files in the `static` folder will be copied to the `public` folder without further processing. Use this for static files such as favicons, images and other data needed in production.

## Motivation

There are a lot of awesome generators out there such as [Gatsby](https://gatsbyjs.org), [Hugo](http://gohugo.io), [Hexo](https://hexo.io) and many more. You might ask why another static site generator.

..
This package aims for a zero config experience to quickly create static websites. In contrast to the bundler ecosystem (Webpack, Parcel, et al.) most static site generators written for Node.js are heading to a plugin based architecture. This makes them very flexible but require some decent amount of time to configure in the first place.

## License

[MIT](https://github.com/lgraubner/zelos/blob/master/LICENSE) © [Lars Graubner](https://larsgraubner.com)
