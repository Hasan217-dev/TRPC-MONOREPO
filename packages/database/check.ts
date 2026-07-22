import { db } from "./index";
import { formFieldsTable } from "./models/form-field";
import { eq } from "drizzle-orm";

async function main() {
  const rows = await db
    .select({ id: formFieldsTable.id, label: formFieldsTable.label, index: formFieldsTable.index })
    .from(formFieldsTable)
    .where(eq(formFieldsTable.formId, "6838fbfd-5080-4eb2-bc7a-8bfbc478931a"));

  console.log(rows);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});