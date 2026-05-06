import db from "../../db/conn.mjs";

const saveManyWithUpsert = async (collection, data, uniqueKeyBuilder) => {
  if (!data || data.length === 0) return;

  const operations = data.map((item) => ({
    updateOne: {
      filter: uniqueKeyBuilder(item),
      update: { $set: item },
      upsert: true
    }
  }));

  await collection.bulkWrite(operations);
};

export const getWithFallback = async ({
  openf1Function,
  mongoCollection,
  query,
  uniqueKeyBuilder
}) => {
  const collection = db.collection(mongoCollection);

  try {
    const openf1Data = await openf1Function(query);

    if (Array.isArray(openf1Data) && openf1Data.length > 0) {
      await saveManyWithUpsert(collection, openf1Data, uniqueKeyBuilder);

      return {
        source: "openf1",
        count: openf1Data.length,
        data: openf1Data
      };
    }
  } catch (error) {
    console.warn(`OpenF1 failed for ${mongoCollection}. Using DB fallback.`);
  }

  const dbData = await collection.find(query).limit(100).toArray();

  return {
    source: "database",
    count: dbData.length,
    data: dbData
  };
};