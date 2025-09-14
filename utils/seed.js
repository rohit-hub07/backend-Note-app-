import dotenv from "dotenv";
import Tenant from "../models/tenant.model.js";
import { dbConnection } from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedTenants = async () => {
  try {
    await dbConnection();

    const tenants = [
      { slug: "acme", plan: "Free" },
      { slug: "globex", plan: "Free" },
    ];

    await Tenant.insertMany(tenants);

    console.log("Tenants inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error inserting tenants:", error.message);
    process.exit(1);
  }
};

seedTenants();
