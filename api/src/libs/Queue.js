import Queue from "bull";
import redisConfig from "../RedisConfig";

import * as jobs from "../jobs";

const queues = Object.values(jobs).map((job) => {
    return {
        bull: new Queue(job.key, redisConfig),
        name: job.key,
        handle: job.handle
    }
});

export default {
    queues,
    add(name, data){
        const queue = this.queues.find((queue) => { return (queue.name === name); });
        return queue.bull.add(data);
    },
    process(){
        return this.queues.forEach((queue) => {
            queue.bull.process(queue.handle);
        })
    }
}