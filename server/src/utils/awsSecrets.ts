import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import dotenv from 'dotenv';
dotenv.config();
let cachedJwtSecret: string | null = null;

const client = new SecretsManagerClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const getDbConnectionUrl = async (): Promise<string> => {
    const command = new GetSecretValueCommand({
        SecretId: 'teampulse/db-credentials',
    });

    const response = await client.send(command);
    if (!response.SecretString) throw new Error("Secret string is empty");

    const { username, password, host, port, dbname } = JSON.parse(response.SecretString);
    return `postgresql://${username}:${password}@${host}:${port}/${dbname}?schema=public`;
};

export const getJwtSecret = async (): Promise<string> => {
    if (cachedJwtSecret) return cachedJwtSecret;

    const command = new GetSecretValueCommand({
        SecretId: 'teampulse/jwt-secret',
    });

    const response = await client.send(command);
    if (!response.SecretString) throw new Error("JWT Secret not found");

    const secretObj = JSON.parse(response.SecretString);
    cachedJwtSecret = secretObj.JWT_SECRET;
    return cachedJwtSecret;
};
