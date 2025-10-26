interface User{
    id: string;
    email: string;
    createdAt: Date;
}

interface UserCredentials{
    email: string;
    password: string;
}

export type { User, UserCredentials };