interface User{
    id:number;
    name: string;
    username?: string;
    password?: string;
    role: string;
    unit_id?: number;
    dir_id?: number;
    unit_type?: boolean;
}

export default User;