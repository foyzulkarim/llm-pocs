import { exec } from 'child_process';

const prompts = [
  "Generate a random joke.",
  "What is the weather like today?",
  "Summarize the plot of Inception.",
  "Explain quantum computing in simple terms.",
  "What is the capital of France?",
  "Give me a random motivational quote.",
  "Describe the process of photosynthesis.",
  "Who won the FIFA World Cup in 2018?",
  "What is the meaning of life?",
  "Explain blockchain technology in two sentences.",
  "Generate a Haiku about the ocean.",
  "What is the population of Japan?",
  "Tell me a fun fact about space.",
  "What are the principles of Object-Oriented Programming?",
  "Summarize the history of the Roman Empire.",
  "Explain how machine learning works.",
  "Who is Albert Einstein?",
  "How do airplanes fly?",
  "Write a Python script to reverse a string.",
  "What is Node.js used for?",
  "List three benefits of using cloud computing.",
  "What is the difference between HTTP and HTTPS?",
  "Define the term - microservices architecture.",
  "Write a SQL query to find duplicate rows in a table.",
  "Explain the difference between Docker and Kubernetes.",
  "What are the benefits of TypeScript over JavaScript?",
  "How does the Internet work?",
  "Describe how DNS works.",
  "Write a regex to validate an email address.",
  "What is the difference between REST and GraphQL?",
  "Explain the concept of event-driven architecture.",
  "What is serverless computing?",
  "Give me an example of a design pattern.",
  "How does OAuth2 work?",
  "What is the difference between synchronous and asynchronous programming?",
  "Explain how garbage collection works in JavaScript.",
  "Write a JavaScript function to calculate Fibonacci numbers.",
  "What is a distributed system?",
  "What are the best practices for API design?",
  "How does Load Balancing work?",
  "What is an IAM role in cloud computing?",
  "Explain the CAP theorem.",
  "What is CI/CD?",
  "What is the difference between a monolith and a microservice?",
  "How does caching improve performance?",
  "What are the key features of React.js?",
  "Explain the concept of eventual consistency.",
  "What is a Kubernetes pod?",
  "Write a Bash script to count the number of lines in a file.",
  "What are the key characteristics of a PWA?",
  "Define the term machine learning.",
  "Explain the difference between AI and machine learning.",
  "What is the Turing test?",
  "List the different HTTP status codes and their meanings.",
  "What are the advantages of cloud-native architecture?",
  "Explain the concept of immutable infrastructure.",
  "Write a JavaScript function to sort an array of numbers.",
  "What is the purpose of a firewall?",
  "How does SSL/TLS encryption work?",
  "Explain the concept of Infrastructure as Code (IaC).",
  "What are the key features of AWS Lambda?",
  "How does server-side rendering differ from client-side rendering?",
  "What are webhooks, and how are they used?",
  "Write a Python script to scrape a webpage.",
  "What are the pros and cons of microservices?",
  "Explain the role of a CDN in web development.",
  "What is an ETL pipeline?",
  "How does RESTful API design differ from RPC-style APIs?",
  "Explain Kubernetes StatefulSets and their use cases.",
  "Describe the anatomy of a Dockerfile.",
  "What is the concept of shared nothing architecture?",
  "Write a SQL query to find the second-highest salary in a table.",
  "What are the best practices for designing a scalable database?",
  "How does two-factor authentication (2FA) work?",
  "What is the difference between vertical scaling and horizontal scaling?",
  "How do message queues improve system performance?",
  "Write a JavaScript function to debounce an input field.",
  "What are some common security vulnerabilities in web applications?",
  "How does a graph database differ from a relational database?",
  "Explain the principles of the Twelve-Factor App.",
  "What is the difference between stateless and stateful applications?",
  "How does a reverse proxy server work?",
  "What is the concept of eventual consistency in distributed systems?",
  "Explain the role of sharding in database scaling.",
  "Write a JavaScript function to generate a random string.",
  "What is the significance of the OSI model in networking?",
  "What are the benefits of container orchestration?",
  "How does a webhook differ from an API endpoint?",
  "Explain the principles of Zero Trust security.",
  "What are the challenges of implementing distributed transactions?",
  "How does a Content Delivery Network (CDN) improve web performance?",
  "What is the difference between public, private, and hybrid cloud?",
  "Write a Python script to convert JSON to CSV.",
  "Explain the concept of a service mesh in microservices.",
  "What are the key features of GraphQL?",
  "How does WebSocket differ from HTTP?",
  "What is the purpose of the ACID properties in databases?",
  "Explain the concept of event sourcing in system design.",
  "How does a Load Balancer distribute traffic?",
  "What is an API gateway, and why is it important?",
  "Write a function in JavaScript to check if a string is a palindrome.",
  "What are the advantages of asynchronous programming?",
  "Explain the concept of polyglot persistence.",
  "What is the difference between synchronous and asynchronous APIs?",
  "How does CI/CD streamline the development process?",
  "What are the benefits of using OAuth for authentication?",
  "Write a SQL query to join two tables and filter results.",
  "What is a state machine, and where is it used?",
  "Explain the principles of Domain-Driven Design (DDD).",
  "What are the differences between monolithic and SOA architectures?",
  "How does distributed logging work in a microservices architecture?",
  "What is the significance of Kubernetes namespaces?",
  "Explain the concept of blue-green deployment.",
  "What are the benefits of using a GraphQL API?",
  "Write a script to generate random passwords.",
  "How does gRPC differ from REST?",
  "What is the difference between a VM and a container?",
  "Explain how caching strategies improve API performance.",
  "What are the benefits of edge computing?",
  "How does Kubernetes handle scaling?",
  "Write a JavaScript function to throttle API requests.",
  "What is the significance of service discovery in microservices?",
  "What are the challenges of scaling relational databases?",
  "Explain the concept of a circuit breaker in distributed systems.",
  "How does serverless architecture differ from traditional hosting?",
  "Write a Python script to parse XML data.",
  "What is the purpose of an index in a database?",
  "Explain the concept of Continuous Monitoring (CM).",
  "How do web sockets enable real-time communication?",
  "What is the difference between symmetric and asymmetric encryption?",
  "How does Docker handle networking between containers?",
  "Write a SQL query to create a new table with constraints.",
  "What is the purpose of a distributed cache?",
  "Explain the role of Helm in Kubernetes.",
  "What is the difference between synchronous and event-driven messaging?",
  "What is the significance of observability in modern applications?",
  "Write a JavaScript function to find duplicates in an array.",
  "What are the challenges of maintaining data consistency in distributed systems?",
  "Explain the concept of API rate limiting.",
  "How does DNS load balancing work?",
  "What is the importance of a Service Level Agreement (SLA)?",
  "How do feature flags enable incremental rollouts?",
  "Explain the principles of DevSecOps.",
  "What are the challenges of running stateful workloads in Kubernetes?",
  "Write a JavaScript function to flatten a nested array.",
  "What is a sidecar pattern in microservices?",
  "How do cloud providers implement shared responsibility models?",
  "What is the significance of event-driven architecture in modern applications?",
  "Explain the concept of a rolling update in Kubernetes."
];

