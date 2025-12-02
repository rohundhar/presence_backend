import UserScreenTime from '../models/UserScreenTime';
import UserRecommendation from '../models/UserRecommendation';

export class ScreenTimeService {
  
  // Sync Data coming from iOS
  static async syncUsage(userId: string, bucketId: string, minutesDelta: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Atomic Upsert: Increment minutes, or create doc if missing
    return await UserScreenTime.updateOne(
      { userId, date: today, bucketId },
      { 
        $inc: { minutesSpent: minutesDelta },
        $set: { lastSyncedAt: new Date() }
      },
      { upsert: true }
    );
  }

  // Get Personal Dashboard (Rules + Server's view of usage)
  static async getPersonalDashboard(userId: string) {
    console.log("Fetching personal dashboard for userId:", userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const config = await UserRecommendation.findOne({ userId });
    if (!config) return null;

    const usageDocs = await UserScreenTime.find({ userId, date: today });

    // Map rules to usage for the response
    const dashboardBuckets = config.monitoredBuckets.map(bucket => {
      const usage = usageDocs.find(u => u.bucketId === bucket.bucketId);
      return {
        bucketId: bucket.bucketId,
        displayName: bucket.displayName,
        limit: bucket.limit,
        warningLimit: bucket.warningLimit,
        serverLastSyncedUsage: usage ? usage.minutesSpent : 0,
        lastSyncedAt: usage ? usage.lastSyncedAt : null
      };
    });

    return {
      date: today,
      buckets: dashboardBuckets
    };
  }
}