import Tenant from "../models/tenant.model.js";

// to upgrade the plan(only for admin)
export const upgradeTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    console.log("tenantId: ", tenantId);
    // check role
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can upgrade plans" });
    }

    // update tenant to Pro using the ID
    const tenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { plan: "Pro" },
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    res.status(200).json({
      message: `Tenant upgraded to Pro`,
      tenant,
    });
  } catch (err) {
    console.error("Error upgrading tenant:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
