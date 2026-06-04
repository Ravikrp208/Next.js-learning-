console.log("Welcome to TypeScript Learning - Day 1!");

// Simple TypeScript interface and implementation
interface User {
  id: number;
  name: string;
  role: string;
}

const user: User = {
  id: 1,
  name: "Learner",
  role: "Student"
};

console.log(`Hello, ${user.name}! Your ID is ${user.id} and your role is ${user.role}.`);
