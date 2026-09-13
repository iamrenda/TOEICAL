import bcrypt from "bcrypt";
import DB from "../db/db.ts";
import { TEST_USER, TEST_WRITING_TOPICS, TEST_WRITING_TAGS } from "./constants.ts";

const insertUser = async () => {
    const passwordHash = await bcrypt.hash("password", 10);
    await DB().query(
        `INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)`,
        [TEST_USER.username, TEST_USER.email, passwordHash],
    );
};

const insertWritingTopic = async () => {
    for (const topic of TEST_WRITING_TOPICS) {
        await DB().query(
            `INSERT INTO writing_topics (id, topic, description, difficulty, limit_time_minutes, recommended_word_count) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                topic.id,
                topic.topic,
                topic.description,
                topic.difficulty,
                topic.limit_time_minutes,
                topic.recommended_word_count,
            ],
        );
    }
};

const insertWritingTags = async () => {
    for (const tag of TEST_WRITING_TAGS) {
        await DB().query(
            `INSERT INTO writing_tags (tag) 
            VALUES ($1)`,
            [tag],
        );
    }
};

const insertWritingTopicsTags = async () => {
    for (const topic of TEST_WRITING_TOPICS) {
        const randomTags = TEST_WRITING_TAGS.filter(() => Math.random() < 0.5);
        for (const tag of randomTags) {
            const res = await DB().query<{ id: number }>("SELECT id FROM writing_tags WHERE tag = $1", [tag]);
            const tagId = res[0]!.id;
            await DB().query(
                `INSERT INTO writing_topic_tags (writing_topic_id, writing_tag_id) 
                VALUES ($1, $2)`,
                [topic.id, tagId],
            );
        }
    }
};

const seed = async () => {
    await insertUser();
    await insertWritingTopic();
    await insertWritingTags();
    await insertWritingTopicsTags();
};

export default seed;
