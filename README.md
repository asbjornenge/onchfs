This directory holds all the packages related to the Onchain File System

```
packages – all the packages for interacting with the onchfs
```

# Package API

As we are aiming for long-term adoption of the ONCHFS, we are looking at building a cohesive programming API for the official packages.

There are 3 different approaches:

## Exporting nested objects for grouping similar APIs

Rational: we can granuarly define how we nest the different properties of the API to guide users in their usage (hierarchy defines level of abstractions).

```ts
import ONCHFS from "onchfs"

// preparing a file
const file = ONCHFS.files.prepareFile(...)

// preparing a directory
const dir = ONCHFS.files.prepareDirectory(...)

// generate the inscriptions from a directory
const inscriptions = ONCHFS.files.generateInscriptions(...)

// create a proxy-resolver
const resolver = ONCHFS.proxy.createResolver(...)

// resolve an URI
const components = ONCHFS.uri.parse(...)
const components = ONCHFS.uri.resolve(...)

// UNCOMMON OPERATIONS

// chunk bytes
const chunks = ONCHFS.files.utils.chunkBytes(...)

// encode/decode some metadata
const encoded = ONCHFS.files.utils.metadata.encode(...)
const decoded = ONCHFS.files.utils.metadata.decode(...)

```

Alternatively, we can use a similar approach and yet provide a way to import 1 level deep:

```ts
// gives access to the same API as above
import * as ONCHFS from "onchfs"

// possibility to import 1-deep nested APIs
import { files, uri, proxy } from "onchfs"

// ex

// preparing a file
const file = files.prepareFile(...)

// preparing a directory
const dir = files.prepareDirectory(...)

// generate the inscriptions from a directory
const inscriptions = files.generateInscriptions(...)

// create a proxy-resolver
const resolver = proxy.createResolver(...)

// resolve an URI
const components = uri.parse(...)
const components = uri.resolve(...)

// UNCOMMON OPERATIONS

// chunk bytes
const chunks = files.utils.chunkBytes(...)

// encode/decode some metadata
const encoded = files.utils.metadata.encode(...)
const decoded = files.utils.metadata.decode(...)

```

Pros:

- we have full control over the API exposed
- the file structure doesn't have to reflect the API, usage logic does

Cons:

- uncommon operations are deeply nested, and we don't provide a way to import an atomic operation; the dot notation must be used to access "hidden" features
- on VSCode, with autocomplete, everything shows as a property: it's hard to differenciate regular static properties from methods; _maybe it can be solved with some import/export voodoo, didn't investigate_.
- need to bundle all the package even if we just want the URI resolution

## Exposing everything at the top level

I won't describe more this strategy as I think it's not great for the DX. While a manual can be used to understand the different functions, there's no way developers understand which functions they are supposed to used, resulting in a mess of an API.

## Multi-package architecture

We would divide ONCHFS into smaller packages which themselves give access to a subset of the features in a smaller scope.

```ts
import {
  prepareFile,
  prepareDirectory,
  generateInscriptions,
  metadata,
  utils
} from "@onchfs/files"
// alternatively
import * as ONCHFSFiles from "@onchfs/files"

// preparing a file
const file = prepareFile(...)

// preparing a directory
const dir = prepareDirectory(...)

// generate the inscriptions from a directory
const inscriptions = generateInscriptions(...)

// encode/decode some metadata
const encoded = metadata.encode(...)
const decoded = metadata.decode(...)


import { createProxyResolver } from "@onchfs/proxy"

// create a proxy resolver
const resolver = createProxyResolver(...)


import { parseURI } from "@onchfs/uri"

const components = parseURI(...)

```

Pros

- clean API, it's easier to access the components we need in the app
- type friendly; functions are functions (and not object properties)
- bundle-optimized: consumers can only ship what they need for their app

Cons

- DX a bit tedious sometimes when building a fullstack single app (multiple onchfs packages have to be imported)
- harder to maintain for us: need to engineer finer solution for the deployment of the various modules (_can be mitigated with a strong strategy_)

More ideas ?

# TODOs

## Improving the API of the onchfs package

Consider various use-cases, readility, conciseness, etc..

Maybe divide into 2 APIs, accessible through a single core API ? If needed

- files
- resolver
-

## Publish strategy

- from monorepo
- into different packages

Improvements to the URI

- Before the CID, any number of / is accepted, however the URI should be normalized so that there are no / before the CID
