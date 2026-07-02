"use server";

import { Pool } from "pg";
const pool = new Pool();

export default async function queryDb(query: string) {
  try {
    const res = await pool.query(query);
    console.log(res);
  } catch (err) {
    console.error(err);
  }
}
