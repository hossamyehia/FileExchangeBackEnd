interface SQLError {
    code: string;
    errno: number;
    sqlState: string;
    sqlMessage: string;
    sql: string;
}

export default SQLError;