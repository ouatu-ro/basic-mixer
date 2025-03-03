class AsyncTaskQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.activeCount = 0;
    this.queue = [];
  }
  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.activeCount === this.concurrency) {
      return;
    }
    if (this.queue.length === 0) {
      return;
    }
    const { task, resolve, reject } = this.queue.shift();
    this.activeCount++;
    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.activeCount--;
      this.processQueue();
    }
  }
  size() {
    return this.queue.length;
  }
}

// Create a queue that runs up to 2 tasks concurrently.
const queue = new AsyncTaskQueue(3);

// Task that resolves after 1000ms.
const task1 = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log("Task 1 completed");
      resolve("Result 1");
    }, 1000);
  });

// Task that resolves after 500ms.
const task2 = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log("Task 2 completed");
      resolve("Result 2");
    }, 1000);
  });

// Task that rejects after 700ms.
const task3 = () =>
  new Promise((_, reject) => {
    setTimeout(() => {
      console.log("Task 3 failed");
      reject(new Error("Error in Task 3"));
    }, 2000);
  });

(async () => {
  try {
    const result1 = await queue.enqueue(task1);
    console.log("Task 1 result:", result1);
  } catch (error) {
    console.error("Task 1 error:", error);
  }
})();

queue
  .enqueue(task2)
  .then((result) => console.log("Task 2 result:", result))
  .catch((error) => console.error("Task 2 error:", error));

queue
  .enqueue(task3)
  .then((result) => console.log("Task 3 result:", result))
  .catch((error) => console.error("Task 3 error:", error));

// Check the size of the queue (tasks waiting to start)
console.log("Waiting tasks:", queue.size());
