import Redis from 'ioredis';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

let redis: Redis;

export const initRedis = async (): Promise<Redis> => {
    if (redis) return redis;

    const secrets = new SecretsManagerClient({ region: 'us-east-1' });

    const response = await secrets.send(
        new GetSecretValueCommand({
            SecretId: 'teampulse/redis-credentials',
        })
    );

    const secret = JSON.parse(response.SecretString!);

    redis = new Redis({
        host: secret.host,
        port: secret.port,
    });

    return redis;
};