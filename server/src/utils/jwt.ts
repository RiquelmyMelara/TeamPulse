import jwt from 'jsonwebtoken';
import { getJwtSecret } from './awsSecrets';

const JWT_EXPIRES_IN = '2h';

export const signToken = async (payload: object): Promise<string> => {
    const secret = await getJwtSecret();
    return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = async (token: string): Promise<any> => {
    const secret = await getJwtSecret();
    return jwt.verify(token, secret);
};