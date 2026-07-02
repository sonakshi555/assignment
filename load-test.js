import http from 'k6/http';
import { check, sleep } from 'k6';

// Test execution stages simulating typical load profiles
export const options = {
    stages: [
        { duration: '20s', target: 15 },  // Ramp-up: Simulating incoming user blocks
        { duration: '40s', target: 45 },  // Stress state: Evaluating thread performance 
        { duration: '20s', target: 0 },   // Cool-down: Graceful process winding down
    ],
    thresholds: {
        http_req_failed: ['rate<0.02'],   // Error tolerances must remain below 2%
        http_req_duration: ['p(95)<400'], // 95% of target requests must execute under 400ms
    },
};

export default function () {
    // Replace this placeholder string with your verified AWS EC2 allocation IP
    const targetUrl = 'http://YOUR_EC2_PUBLIC_IP/api/data';
    
    const params = {
        headers: {
            'User-Agent': 'k6-Engine-Performance-Benchmarking',
        },
    };

    const response = http.get(targetUrl, params);

    // Validate infrastructure capabilities
    check(response, {
        'HTTP handshake status is 200': (r) => r.status === 200,
        'Response envelope verified': (r) => r.body.includes('dynamic-api'),
    });

    // Pacing loop delay to prevent raw client-side thrashing
    sleep(0.5);
}