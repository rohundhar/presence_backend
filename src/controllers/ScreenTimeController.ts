import { Path, POST, GET, PathParam } from 'typescript-rest';
import { ScreenTimeService } from '../services/ScreenTimeService';

interface SyncRequest {
  userId: string;
  bucketId: string;
  minutesDelta: number;
}

@Path('/screentime')
export class ScreenTimeController {

  @POST
  @Path('/sync')
  async syncUsage(body: SyncRequest) {
    await ScreenTimeService.syncUsage(body.userId, body.bucketId, body.minutesDelta);
    return { success: true };
  }

  @GET
  @Path('/personal/:userId')
  async getPersonalDashboard(@PathParam('userId') userId: string) {
    return await ScreenTimeService.getPersonalDashboard(userId);
  }
}