import redis from "redis";

const redisClient = redis.createClient({
  url: "redis://default:IvwawZs2tr2SOkfBIkx9FLXVlypxCrwD@redis-15103.c73.us-east-1-2.ec2.redns.redis-cloud.com:15103", 
});

redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});

export default redisClient;
