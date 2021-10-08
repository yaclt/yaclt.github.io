# yaclt.nvim

A Neovim plugin for [Yaclt](https://github.com/yaclt/yaclt).

## Installation

### Packer

```lua
use {'yaclt/yaclt.nvim', requires = 'nvim-lua/plenary.nvim'}
```

### Vim Plug

```VimL
Plug 'nvim-lua/plenary.nvim'
Plug 'yaclt/yaclt.nvim'
```

## Configuration

Configure the plugin by using the setup function. Not required if you want to use a globally installed
`yaclt` without default arguments.

Defaults:

```lua
require('yaclt').setup({
  cmd = 'yaclt', -- can also change this to ./node_modules/.bin/yaclt to use a version from package.json
  args = {}, -- you can specify default args here that will be passed to yaclt, e.g. { '--changeType', 'NEW' }
})
```

## API

For `yaclt` command arguments and documentation, see [Yaclt docs](https://github.com/yaclt/yaclt/blob/master/docs/COMMANDS.md).

### Lua

```lua
require('yaclt').new(args) -- e.g. require('yaclt').new({ '--changeType', 'NEW', '-m', 'Message here' })

require('yaclt').validate(args)

require('yaclt').prepareRelease(args) -- e.g. require('yaclt').prepareRelease({ '--releaseNumber', '0.5.0' })
```

### Nvim Command

There is a single editor command, `Yaclt`, that has the same interface as the CLI. For example:

```VimL
:Yaclt new --changeType NEW -m "Description of some new change"

:Yaclt validate

:Yaclt prepare-release --releaseNumber 1.2.3
```
# yaclt.nvim

A Neovim plugin for [Yaclt](https://github.com/yaclt/yaclt).

## Installation

### Packer

```lua
use {'yaclt/yaclt.nvim', requires = 'nvim-lua/plenary.nvim'}
```

### Vim Plug

```VimL
Plug 'nvim-lua/plenary.nvim'
Plug 'yaclt/yaclt.nvim'
```

## Configuration

Configure the plugin by using the setup function. Not required if you want to use a globally installed
`yaclt` without default arguments.

Defaults:

```lua
require('yaclt').setup({
  cmd = 'yaclt', -- can also change this to ./node_modules/.bin/yaclt to use a version from package.json
  args = {}, -- you can specify default args here that will be passed to yaclt, e.g. { '--changeType', 'NEW' }
})
```

## API

For `yaclt` command arguments and documentation, see [Yaclt docs](https://github.com/yaclt/yaclt/blob/master/docs/COMMANDS.md).

### Lua

```lua
require('yaclt').new(args) -- e.g. require('yaclt').new({ '--changeType', 'NEW', '-m', 'Message here' })

require('yaclt').validate(args)

require('yaclt').prepareRelease(args) -- e.g. require('yaclt').prepareRelease({ '--releaseNumber', '0.5.0' })
```

### Nvim Command

There is a single editor command, `Yaclt`, that has the same interface as the CLI. For example:

```VimL
:Yaclt new --changeType NEW -m "Description of some new change"

:Yaclt validate

:Yaclt prepare-release --releaseNumber 1.2.3
```
# yaclt.nvim

A Neovim plugin for [Yaclt](https://github.com/yaclt/yaclt).

## Installation

### Packer

```lua
use {'yaclt/yaclt.nvim', requires = 'nvim-lua/plenary.nvim'}
```

### Vim Plug

```VimL
Plug 'nvim-lua/plenary.nvim'
Plug 'yaclt/yaclt.nvim'
```

## Configuration

Configure the plugin by using the setup function. Not required if you want to use a globally installed
`yaclt` without default arguments.

Defaults:

```lua
require('yaclt').setup({
  cmd = 'yaclt', -- can also change this to ./node_modules/.bin/yaclt to use a version from package.json
  args = {}, -- you can specify default args here that will be passed to yaclt, e.g. { '--changeType', 'NEW' }
})
```

## API

For `yaclt` command arguments and documentation, see [Yaclt docs](https://github.com/yaclt/yaclt/blob/master/docs/COMMANDS.md).

### Lua

```lua
require('yaclt').new(args) -- e.g. require('yaclt').new({ '--changeType', 'NEW', '-m', 'Message here' })

require('yaclt').validate(args)

require('yaclt').prepareRelease(args) -- e.g. require('yaclt').prepareRelease({ '--releaseNumber', '0.5.0' })
```

### Nvim Command

There is a single editor command, `Yaclt`, that has the same interface as the CLI. For example:

```VimL
:Yaclt new --changeType NEW -m "Description of some new change"

:Yaclt validate

:Yaclt prepare-release --releaseNumber 1.2.3
```
