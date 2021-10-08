#!/usr/bin/env bash

PKG_URL="https://cdn.jsdelivr.net/npm/yaclt@latest/package.json"
PKG_VERSION=$(curl -s $PKG_URL | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | xargs)
echo -e "---\nsidebar_position: 2\ntitle: Commands\n---\n" >docs/yaclt/commands.md
curl -s "https://raw.githubusercontent.com/yaclt/yaclt/$PKG_VERSION/docs/COMMANDS.md" >>docs/yaclt/commands.md
echo -e "---\nsidebar_position: 3\n---\n" >docs/yaclt/handlebars-templates.md
curl -s "https://raw.githubusercontent.com/yaclt/yaclt/$PKG_VERSION/docs/handlebars-templates.md" >>docs/yaclt/handlebars-templates.md
curl -s "https://raw.githubusercontent.com/yaclt/yaclt.nvim/master/README.md" >>docs/yaclt.nvim/intro.md
