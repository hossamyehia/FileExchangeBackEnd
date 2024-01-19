interface Directory{
    id?: number;
    name: string;
    path: string;
    size: number;
    sizeUnit: string;
    parent: number;
    owner: number;
    createdAt?: Date;
    modifiedAt?: Date;
    accessedAt?: Date;
}

export default Directory;