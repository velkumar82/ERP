const cron = require("node-cron");
const User = require("../models/User");

/*
  Runs on 1st of every month
  Example:
  Dec 2026 → +1 CL
  Jan 2027 → +1 CL
*/
cron.schedule("0 0 1 * *", async () => {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const users = await User.find();

  for (let u of users) {
    if (u.lastCLUpdatedMonth !== currentMonth) {
      u.clBalance = Math.min((u.clBalance || 0) + 1, 12);
      u.lastCLUpdatedMonth = currentMonth;
      await u.save();
    }
  }

  console.log("✅ Monthly CL credited");
});
