import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      enum: ["Free", "Pro"],
      default: "Free",
    },
  },
  { timestamps: true }
);

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;
