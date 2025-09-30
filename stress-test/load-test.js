const axios = require('axios');
const { performance } = require('perf_hooks');

class LoadTester {
  constructor(baseURL = 'http://localhost:5000', concurrency = 1000) {
    this.baseURL = baseURL;
    this.concurrency = concurrency;
    this.results = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      responseTimes: [],
      errors: [],
      startTime: null,
      endTime: null
    };
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    const startTime = performance.now();
    
    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      this.results.totalRequests++;
      this.results.successfulRequests++;
      this.results.responseTimes.push(responseTime);

      return {
        success: true,
        status: response.status,
        responseTime,
        data: response.data
      };
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      this.results.totalRequests++;
      this.results.failedRequests++;
      this.results.responseTimes.push(responseTime);
      this.results.errors.push({
        endpoint,
        error: error.message,
        status: error.response?.status
      });

      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        responseTime
      };
    }
  }

  async runConcurrentRequests(endpoints) {
    const promises = [];
    
    for (let i = 0; i < this.concurrency; i++) {
      const endpoint = endpoints[i % endpoints.length];
      promises.push(this.makeRequest(endpoint));
    }
    return Promise.all(promises);
  }

  calculateStats() {
    const responseTimes = this.results.responseTimes;
    const sortedTimes = responseTimes.sort((a, b) => a - b);
    
    const stats = {
      totalRequests: this.results.totalRequests,
      successfulRequests: this.results.successfulRequests,
      failedRequests: this.results.failedRequests,
      successRate: (this.results.successfulRequests / this.results.totalRequests * 100).toFixed(2),
      averageResponseTime: (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2),
      minResponseTime: Math.min(...responseTimes).toFixed(2),
      maxResponseTime: Math.max(...responseTimes).toFixed(2),
      p50ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.5)].toFixed(2),
      p90ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.9)].toFixed(2),
      p95ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.95)].toFixed(2),
      p99ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.99)].toFixed(2),
      requestsPerSecond: (this.results.totalRequests / ((this.results.endTime - this.results.startTime) / 1000)).toFixed(2)
    };

    return stats;
  }

  async runLoadTest() {
    console.log(`Starting load test with ${this.concurrency} concurrent requests...`);
    console.log(`Target: ${this.baseURL}`);


    const endpoints = [
      '/health',
      '/api/products',
      '/api/products/featured',
      '/api/products/search?q=water',
      '/api/products/search?category=water-bottles'
    ];

    try {
      this.results.startTime = performance.now();
      await this.runConcurrentRequests(endpoints);
    } catch (error) {
      console.error('Load test failed:', error.message);
    }

    this.results.endTime = performance.now();
    
    const stats = this.calculateStats();
    this.printResults(stats);
    
    return stats;
  }

  printResults(stats) {
    console.log('\n LOAD TEST RESULTS');
    console.log(`Total Requests: ${stats.totalRequests}`);
    console.log(`Successful Requests: ${stats.successfulRequests}`);
    console.log(`Failed Requests: ${stats.failedRequests}`);
    console.log(`Success Rate: ${stats.successRate}%`);
    console.log(`Requests/Second: ${stats.requestsPerSecond}`);
    console.log('\n RESPONSE TIME STATISTICS');
    console.log(`Average: ${stats.averageResponseTime}ms`);
    console.log(`Min: ${stats.minResponseTime}ms`);
    console.log(`Max: ${stats.maxResponseTime}ms`);
    console.log(`50th percentile: ${stats.p50ResponseTime}ms`);
    console.log(`90th percentile: ${stats.p90ResponseTime}ms`);
    console.log(`95th percentile: ${stats.p95ResponseTime}ms`);
    console.log(`99th percentile: ${stats.p99ResponseTime}ms`);

    // Performance criteria
    console.log('\nPERFORMANCE CRITERIA');
    const avgResponseTime = parseFloat(stats.averageResponseTime);
    const p95ResponseTime = parseFloat(stats.p95ResponseTime);
    const successRate = parseFloat(stats.successRate);

    console.log(`Average Response Time: ${avgResponseTime < 200 ? 'PASS' : 'FAIL'} (${avgResponseTime}ms < 200ms)`);
    console.log(`95th Percentile: ${p95ResponseTime < 500 ? 'PASS' : 'FAIL'} (${p95ResponseTime}ms < 500ms)`);
    console.log(`Success Rate: ${successRate > 99 ? 'PASS' : 'FAIL'} (${successRate}% > 99%)`);

    if (this.results.errors.length > 0) {
      console.log('\n ERRORS');
      const errorSummary = {};
      this.results.errors.forEach(error => {
        const key = `${error.endpoint} - ${error.status || 'Network Error'}`;
        errorSummary[key] = (errorSummary[key] || 0) + 1;
      });
      
      Object.entries(errorSummary).forEach(([error, count]) => {
        console.log(`${error}: ${count} occurrences`);
      });
    }

  }
}

// Run the load test
async function main() {
  const concurrency = process.argv[2] ? parseInt(process.argv[2]) : 1000;
  const baseURL = process.argv[3] || 'http://localhost:5000';
  
  const tester = new LoadTester(baseURL, concurrency);
  await tester.runLoadTest();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = LoadTester;
