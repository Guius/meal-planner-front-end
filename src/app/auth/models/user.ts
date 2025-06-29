export class User {
  first_name: string;
  last_name: string;
  role: string;

  constructor(first_name: string, last_name: string, role: string) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.role = role;
  }
}
