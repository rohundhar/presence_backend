import { Path, POST } from 'typescript-rest';
import User from '../models/User';
import { seed_data } from '../scripts/seed';

interface RegisterRequest {
  userId: string;
  name: string;
  email?: string;
}

@Path('/users')
export class UserController {

  @POST
  @Path('/register')
  async registerUser(body: RegisterRequest) {
    console.log("registerUser called with body:", body);
    // Atomic Upsert: Create user if missing, update name if exists
    const user = await User.findOneAndUpdate(
      { userId: body.userId },
      { 
        name: body.name,
        email: body.email || "placeholder@example.com",
        // We use $setOnInsert to set createdAt only on creation
        $setOnInsert: { teams: [] } 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    seed_data(body.userId);
    
    return user;
  }
}

