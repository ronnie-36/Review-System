import anchor, { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import fs from "fs";
import "dotenv/config";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const idl = JSON.parse(
  fs.readFileSync(__dirname + "/idl.json", "utf8")
);
const programId = new PublicKey(process.env.SOLANA_PROGRAM_ID);

export const getProvider = async () => {
  /* create the provider and return it to the caller */
  /* network set to local network for now */
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  return provider;
};

export const getProgram = async () => {
  const provider = await getProvider();
  const program = new Program(idl, programId, provider);
  return program;
};

export const provider = await getProvider();
export const program = await getProgram();
