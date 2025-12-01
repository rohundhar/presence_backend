import { Path, POST, GET, PathParam } from 'typescript-rest';
import { TeamService } from '../services/TeamService';

// Define interfaces for payload type safety
interface CreateTeamRequest {
  userId: string;
  name: string;
}

interface JoinTeamRequest {
  userId: string;
  entryCode: string;
}

@Path('/teams')
export class TeamController {

  @Path('/create')
  @POST
  // No decorator needed for 'body'. It is inferred automatically.
  async createTeam(body: CreateTeamRequest) {
    return await TeamService.createTeam(body.userId, body.name);
  }

  @Path('/join')
  @POST
  async joinTeam(body: JoinTeamRequest) {
    return await TeamService.joinTeam(body.userId, body.entryCode);
  }
  
  @Path('/dashboard/:userId')
  @GET
  async getDashboard(@PathParam('userId') userId: string) {
    return await TeamService.getTeamDashboard(userId);
  }
}