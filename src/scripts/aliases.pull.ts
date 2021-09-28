import fs from "fs";
import https from "https";

export type TerritoryEntries = Record<string, string[]>;

export type AliasEntries = Record<
  string,
  {
    _reason: "macrolanguage" | "bibliographic" | "overlong" | "deprecated";
    _replacement: string; // can be separated by space
  }
>;

export type AliasType = {
  supplemental: {
    version: {
      /** Unicode Version 13.0.0 */
      _unicodeVersion: string;
      /** CLDR Version 39 */
      _cldrVersion: string;
    };
    metadata: {
      alias: {
        languageAlias: AliasEntries;
        scriptAlias: AliasEntries;
        territoryAlias: AliasEntries;
      };
    };
  };
};

/** Link to CLDR data */
const downloadUrl =
  "https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-core/supplemental/aliases.json";

async function main() {
  const result = await new Promise<AliasType>((resolve, reject) => {
    https.get(downloadUrl, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Unexpected status code: ${res.statusCode}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const data = Buffer.concat(chunks);
        resolve(JSON.parse(data.toString()));
      });
    });
  });
  // only interested in terrory aliases for TLD resolution
  const territoryAlias = result.supplemental.metadata.alias.territoryAlias;
  const tldAlias = Object.keys(territoryAlias).reduce((acc, key) => {
    const value = territoryAlias[key];
    if (value._replacement.includes(" ")) {
      const s = value._replacement as string;
      // multiple regions
      acc[key] = s.split(" ");
    } else {
      // single region
      acc[key] = [value._replacement];
    }
    return acc;
  }, {} as TerritoryEntries);
  // write to file
  const output = JSON.stringify(tldAlias, null, 2);
  const tsSource = `import { TerritoryEntries } from "../scripts/aliases.pull";
export const territoryAlias: TerritoryEntries = ${output};`;
  fs.writeFileSync("./src/gen/alias.ts", tsSource);
}

// if running in ts-node
if (require.main === module) {
  main();
}
