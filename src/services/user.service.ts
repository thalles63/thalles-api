import { User } from "../models/user.model";

let users: User[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
];

export const getAll = (): User[] => {
    return users;
};

export const getById = (id: number): User => {
    const user = users.find((u) => u.id === id);

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    return user;
};

export const create = (user: Omit<User, "id">): User => {
    const newUser: User = {
        id: users.length + 1,
        ...user
    };

    users.push(newUser);
    return newUser;
};
