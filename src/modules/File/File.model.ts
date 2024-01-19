interface File{
    id?: number;
    name: string;
    path: string;
    size: number;
    sizeUnit: string;
    type: string;
    directory: number;
    owner: number;
    createdAt?: Date;
    modifiedAt?: Date;
    accessedAt?: Date;
}

export default File;