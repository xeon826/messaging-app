
// Sample data for the table
const users = [
  {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'janesmith',
    email: 'jane.smith@example.com',
  },
  {
    firstName: 'Robert',
    lastName: 'Johnson',
    username: 'rjohnson',
    email: 'robert.j@example.com',
  },
  {
    firstName: 'Emily',
    lastName: 'Brown',
    username: 'emilybr',
    email: 'emily.brown@example.com',
  },
];


import { ContactEmail } from "~/types/ContactEmail";
import { Resend } from "resend";
import { H3Event } from "h3";


export default defineEventHandler(async (event: H3Event) => {
  return users;
});