function sendCurlRequest(id, prompt) {
    const start  = new Date().getTime();
    const port = id % 2 === 0 ? 11435 : 11436;
    console.log(`Request ${id} sent at: ${new Date().toISOString()}`);
    return new Promise((resolve, reject) => {
        exec(`curl --max-time 300 \
        -X POST http://localhost:${port}/api/generate \
        -H "Content-Type: application/json" \
        -d '{"model":"llama3.2","prompt":"${prompt}","stream":false}'`, (error, stdout, stderr) => {
            // console.log(`Request ${id} received at: ${new Date().toISOString()}`, { prompt });
            const diff = new Date().getTime() - start;
            console.log(`Request ${id} took ${diff} ms`);
            if (error) {
                reject(error);
            }
            resolve(stdout);
        });
    });
}

const requestPromises = [];
const totalStart = new Date().getTime();
for (let i = 0; i < prompts.length; i++) {
    requestPromises.push(sendCurlRequest(i + 1, prompts[i]));
}

Promise.all(requestPromises)
    .then(responses => {
        responses.forEach(response => console.log(response.length));
        const totalDiff = new Date().getTime() - totalStart;
        const timeInSec = totalDiff / 1000;
        console.log(`Total time taken: ${timeInSec} ms, total prompt handled ${prompts.length}`);
    })
    .catch(error => console.error(error));
