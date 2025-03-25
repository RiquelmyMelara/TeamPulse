import Redis from 'ioredis';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

let redis: Redis;

export const initRedis = async (): Promise<Redis> => {
    if (redis) return redis;

    // Dev override — use local Redis if this env var is set
    if (process.env.NODE_ENV === 'development' && process.env.REDIS_HOST) {
        redis = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT || 6379),
        });
        return redis;
    }
    // Default: use AWS Secrets Manager to connect to ElasticCache
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
        tls: {},
    });

    return redis;
};