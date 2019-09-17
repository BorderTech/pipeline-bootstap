export class Actor {
  id: number;
  displayName: string;
  type: string;
  name: string;
}

export class AddActorsJiraProjectResponseDto {
  self: string;
  name: string;
  id: number;
  description: string;
  actors: Actor[];
}
