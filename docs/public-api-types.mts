import { analyze, toHtml, type Dossier, type Report } from "../src/index.mjs";
import { createJevClient } from "../src/jev.mjs";
import * as adapters from "../src/adapters.mjs";
const dossier: Dossier = {
  beforeVersion: "CT2026.1.2",
  afterVersion: "CT2027.1.2",
  changes: [
    {
      id: "C1",
      rubric: "S21.G00.30.001",
      beforeDocId: "a",
      afterDocId: "b",
      before:
        "Contrôler le numéro de sécurité sociale sans accepter de numéro temporaire.",
      after: "Le contrôle accepte un numéro de sécurité sociale temporaire.",
    },
  ],
  rules: [
    {
      id: "R1",
      docId: "c",
      rubrics: ["S21.G00.30.001"],
      description:
        "Un numéro de sécurité sociale provisoire passe la validation.",
    },
  ],
  id: "jev-dsn-norme-impact-dev-paraphrase",
  documents: [
    {
      id: "a",
      text: 'dossier.changes.0 : {"id": "C1", "rubric": "S21.G00.30.001", "before": "Contrôler le numéro de sécurité sociale sans accepter de numéro temporaire.", "after": "Le contrôle accepte un numéro de sécurité sociale temporaire."}',
      source: {
        uri: "fixture:a",
        date: "2026-10-04",
        licence: "CC0",
        kind: "synthetique",
      },
    },
    {
      id: "b",
      text: 'dossier.changes.0 : {"id": "C1", "rubric": "S21.G00.30.001", "before": "Contrôler le numéro de sécurité sociale sans accepter de numéro temporaire.", "after": "Le contrôle accepte un numéro de sécurité sociale temporaire."}',
      source: {
        uri: "fixture:b",
        date: "2026-10-04",
        licence: "CC0",
        kind: "synthetique",
      },
    },
    {
      id: "c",
      text: 'dossier.rules.0 : {"id": "R1", "rubrics": ["S21.G00.30.001"], "description": "Un numéro de sécurité sociale provisoire passe la validation."}',
      source: {
        uri: "fixture:c",
        date: "2026-10-04",
        licence: "CC0",
        kind: "synthetique",
      },
    },
  ],
};
const report: Report = await analyze(dossier, {
  mode: "jev",
  provider: createJevClient({ apiKey: "exemple-de-type" }),
});
const html: string = toHtml(report);
void html;
void adapters;
// @ts-expect-error Un dossier vide ne respecte pas le contrat métier.
await analyze({ id: "incomplet", documents: [] });
