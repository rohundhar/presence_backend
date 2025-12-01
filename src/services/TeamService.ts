import Team, { ITeam } from '../models/Team';
import User from '../models/User';
import UserScreenTime from '../models/UserScreenTime';
import UserRecommendation from '../models/UserRecommendation';

export class TeamService {
  
  // Create a new team
  static async createTeam(userId: string, name: string): Promise<ITeam> {
    // Generate simple 6-char code
    const entryCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newTeam = await Team.create({
      name,
      entryCode,
      createdBy: userId,
      members: [userId]
    });

    // Update User's team list
    await User.findOneAndUpdate({ userId }, { $push: { teams: newTeam._id } });

    return newTeam;
  }

  // Join existing team
  static async joinTeam(userId: string, entryCode: string): Promise<ITeam> {
    const team = await Team.findOne({ entryCode });
    if (!team) throw new Error('Team not found');

    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
      await User.findOneAndUpdate({ userId }, { $push: { teams: team._id } });
    }
    return team;
  }

  // Complex Aggregation: Get Dashboard for all teams
  static async getTeamDashboard(userId: string) {
    const user = await User.findOne({ userId });
    if (!user || !user.teams) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Fetch all teams the user belongs to
    const teams = await Team.find({ _id: { $in: user.teams } });

    // 2. Build the feed
    const feed = await Promise.all(teams.map(async (team) => {
      
      // For each member in the team
      const memberProgress = await Promise.all(team.members.map(async (memberId) => {
        const memberInfo = await User.findOne({ userId: memberId });
        
        // Get their Rules
        const config = await UserRecommendation.findOne({ userId: memberId });
        
        // Get their Usage (Flat Query)
        const usageDocs = await UserScreenTime.find({ 
          userId: memberId, 
          date: today 
        });

        // Calculate Status
        const bucketStatuses: any = {};
        
        if (config && config.monitoredBuckets) {
          config.monitoredBuckets.forEach(bucket => {
            const usageDoc = usageDocs.find(u => u.bucketId === bucket.bucketId);
            const minutes = usageDoc ? usageDoc.minutesSpent : 0;
            
            let status = 'clean';
            if (minutes >= bucket.limit) status = 'limit_reached';
            else if (minutes >= bucket.warningLimit) status = 'warning';

            bucketStatuses[bucket.bucketId] = {
              status,
              percentage: Math.min(minutes / bucket.limit, 1.0)
            };
          });
        }

        return {
          userId: memberId,
          name: memberInfo?.name || 'Unknown',
          buckets: bucketStatuses
        };
      }));

      return {
        teamId: team._id,
        teamName: team.name,
        members: memberProgress
      };
    }));

    return feed;
  }
}