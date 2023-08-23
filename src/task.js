const { v4 } = require("uuid");
const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TableName = "TaskTable";
 
function createResponse(status, body) {
  return ({
    statusCode: status,
    body: JSON.stringify(body),
  });
}

const addTask = async (event) => {
  try {
    const { title, description } = JSON.parse(event.body);
    const createdAt = new Date();
    const id = v4();

    const newTask = {
      id,
      title,
      description,
      createdAt,
    };

    await dynamoDB.put({
      TableName,
      Item: newTask,
    }).promise();

    return createResponse(201, newTask);
  } catch (error) {
    console.error("addTask error:", error);
    return createResponse(500, { message: "Internal server error" });
  }
};

const getTasks = async () => {
  try {
    const data = await dynamoDB.scan({
      TableName,
    }).promise();

    const results = data.Items;

    return createResponse(200, { results });
  } catch (error) {
    console.error("getTasks error:", error);
    return createResponse(500, { message: "Internal server error" });
  }
};

const getTask = async (event) => {
  try {
    const { id } = event.pathParameters;

    const result = await dynamoDB.get({
      TableName,
      Key: { id },
    }).promise();

    const task = result.Item;

    if (!task) {
      return createResponse(404, { message: "Task not found" });
    }

    return createResponse(200, task);
  } catch (error) {
    console.error("getTask error:", error);
    return createResponse(500, { message: "Internal server error" });
  }
};

module.exports = {
  addTask,
  getTasks,
  getTask,
};
