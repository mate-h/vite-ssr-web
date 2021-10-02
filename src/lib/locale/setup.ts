import { CLDRFramework, CLDROptions } from "@phensley/cldr";

// Import the resource file containing information about the resource packs
import Resource from "@phensley/cldr/packs/resource.json";

// SSR parameter for language prerendering static load

// Import default language directly so it's always available
import EnglishPack from "@phensley/cldr/packs/en.json";
import CzechPack from "@phensley/cldr/packs/cs.json";
import { format, formatter } from "./format";

const start = +new Date();

// Copy the sha256 hash of all of the packages, to use for cache busting.
// Note: Resource files are be copied by the build process with the
// matching version in the path.
const version = Resource.sha256.substring(0, 10);

// Load English synchronously (see below)
const loader = (language: string): any => {
  if (language === "en") {
    return EnglishPack;
  }
  if (language === "cs") {
    return CzechPack;
  }
}

// All other languages are loaded asynchronously at runtime
const asyncLoader = (language: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    if (language === "en") {
      resolve(EnglishPack);
      return;
    }
    if (language === "cs") {
      resolve(CzechPack);
      return;
    }
    fetch(
      `https://storage.googleapis.com/controlme-dev.appspot.com/packs/${language}.json`
    )
      .then((r) => r.json())
      .then(resolve)
      .catch(reject);
  });
};

const options: CLDROptions = {
  // Sync blocking loader function
  loader,

  // Promise-based loader function
  asyncLoader,

  // Keep up to 8 languages loaded at a time.
  packCacheSize: 8,

  // Patterns are parsed and cached on demand. This will keep up to
  // 50 patterns in cache with least-recently-used eviction.
  patternCacheSize: 50,

  // Our build process ensures we only load resource packs whose hash
  // matches. Skip calculating the schema checksum.
  skipChecksum: true,
};

// Global instance of cldr configured for our app
export const framework = new CLDRFramework(options);

// Every resource pack includes the version of the cldr it was built from
export const cldrVersion = EnglishPack.cldr;

// Default cldr engine to be set in the locale store.
export const English = framework.get("en");

const elapsed = +new Date() - start;
// console.warn(`cldr static init: ${elapsed} ms`);
