class AsyncTaskQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency; // Maximum number of concurrent tasks
    this.activeCount = 0; // Count of tasks currently running
    this.queue = []; // Queue holding tasks waiting to be executed
  }

  // Enqueue a task and return a promise that resolves or rejects when the task completes.
  enqueue(task) {
    if (typeof task !== "function") {
      throw new Error("Task must be a function returning a promise.");
    }

    return new Promise((resolve, reject) => {
      // Add the task and its associated promise handlers to the queue.
      this.queue.push({ task, resolve, reject });
      // Attempt to process the queue.
      this.processQueue();
    });
  }

  // Returns the number of tasks waiting in the queue.
  size() {
    return this.queue.length;
  }

  // Internal method to process the next task if there's available capacity.
  processQueue() {
    // Only process if there's capacity and pending tasks.
    while (this.activeCount < this.concurrency && this.queue.length) {
      const { task, resolve, reject } = this.queue.shift();
      this.activeCount++;

      // Execute the task, ensuring any synchronous exceptions are caught.
      (async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeCount--;
          this.processQueue();
        }
      })();
    }
  }
}

// Create a queue that runs up to 2 tasks concurrently.
const queue = new AsyncTaskQueue(2);

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
    }, 500);
  });

// Task that rejects after 700ms.
const task3 = () =>
  new Promise((_, reject) => {
    setTimeout(() => {
      console.log("Task 3 failed");
      reject(new Error("Error in Task 3"));
    }, 700);
  });

// Enqueue tasks and attach result/error handlers.
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
