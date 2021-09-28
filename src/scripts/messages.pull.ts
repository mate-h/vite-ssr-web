import https from "https";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// configure env
const token = process.env.AIRTABLE_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;
const outDir = "./src/gen/messages";
const headers = {
  Authorization: `Bearer ${token}`,
};

const langMap = {
  en: "English",
  es: "Spanish",
  ru: "Russian",
  // add more languages here based on AirTable view names
};

type TranslationRecords = {
  offset: string;
  records: {
    fields: {
      Name: string;
      Text: string;
    };
  }[];
};

async function getTranslations({
  url,
  headers,
}: {
  url: string;
  headers: any;
}): Promise<TranslationRecords> {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers }, (response) => {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        resolve(JSON.parse(body));
      });
    });
    request.on("error", (error) => {
      reject(error);
    });
  });
}

// get language from script parameters
const lang = process.argv[2];
async function main() {
  let langs = Object.keys(langMap);
  if (lang !== undefined) {
    if (langs.includes(lang)) {
      // @ts-ignore
      console.log(langMap[lang]);
    } else {
      console.log("Invalid language");
    }
    langs = [lang];
  }
  langs.forEach(async (lang) => {
    const acc = [];
    let offset = "";
    while (offset !== undefined) {
      // @ts-ignore
      const viewName = langMap[lang];
      let url = `https://api.airtable.com/v0/${baseId}/Translations?pageSize=100&view=${viewName}`;
      if (offset !== "")
        url = `https://api.airtable.com/v0/${baseId}/Translations?pageSize=100&view=${viewName}&offset=${offset}`;
      console.log("GET ", url);
      const translations = await getTranslations({ url, headers });
      const result = translations.records.map((translation) => {
        return [translation.fields.Name, translation.fields.Text.trim()];
      });
      offset = translations.offset;
      acc.push(...result);
    }
    fs.writeFileSync(
      `${outDir}/${lang}.ts`,
      `export default ${JSON.stringify(Object.fromEntries(acc), null, 2)};`
    );
    console.log("Output: ", `${outDir}/${lang}.ts`);
  });
}
main();
