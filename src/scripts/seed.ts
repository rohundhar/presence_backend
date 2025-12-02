import mongoose from 'mongoose';
import User from '../models/User';
import Team from '../models/Team';
import UserRecommendation from '../models/UserRecommendation';
import UserScreenTime from '../models/UserScreenTime';
import { connectDB } from '../config/database';

// Configuration for the Fake Data
const TARGET_TEAM_CODE = "ABC123";

export const seed_data = async (targetUserId: string) => {
//   await connectDB();

  console.log("🌱 Starting Seed...");

  // 1. Create/Update the User
  const user = await User.findOneAndUpdate(
    { userId: targetUserId },
    { email: "test@presence.app" },
    { upsert: true, new: true }
  );
  console.log(`✅ User setup: ${user.name}`);

  // 2. Create/Update a Team
  
  const team = await Team.findOneAndUpdate(
    { entryCode: TARGET_TEAM_CODE },
    { 
      // Only set these if the team is being created for the first time
      $setOnInsert: { 
        name: "Simulator Squad", 
        createdBy: targetUserId 
      },
      // Atomically add the user to the list if not already there
      $addToSet: { members: targetUserId } 
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  // Link team to user
  await User.updateOne({ userId: targetUserId }, { $addToSet: { teams: team._id } });
  console.log(`✅ Team setup: ${team.name}`);

  // 3. Create Recommendations (The Rules)
  // We use a dummy base64 string for the token since the backend doesn't decode it anyway.
  const dummyToken = Buffer.from("simulator_token").toString('base64');
  
  await UserRecommendation.findOneAndUpdate(
    { userId: targetUserId },
    {
      monitoredBuckets: [
        {
          bucketId: "social_bucket",
          displayName: "Social Media",
          appleSelectionToken: dummyToken,
          limit: 60,
          warningLimit: 45,
          isBlockingEnabled: true
        },
        {
          bucketId: "games_bucket",
          displayName: "Games",
          appleSelectionToken: dummyToken,
          limit: 30,
          warningLimit: 20,
          isBlockingEnabled: true
        }
      ]
    },
    { upsert: true }
  );
  console.log("✅ Recommendations setup");

  // 4. Create Usage Data (The Progress)
  // We inject data for TODAY so it shows up in the dashboard immediately.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Social: 50 minutes (Warning Zone)
  await UserScreenTime.findOneAndUpdate(
    { userId: targetUserId, date: today, bucketId: "social_bucket" },
    { minutesSpent: 50, lastSyncedAt: new Date() },
    { upsert: true }
  );

  // Games: 10 minutes (Clean Zone) or 70 minutes (Over Limit) - Randomized for testing
  await UserScreenTime.findOneAndUpdate(
    { userId: targetUserId, date: today, bucketId: "games_bucket" },
    { minutesSpent: Math.random() < .5 ? 10 : 70, lastSyncedAt: new Date() },
    { upsert: true }
  );

  console.log("✅ Screen Time Usage injected for TODAY");
  console.log("------------------------------------------------");
  console.log("📲 RELOAD YOUR IOS SIMULATOR DASHBOARD NOW");
  console.log("------------------------------------------------");

//   process.exit(0);
};